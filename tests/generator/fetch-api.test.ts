import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { MIN_FRESH_RATIO } from "../../src/constants.js";
import { DB } from "../../src/db/client.js";
import { type FetchResult, freshRatio, loadApiDataFromDB } from "../../src/generator/fetch-api.js";
import { buildSiteData } from "../../src/generator/site-data.js";

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

/**
 * A DB where o/fresh was measured today (so today is the last run's date) and
 * o/lagging last refreshed a week ago. `rows` are [repo, daysAgo, stars].
 */
function seedDb(tag: string, rows: [string, number, number][], license: string | null = "MIT"): string {
  const path = join(tmpDir, `${tag}.db`);
  const db = new DB(path);
  db.migrate();
  const ids = new Map(["o/fresh", "o/lagging"].map((r) => [r, db.upsertProject(r, r)]));
  db.close();
  const raw = new Database(path);
  const stmt = raw.prepare(
    "INSERT INTO snapshots (project_id, snapshot_date, stars, composite_score, license, archived) VALUES (?, ?, ?, 50, ?, 0)",
  );
  for (const [repo, n, stars] of rows) stmt.run(ids.get(repo), daysAgo(n), stars, license);
  raw.close();
  return path;
}

describe("loadApiDataFromDB", () => {
  // The run that wrote o/fresh today could not refresh o/lagging; both
  // outputs must say so instead of presenting week-old figures as current.
  it("marks an entry whose latest snapshot predates the last run as stale", () => {
    const path = seedDb("stale", [
      ["o/fresh", 0, 500],
      ["o/lagging", 7, 900],
    ]);
    const data = loadApiDataFromDB(YAML, path);
    expect(data["o/fresh"]?.stale).toBeUndefined();
    expect(data["o/lagging"]?.stale).toBe(daysAgo(7));
  });

  // A week-old fallback measured from today compared its count with itself
  // ("+0 last 7d") and stretched the 30-day window to 37 days.
  it("anchors trend windows on the entry's own latest snapshot date", () => {
    const path = seedDb("anchor", [
      ["o/fresh", 0, 500],
      ["o/lagging", 7, 1500],
      ["o/lagging", 14, 1400],
      ["o/lagging", 37, 1000],
    ]);
    const lagging = loadApiDataFromDB(YAML, path)["o/lagging"];
    expect(lagging?.trend7d).toBe(100);
    expect(lagging?.trend7dDays).toBe(7);
    expect(lagging?.trend30d).toBe(500);
    expect(lagging?.trend30dDays).toBe(30);
    expect(lagging?.trend).toBe(500);
  });

  it("drops a cached tagline once projects.yaml no longer declares one", () => {
    const path = seedDb("tagline", [
      ["o/fresh", 0, 500],
      ["o/lagging", 0, 900],
    ]);
    const db = new DB(path);
    const id = db.upsertProject("o/fresh", "o/fresh");
    db.setTagline(id, "Old tagline");
    db.close();
    const data = loadApiDataFromDB(YAML.replace("    tagline: Fresh tagline\n", ""), path);
    expect(data["o/fresh"]?.tagline).toBeNull();
    expect(data["o/lagging"]?.tagline).toBe("Lagging tagline");
  });
});

describe("buildSiteData", () => {
  it("publishes the stale marker and shows NOASSERTION as Other", () => {
    const path = seedDb(
      "site",
      [
        ["o/fresh", 0, 500],
        ["o/lagging", 7, 900],
      ],
      "NOASSERTION",
    );
    const out = buildSiteData({
      yamlContent: YAML,
      apiData: loadApiDataFromDB(YAML, path),
      sectionByCategory: new Map(),
      dataAsOf: daysAgo(0),
    });
    const [fresh, lagging] = out.categories[0]?.entries ?? [];
    expect(fresh && "stale" in fresh).toBe(false);
    expect(lagging?.stale).toBe(daysAgo(7));
    expect(lagging?.license).toBe("Other");
  });
});
