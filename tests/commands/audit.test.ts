import { describe, expect, it } from "vitest";
import {
  metadataFindings,
  renderAuditReport,
  starHistoryFinding,
  UNFETCHABLE_DAYS,
  unfetchableDetail,
} from "../../src/commands/audit.ts";
import type { RepoMetadata } from "../../src/github/repo-metadata-graphql.ts";

const NOW = new Date("2026-10-05T06:00:00Z");

function meta(over: Partial<RepoMetadata> = {}): RepoMetadata {
  return {
    nameWithOwner: "o/r",
    githubId: 1,
    stars: 100,
    pushed: "2026-10-01T00:00:00Z",
    archived: false,
    license: "MIT",
    topics: [],
    lastRelease: null,
    lastCommit: "2026-10-01T00:00:00Z",
    lastTag: null,
    lastStableTag: null,
    commits90d: 12,
    language: "Python",
    ...over,
  };
}

// No commit, release or tag within twelve months of NOW.
const STALE = { lastCommit: "2025-09-01T00:00:00Z", commits90d: 0 };

describe("unfetchableDetail", () => {
  it("reports an entry that has never been measured", () => {
    expect(unfetchableDetail("o/r", null, NOW)).toMatch(/never been fetched/);
  });

  it("reports an entry whose newest snapshot is older than the threshold", () => {
    expect(unfetchableDetail("o/r", "2026-09-14", NOW)).toMatch(/last refreshed 2026-09-14 \(21 days ago\)/);
  });

  // One missed week is already covered by the generate fallback's stale marker.
  it(`stays quiet within ${UNFETCHABLE_DAYS} days`, () => {
    expect(unfetchableDetail("o/r", "2026-10-05", NOW)).toBeNull();
    expect(unfetchableDetail("o/r", "2026-09-21", NOW)).toBeNull();
  });
});

describe("renderAuditReport", () => {
  it("gives unfetchable entries their own heading", () => {
    const report = renderAuditReport([
      { kind: "unfetchable", entry: "Cat / Tool", detail: "o/r has never been fetched" },
    ]);
    expect(report).toContain(`### Not refreshed in ${UNFETCHABLE_DAYS}+ days - fetch keeps failing (1)`);
    expect(report).toContain("- **Cat / Tool** — o/r has never been fetched");
  });

  // The workflow wraps every reporter's sections in one intro and one footer.
  it("renders only its own sections, leaving the issue's intro and footer to the workflow", () => {
    const report = renderAuditReport([{ kind: "archived", entry: "Cat / Tool", detail: "o/r is archived" }]);
    expect(report).toBe("### Archived upstream (1)\n\n- **Cat / Tool** — o/r is archived\n");
  });

  it("renders nothing when nothing drifted", () => {
    expect(renderAuditReport([])).toBe("");
  });
});

describe("metadataFindings", () => {
  const at = NOW.getTime();
  const kinds = (entry: { note?: string; lifecycle?: string }, m: RepoMetadata) =>
    metadataFindings("Cat / Tool", "o/r", entry, m, at).map((f) => f.kind);

  it("stays quiet for a healthy repo", () => {
    expect(kinds({}, meta())).toEqual([]);
  });

  // LoRAX on 2026-10-19 was listed under both headings for one missing note.
  it("files an archived repo once, under archived, not again as dead", () => {
    expect(kinds({}, meta({ archived: true, ...STALE }))).toEqual(["archived"]);
  });

  it("files a repo that went quiet past the twelve-month line as dead", () => {
    expect(kinds({}, meta(STALE))).toEqual(["dead-no-note"]);
  });

  it("asks nothing of an entry whose note or lifecycle already explains it", () => {
    expect(kinds({ note: "Archived; X for new work." }, meta({ archived: true }))).toEqual([]);
    expect(kinds({ lifecycle: "historical" }, meta(STALE))).toEqual([]);
  });

  // A note explains the project's state, not its slug, so it never silences a rename.
  it("reports a rename even when the entry carries a note", () => {
    expect(kinds({ note: "Archived." }, meta({ nameWithOwner: "o/new", archived: true }))).toEqual(["renamed"]);
  });
});

describe("starHistoryFinding", () => {
  const window = (net: number) => ({ from: "2026-09-28", to: "2026-10-28", net });

  // Removals only pull the net figure down, so net below given is normal:
  // across the catalog on 2026-10-28 it was a median 0.89 of it.
  it("accepts a net change at or below the stars GitHub records as given", () => {
    expect(starHistoryFinding("Cat / R", "o/r", window(125), 144)).toBeNull();
    expect(starHistoryFinding("Cat / R", "o/r", window(-40), 12)).toBeNull();
  });

  it("absorbs a few stars of day-boundary slack", () => {
    expect(starHistoryFinding("Cat / R", "o/r", window(13), 10)).toBeNull();
    expect(starHistoryFinding("Cat / R", "o/r", window(1020), 1000)).toBeNull();
  });

  it("flags a net change GitHub's history cannot account for", () => {
    const finding = starHistoryFinding("Cat / R", "o/r", window(500), 111);
    expect(finding?.kind).toBe("star-history");
    expect(finding?.detail).toMatch(/\+500 stars from 2026-09-28 to 2026-10-28.*only 111/);
  });

  it("renders under its own heading", () => {
    const finding = starHistoryFinding("Cat / R", "o/r", window(500), 111);
    expect(renderAuditReport(finding ? [finding] : [])).toContain(
      "### Our star counts disagree with GitHub's star history (1)",
    );
  });
});
