import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { MIN_FRESH_RATIO } from "../../src/constants.ts";
import { type FetchResult, fetchRepoData, freshRatio, loadApiData } from "../../src/generator/fetch-api.ts";
import { buildSiteData } from "../../src/generator/site-data.ts";
import type { RepoMetadata } from "../../src/github/repo-metadata-graphql.ts";
import { type LatestRepo, loadLatest, saveLatest } from "../../src/store/latest.ts";
import type { DataPaths } from "../../src/store/paths.ts";
import { loadSnapshots, type StarSnapshot, writeSnapshots } from "../../src/store/snapshots.ts";

const mockMetadata = vi.fn<(repos: string[]) => Promise<Map<string, RepoMetadata>>>();
vi.mock("../../src/github/repo-metadata-graphql.ts", () => ({
  fetchRepoMetadataBatch: (repos: string[]) => mockMetadata(repos),
}));

function result(over: Partial<FetchResult>): FetchResult {
  return { data: {}, stale: [], failed: [], attempted: 0, ...over };
}

// These guard the semantics the unattended weekly job depends on. Before the
// gate existed, a total GitHub outage fetched 0 of 249 repos, exited 0, and
// still committed, version-bumped, released and deployed week-old fallback.
describe("freshRatio", () => {
  it("is 1 when every repo returned live data", () => {
    expect(freshRatio(result({ attempted: 249 }))).toBe(1);
  });

  it("counts stale fallbacks as not fresh", () => {
    const r = result({ attempted: 100, stale: Array.from({ length: 20 }, (_, i) => `o/r${i}`) });
    expect(freshRatio(r)).toBeCloseTo(0.8);
  });

  it("counts repos with no fallback as not fresh", () => {
    const r = result({ attempted: 10, failed: ["o/a", "o/b"] });
    expect(freshRatio(r)).toBeCloseTo(0.8);
  });

  it("is 0 for a total outage — the case the gate exists for", () => {
    const stale = Array.from({ length: 249 }, (_, i) => `o/r${i}`);
    const r = result({ attempted: 249, stale });
    expect(freshRatio(r)).toBe(0);
    expect(freshRatio(r)).toBeLessThan(MIN_FRESH_RATIO);
  });

  it("does not divide by zero when nothing was attempted", () => {
    expect(freshRatio(result({ attempted: 0 }))).toBe(1);
  });

  it("passes the gate for a handful of failures but not for a tenth of the list", () => {
    const withStale = (n: number) =>
      freshRatio(result({ attempted: 249, stale: Array.from({ length: n }, (_, i) => `o/r${i}`) }));
    expect(withStale(5)).toBeGreaterThanOrEqual(MIN_FRESH_RATIO);
    expect(withStale(30)).toBeLessThan(MIN_FRESH_RATIO);
  });
});

const tmpDir = mkdtempSync(join(tmpdir(), "curator-fetch-api-test-"));
afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const YAML = `categories:
- name: Cat
  entries:
  - name: Fresh
    repo: o/fresh
    tagline: Fresh tagline
  - name: Lagging
    repo: o/lagging
    tagline: Lagging tagline
`;

const IDS: Record<string, number> = { "o/fresh": 1, "o/lagging": 2 };

/**
 * Data where o/fresh was measured today (so today is the last run's date) and
 * o/lagging last refreshed a week ago. `rows` are [repo, daysAgo, stars]; each
 * repo's newest row becomes its data/latest.json entry.
 */
function seedData(tag: string, rows: [string, number, number][], license: string | null = "MIT"): DataPaths {
  const paths = { snapshotsDir: join(tmpDir, tag, "snapshots"), latestPath: join(tmpDir, tag, "latest.json") };
  const snapshots: StarSnapshot[] = rows.map(([repo, n, stars]) => ({
    date: daysAgo(n),
    id: IDS[repo] ?? 0,
    repo,
    stars,
  }));
  writeSnapshots(
    paths.snapshotsDir,
    snapshots,
    snapshots.map((r) => r.date.slice(0, 4)),
  );
  const latest: Record<string, LatestRepo> = {};
  for (const row of [...snapshots].sort((a, b) => a.date.localeCompare(b.date))) {
    latest[row.repo] = {
      date: row.date,
      id: row.id,
      stars: row.stars,
      score: 50,
      archived: false,
      pushed: "",
      license,
      topics: [],
      lastRelease: null,
      lastCommit: null,
      lastTag: null,
      lastStableTag: null,
      commits90d: null,
    };
  }
  saveLatest(paths.latestPath, latest);
  return paths;
}

describe("loadApiData", () => {
  // The run that wrote o/fresh today could not refresh o/lagging; both
  // outputs must say so instead of presenting week-old figures as current.
  it("marks an entry whose last measurement predates the last run as stale", () => {
    const paths = seedData("stale", [
      ["o/fresh", 0, 500],
      ["o/lagging", 7, 900],
    ]);
    const data = loadApiData(YAML, paths);
    expect(data["o/fresh"]?.stale).toBeUndefined();
    expect(data["o/lagging"]?.stale).toBe(daysAgo(7));
  });

  // A week-old fallback measured from today compared its count with itself
  // ("+0 last 7d") and stretched the 30-day window to 37 days.
  it("anchors trend windows on the entry's own measurement date", () => {
    const paths = seedData("anchor", [
      ["o/fresh", 0, 500],
      ["o/lagging", 7, 1500],
      ["o/lagging", 14, 1400],
      ["o/lagging", 37, 1000],
    ]);
    const lagging = loadApiData(YAML, paths)["o/lagging"];
    expect(lagging?.trend7d).toBe(100);
    expect(lagging?.trend7dDays).toBe(7);
    expect(lagging?.trend30d).toBe(500);
    expect(lagging?.trend30dDays).toBe(30);
    expect(lagging?.trend).toBe(500);
  });

  it("takes taglines from projects.yaml only", () => {
    const paths = seedData("tagline", [
      ["o/fresh", 0, 500],
      ["o/lagging", 0, 900],
    ]);
    const data = loadApiData(YAML.replace("    tagline: Fresh tagline\n", ""), paths);
    expect(data["o/fresh"]?.tagline).toBeNull();
    expect(data["o/lagging"]?.tagline).toBe("Lagging tagline");
  });

  it("leaves a never-measured entry out, so it renders as stats pending", () => {
    const paths = seedData("pending", [["o/fresh", 0, 500]]);
    expect(loadApiData(YAML, paths)["o/lagging"]).toBeUndefined();
  });
});

function meta(over: Partial<RepoMetadata>): RepoMetadata {
  return {
    nameWithOwner: null,
    githubId: null,
    stars: 0,
    pushed: "",
    archived: false,
    license: "MIT",
    topics: [],
    lastRelease: null,
    lastCommit: daysAgo(1),
    lastTag: null,
    lastStableTag: null,
    commits90d: 10,
    language: null,
    ...over,
  };
}

describe("fetchRepoData", () => {
  beforeEach(() => mockMetadata.mockReset());

  it("records today's measurement and computes trends from the stored history", async () => {
    const paths = seedData("live", [
      ["o/fresh", 7, 450],
      ["o/fresh", 30, 300],
      ["o/lagging", 7, 900],
    ]);
    mockMetadata.mockResolvedValue(
      new Map([
        ["o/fresh", meta({ githubId: 1, stars: 500 })],
        ["o/lagging", meta({ githubId: 2, stars: 950 })],
      ]),
    );
    const result = await fetchRepoData(YAML, paths);
    expect(result.data["o/fresh"]?.trend7d).toBe(50);
    expect(result.data["o/fresh"]?.trend30d).toBe(200);
    expect(result.data["o/fresh"]?.history?.at(-1)).toEqual({ date: daysAgo(0), stars: 500 });

    const today = loadSnapshots(paths.snapshotsDir).filter((r) => r.date === daysAgo(0));
    expect(today.map((r) => [r.repo, r.stars]).sort()).toEqual([
      ["o/fresh", 500],
      ["o/lagging", 950],
    ]);
    expect(loadLatest(paths.latestPath)["o/fresh"]).toMatchObject({ date: daysAgo(0), id: 1, stars: 500 });
  });

  // Identity is GitHub's id. Keyed by slug, nine upstream renames once
  // stranded five months of history behind slugs nobody read any more.
  it("keeps a renamed repository's history by following its GitHub id", async () => {
    const paths = seedData("rename", [
      ["o/fresh", 30, 300],
      ["o/lagging", 0, 900],
    ]);
    mockMetadata.mockResolvedValue(
      new Map([
        ["o/renamed", meta({ githubId: 1, stars: 420 })],
        ["o/lagging", meta({ githubId: 2, stars: 900 })],
      ]),
    );
    const result = await fetchRepoData(YAML.replace("repo: o/fresh", "repo: o/renamed"), paths);
    expect(result.data["o/renamed"]?.trend30d).toBe(120);
    expect(Object.keys(loadLatest(paths.latestPath)).sort()).toEqual(["o/lagging", "o/renamed"]);
  });

  it("serves the last measurement, marked stale, when a fetch fails", async () => {
    const paths = seedData("fallback", [
      ["o/fresh", 7, 450],
      ["o/lagging", 7, 900],
    ]);
    mockMetadata.mockResolvedValue(new Map([["o/fresh", meta({ githubId: 1, stars: 500 })]]));
    const result = await fetchRepoData(YAML, paths);
    expect(result.stale).toEqual(["o/lagging"]);
    expect(result.data["o/lagging"]).toMatchObject({ stars: 900, stale: daysAgo(7) });
    // Carried forward with its own date, so its age stays visible to the audit.
    expect(loadLatest(paths.latestPath)["o/lagging"]?.date).toBe(daysAgo(7));
  });
});

describe("buildSiteData", () => {
  it("publishes the stale marker and shows NOASSERTION as Other", () => {
    const paths = seedData(
      "site",
      [
        ["o/fresh", 0, 500],
        ["o/lagging", 7, 900],
      ],
      "NOASSERTION",
    );
    const out = buildSiteData({
      yamlContent: YAML,
      apiData: loadApiData(YAML, paths),
      sectionByCategory: new Map(),
      dataAsOf: daysAgo(0),
    });
    const [fresh, lagging] = out.categories[0]?.entries ?? [];
    expect(fresh && "stale" in fresh).toBe(false);
    expect(lagging?.stale).toBe(daysAgo(7));
    expect(lagging?.license).toBe("Other");
  });
});
