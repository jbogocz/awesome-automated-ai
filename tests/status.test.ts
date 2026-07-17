import { describe, expect, it } from "vitest";
import {
  anyShippedAt,
  assessRepo,
  isPrereleaseTag,
  lastLifeSign,
  repoStatus,
  type StatusSignals,
  stableShippedAt,
  statusDot,
} from "../src/status.js";

const NOW = new Date("2026-07-17T08:00:00Z").getTime();

function daysAgo(n: number): string {
  return new Date(NOW - n * 86_400_000).toISOString();
}

function signals(overrides: Partial<StatusSignals>): StatusSignals {
  return {
    archived: false,
    lastCommit: null,
    lastRelease: null,
    lastTag: null,
    lastStableTag: null,
    commits90d: null,
    ...overrides,
  };
}

describe("isPrereleaseTag", () => {
  it("flags PEP 440 / semver prerelease names", () => {
    for (const name of [
      "v4.0.0a2",
      "1.0.0-rc.1",
      "v1.94.0-dev.3",
      "3.7.9.dev3",
      "0.8-alpha",
      "v2.0.0-beta.3",
      "v0.52.0-preview.0",
      "v0.86.3.dev",
      "nightly",
      "v0.3.0-pre",
      "3.3.0b1",
      "v1.3.0rc21",
    ]) {
      expect(isPrereleaseTag(name), name).toBe(true);
    }
  });

  it("keeps stable names stable", () => {
    for (const name of [
      "v1.2.3",
      "3.3.2",
      "v0.10.0",
      "2026.07.1", // calver
      "b10056", // build-number scheme, not a beta
      "release-1.4",
      "v1.0.0-post1", // post-releases are stable
    ]) {
      expect(isPrereleaseTag(name), name).toBe(false);
    }
  });
});

describe("stableShippedAt / anyShippedAt", () => {
  it("stable uses latestRelease and stable tags only", () => {
    const s = signals({ lastRelease: daysAgo(810), lastTag: daysAgo(83), lastStableTag: daysAgo(810) });
    expect(stableShippedAt(s)).toBe(daysAgo(810)); // the alpha tag does not count
    expect(anyShippedAt(s)).toBe(daysAgo(83)); // but it IS a life sign
  });

  it("returns null when the repo ships nothing", () => {
    expect(stableShippedAt(signals({}))).toBeNull();
    expect(anyShippedAt(signals({}))).toBeNull();
  });

  it("ignores invalid dates", () => {
    expect(anyShippedAt(signals({ lastRelease: "not-a-date", lastTag: daysAgo(5) }))).toBe(daysAgo(5));
  });
});

describe("repoStatus", () => {
  it("archived is dead even with fresh commits", () => {
    expect(repoStatus(signals({ archived: true, lastCommit: daysAgo(1), commits90d: 50 }), NOW)).toBe("dead");
  });

  it("no signals at all is dead", () => {
    expect(repoStatus(signals({}), NOW)).toBe("dead");
  });

  it("life sign 12+ months old is dead", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(400) }), NOW)).toBe("dead");
  });

  it("life sign 6-12 months old is quiet", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(250), commits90d: 0 }), NOW)).toBe("quiet");
  });

  it("healthy repo is active: fresh commits, pulse, recent release", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(2), lastRelease: daysAgo(20), commits90d: 40 }), NOW)).toBe(
      "active",
    );
  });

  // pushedAt is not a signal: only mainline commits and shipping count.
  it("stale mainline cannot be rescued by anything but shipping", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(498), lastRelease: daysAgo(591) }), NOW)).toBe("dead");
  });

  // Fresh alphas atop a 2+ year old stable channel: quiet, not active
  // (and not dead — prereleases are life signs).
  it("prerelease tags do not rescue a stale stable-release channel", () => {
    expect(
      repoStatus(
        signals({
          lastCommit: daysAgo(62),
          lastRelease: daysAgo(810),
          lastTag: daysAgo(83), // v4.0.0a2
          lastStableTag: daysAgo(810), // 3.3.2
          commits90d: 121,
        }),
        NOW,
      ),
    ).toBe("quiet");
  });

  // Projects that tag + publish to a registry without GitHub Releases.
  it("fresh stable tags rescue a repo with a stale Releases feed", () => {
    expect(
      repoStatus(
        signals({
          lastCommit: daysAgo(62),
          lastRelease: daysAgo(810),
          lastTag: daysAgo(83),
          lastStableTag: daysAgo(83),
          commits90d: 121,
        }),
        NOW,
      ),
    ).toBe("active");
  });

  it("stale tags cap at quiet even when mainline commits are fresh-ish", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(94), lastTag: daysAgo(807), commits90d: 0 }), NOW)).toBe("quiet");
  });

  it("shipping stalled 2+ years caps a busy repo at quiet", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(10), lastRelease: daysAgo(800), commits90d: 30 }), NOW)).toBe(
      "quiet",
    );
  });

  // Coasting: fresh-ish commit but no pulse and nothing shipped recently.
  it("coasting repos are quiet: <3 commits/90d and no recent ship", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(113), commits90d: 0 }), NOW)).toBe("quiet");
    expect(repoStatus(signals({ lastCommit: daysAgo(85), lastRelease: daysAgo(466), commits90d: 1 }), NOW)).toBe(
      "quiet",
    );
  });

  // A repo that just shipped is not coasting, whatever its commit count.
  it("a recent release keeps a low-commit repo active", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(97), lastRelease: daysAgo(97), commits90d: 0 }), NOW)).toBe(
      "active",
    );
  });

  // Curated lists / research repos never ship; judged on commit pulse alone.
  it("never-shipped repo with a real pulse is active", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(3), commits90d: 60 }), NOW)).toBe("active");
  });

  it("never-shipped repo without a pulse is quiet", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(113), commits90d: 0 }), NOW)).toBe("quiet");
  });

  // Develop-branch projects: mainline merges are rare but releases are fresh.
  it("recent shipping keeps a repo with a stale mainline off red", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(400), lastRelease: daysAgo(30), commits90d: 0 }), NOW)).toBe(
      "active",
    );
  });

  // Older snapshots lack commits90d — unknown must not be treated as zero.
  it("unknown commits90d skips the pulse check instead of guessing", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(10), lastRelease: daysAgo(400), commits90d: null }), NOW)).toBe(
      "active",
    );
  });

  it("invalid dates degrade to dead, never crash", () => {
    expect(repoStatus(signals({ lastCommit: "garbage" }), NOW)).toBe("dead");
  });
});

describe("assessRepo reasons", () => {
  it("labels each leg", () => {
    expect(assessRepo(signals({ archived: true }), NOW).reason).toBe("archived");
    expect(assessRepo(signals({}), NOW).reason).toBe("no-signals");
    expect(assessRepo(signals({ lastCommit: daysAgo(400) }), NOW).reason).toBe("stale");
    expect(assessRepo(signals({ lastCommit: daysAgo(250) }), NOW).reason).toBe("aging");
    expect(
      assessRepo(signals({ lastCommit: daysAgo(10), lastRelease: daysAgo(800), commits90d: 30 }), NOW).reason,
    ).toBe("shipping-stalled");
    expect(assessRepo(signals({ lastCommit: daysAgo(100), commits90d: 1 }), NOW).reason).toBe("coasting");
    expect(assessRepo(signals({ lastCommit: daysAgo(1), commits90d: 90 }), NOW).reason).toBeNull();
  });
});

describe("lastLifeSign", () => {
  it("returns the newest of commit, release and tag", () => {
    expect(lastLifeSign(signals({ lastCommit: daysAgo(100), lastRelease: daysAgo(30), lastTag: daysAgo(60) }))).toBe(
      daysAgo(30),
    );
  });
});

describe("statusDot", () => {
  it("maps statuses to dots", () => {
    expect(statusDot(signals({ lastCommit: daysAgo(1), commits90d: 90 }), NOW)).toBe("🟢");
    expect(statusDot(signals({ lastCommit: daysAgo(250) }), NOW)).toBe("🟡");
    expect(statusDot(signals({ archived: true }), NOW)).toBe("🔴");
  });
});
