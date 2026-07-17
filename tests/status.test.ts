import { describe, expect, it } from "vitest";
import { assessRepo, lastLifeSign, repoStatus, type StatusSignals, shippedAt, statusDot } from "../src/status.js";

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
    commits90d: null,
    ...overrides,
  };
}

describe("shippedAt", () => {
  it("returns the newest of release and tag", () => {
    expect(shippedAt(signals({ lastRelease: daysAgo(800), lastTag: daysAgo(83) }))).toBe(daysAgo(83));
    expect(shippedAt(signals({ lastRelease: daysAgo(10), lastTag: daysAgo(83) }))).toBe(daysAgo(10));
  });

  it("returns null when the repo ships neither", () => {
    expect(shippedAt(signals({}))).toBeNull();
  });

  it("ignores invalid dates", () => {
    expect(shippedAt(signals({ lastRelease: "not-a-date", lastTag: daysAgo(5) }))).toBe(daysAgo(5));
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

  // The July 2026 push-inflation class: pushedAt is NOT a signal here at all.
  // e.g. hitsz-ids/synthetic-data-generator pushed 4d ago (bot branches) but
  // mainline dormant 498d — the rule only sees mainline + shipping.
  it("stale mainline cannot be rescued by anything but shipping", () => {
    expect(repoStatus(signals({ lastCommit: daysAgo(498), lastRelease: daysAgo(591) }), NOW)).toBe("dead");
  });

  // PyCaret: GitHub Releases feed stale (Apr 2024) but tags v4.0.0a2 (83d)
  // and 121 mainline commits/90d — genuinely alive; tags count as shipping.
  it("fresh tags rescue a repo with a stale Releases feed", () => {
    expect(
      repoStatus(
        signals({ lastCommit: daysAgo(62), lastRelease: daysAgo(810), lastTag: daysAgo(83), commits90d: 121 }),
        NOW,
      ),
    ).toBe("active");
  });

  // openai/evals: no GitHub releases, tag 3.0.1 807d old, 0 commits/90d —
  // previously unjudged (no releases), now the stale tag caps it at quiet.
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

  // sweetviz: 0 commits in the window but it SHIPPED 97d ago — not coasting.
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

  // Pre-migration snapshots have no commits90d — pulse check must be skipped,
  // not treated as zero (that would yellow every repo on --no-fetch regens).
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
