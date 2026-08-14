import { describe, expect, it } from "vitest";
import { DB } from "../../src/db/client.js";
import { computeDailySnapshots } from "../../src/generator/backfill.js";

function iso(y: number, m: number, d: number, hh = 12): string {
  return new Date(Date.UTC(y, m - 1, d, hh)).toISOString();
}

describe("computeDailySnapshots", () => {
  it("produces exactly 30 rows, one per day, for the 30 days ending yesterday", () => {
    const today = new Date(Date.UTC(2026, 3, 19)); // 2026-04-19
    const rows = computeDailySnapshots([], 100, today);
    expect(rows).toHaveLength(30);
    expect(rows[0]).toEqual({ date: "2026-03-20", stars: 100 });
    expect(rows[29]).toEqual({ date: "2026-04-18", stars: 100 });
  });

  it("subtracts stars added after the end of each day", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const stargazers = [
      { starredAt: iso(2026, 4, 18) },
      { starredAt: iso(2026, 4, 15) },
      { starredAt: iso(2026, 4, 10) },
    ];
    const rows = computeDailySnapshots(stargazers, 100, today);

    const byDate = new Map(rows.map((r) => [r.date, r.stars]));
    expect(byDate.get("2026-03-20")).toBe(97);
    expect(byDate.get("2026-04-09")).toBe(97);
    expect(byDate.get("2026-04-10")).toBe(98);
    expect(byDate.get("2026-04-15")).toBe(99);
    expect(byDate.get("2026-04-17")).toBe(99);
    expect(byDate.get("2026-04-18")).toBe(100);
  });

  it("handles a burst all in one day", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const stargazers = [
      { starredAt: iso(2026, 4, 5, 8) },
      { starredAt: iso(2026, 4, 5, 12) },
      { starredAt: iso(2026, 4, 5, 23) },
    ];
    const rows = computeDailySnapshots(stargazers, 50, today);
    const byDate = new Map(rows.map((r) => [r.date, r.stars]));
    expect(byDate.get("2026-04-04")).toBe(47);
    expect(byDate.get("2026-04-05")).toBe(50);
    expect(byDate.get("2026-04-06")).toBe(50);
  });

  it("rows are sorted by date ascending", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const rows = computeDailySnapshots([], 0, today);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].date > rows[i - 1].date).toBe(true);
    }
  });

  it("treats a star at end-of-day boundary as same-day (strict > comparator)", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const stargazers = [
      { starredAt: "2026-04-15T23:59:59.999Z" }, // end-of-day 04-15 boundary
      { starredAt: "2026-04-16T00:00:00.000Z" }, // first ms of 04-16
    ];
    const rows = computeDailySnapshots(stargazers, 100, today);
    const byDate = new Map(rows.map((r) => [r.date, r.stars]));
    // Before 04-15: both stars are "after" → 98
    expect(byDate.get("2026-04-14")).toBe(98);
    // End of 04-15: the 23:59:59.999 star is NOT strictly > endOfDay → only 04-16 star is after → 99
    expect(byDate.get("2026-04-15")).toBe(99);
    // End of 04-16: neither star is after → 100
    expect(byDate.get("2026-04-16")).toBe(100);
  });

  // The failure this guards: the backfill queue used to be seeded from a
  // FAILED fetch (`rawByRepo.get(repo)?.stars ?? 0`), so currentStars was 0
  // and these rows went negative. INSERT OR IGNORE made them permanent, and
  // the next good week rendered a fabricated four-digit "+N last 30d".
  it("goes negative when seeded with zero current stars — why callers must not", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const rows = computeDailySnapshots([{ starredAt: iso(2026, 4, 10) }, { starredAt: iso(2026, 4, 12) }], 0, today);
    expect(rows.some((r) => r.stars < 0)).toBe(true);
  });
});

describe("DB.insertBackfilledSnapshots", () => {
  it("refuses to write non-positive star rows", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertBackfilledSnapshots(id, [
      { date: "2026-04-16", stars: -2 },
      { date: "2026-04-17", stars: 0 },
      { date: "2026-04-18", stars: 41 },
    ]);
    expect(db.getSnapshotSeries(id, 100_000)).toEqual([{ date: "2026-04-18", stars: 41 }]);
    db.close();
  });

  it("never overwrites a measured snapshot with a reconstructed one", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertSnapshot(id, 500, 80);
    const today = new Date().toISOString().split("T")[0];
    db.insertBackfilledSnapshots(id, [{ date: today, stars: 1 }]);
    expect(db.getLatestSnapshot(id)?.stars).toBe(500);
    db.close();
  });
});
