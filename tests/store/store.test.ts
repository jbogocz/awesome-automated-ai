import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendDecision, loadDecisions } from "../../src/store/decisions.ts";
import { findLatest, type LatestRepo, latestDate } from "../../src/store/latest.ts";
import {
  loadSnapshots,
  mergeSnapshots,
  previousStars,
  type StarSnapshot,
  seriesById,
  seriesSince,
  starsNDaysAgo,
  writeSnapshots,
} from "../../src/store/snapshots.ts";

const tmpDir = mkdtempSync(join(tmpdir(), "curator-store-test-"));
afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

const row = (date: string, stars: number, id = 1, repo = "o/r"): StarSnapshot => ({ date, id, repo, stars });

describe("snapshot files", () => {
  it("round-trips rows through one file per year, sorted so diffs are append-shaped", () => {
    const dir = join(tmpDir, "roundtrip");
    const rows = [row("2026-01-05", 20, 2, "o/b"), row("2025-12-29", 10), row("2026-01-05", 11)];
    writeSnapshots(dir, rows, ["2025", "2026"]);
    expect(readFileSync(join(dir, "2026.jsonl"), "utf-8").trim().split("\n")).toEqual([
      '{"date":"2026-01-05","id":2,"repo":"o/b","stars":20}',
      '{"date":"2026-01-05","id":1,"repo":"o/r","stars":11}',
    ]);
    expect(loadSnapshots(dir)).toHaveLength(3);
  });

  it("replaces a same-day row for the same repository instead of duplicating it", () => {
    const merged = mergeSnapshots([row("2026-10-26", 100), row("2026-10-19", 90)], [row("2026-10-26", 105)]);
    expect(merged.map((r) => r.stars).sort()).toEqual([105, 90]);
  });

  it("returns nothing for a directory that does not exist yet", () => {
    expect(loadSnapshots(join(tmpDir, "missing"))).toEqual([]);
  });
});

describe("seriesById", () => {
  it("groups by GitHub id across slugs, oldest first, and drops non-positive counts", () => {
    const series = seriesById([
      row("2026-10-19", 90, 1, "old/slug"),
      row("2026-10-12", 0, 1, "old/slug"),
      row("2026-10-26", 100, 1, "new/slug"),
    ]).get(1);
    expect(series).toEqual([
      { date: "2026-10-19", stars: 90 },
      { date: "2026-10-26", stars: 100 },
    ]);
  });
});

describe("series readers", () => {
  const series = [
    { date: "2026-09-28", stars: 70 },
    { date: "2026-10-05", stars: 80 },
    { date: "2026-10-19", stars: 90 },
    { date: "2026-10-26", stars: 100 },
  ];

  it("previousStars takes the newest point strictly before the date", () => {
    expect(previousStars(series, "2026-10-26")).toBe(90);
    expect(previousStars(series, "2026-09-28")).toBeNull();
  });

  // On a weekly cadence the 30-day point is usually t-28; the date must come back with it.
  it("starsNDaysAgo picks the closest point and reports its real date", () => {
    expect(starsNDaysAgo(series, 30, "2026-10-26")).toEqual({ date: "2026-09-28", stars: 70 });
    expect(starsNDaysAgo(series, 7, "2026-10-26")).toEqual({ date: "2026-10-19", stars: 90 });
  });

  it("starsNDaysAgo refuses a point outside its tolerance rather than mislabel the window", () => {
    expect(starsNDaysAgo(series, 7, "2026-10-15")).toBeNull();
    expect(starsNDaysAgo(series, 90, "2026-10-26")).toBeNull();
  });

  it("starsNDaysAgo breaks a tie towards the later point", () => {
    const tie = [
      { date: "2026-10-17", stars: 1 },
      { date: "2026-10-21", stars: 2 },
    ];
    expect(starsNDaysAgo(tie, 7, "2026-10-26")).toEqual({ date: "2026-10-21", stars: 2 });
  });

  it("seriesSince keeps the window only", () => {
    expect(seriesSince(series, 10, "2026-10-26").map((p) => p.date)).toEqual(["2026-10-19", "2026-10-26"]);
  });
});

describe("latest state", () => {
  const entry = (date: string): LatestRepo => ({
    date,
    id: 1,
    stars: 1,
    score: 1,
    archived: false,
    pushed: "",
    license: null,
    topics: [],
    lastRelease: null,
    lastCommit: null,
    lastTag: null,
    lastStableTag: null,
    commits90d: null,
  });

  // GitHub slugs are case-insensitive: e2b-dev/e2b and e2b-dev/E2B are one repository.
  it("finds a repository regardless of slug case", () => {
    expect(findLatest({ "e2b-dev/E2B": entry("2026-10-26") }, "e2b-dev/e2b")?.date).toBe("2026-10-26");
  });

  it("reports the newest measurement as the data date", () => {
    expect(latestDate({ "a/a": entry("2026-10-19"), "b/b": entry("2026-10-26") })).toBe("2026-10-26");
    expect(latestDate({})).toBeNull();
  });
});

describe("decisions", () => {
  it("appends one line per decision and reads them back", () => {
    const path = join(tmpDir, "decisions", "decisions.jsonl");
    appendDecision(path, { date: "2026-10-28", repo: "o/a", decision: "add", reasoning: "r", prNumber: 7 });
    appendDecision(path, { date: "2026-10-28", repo: "o/b", decision: "reject", reasoning: "r" });
    expect(loadDecisions(path).map((d) => [d.repo, d.prNumber])).toEqual([
      ["o/a", 7],
      ["o/b", undefined],
    ]);
  });
});
