import { describe, expect, it } from "vitest";
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
});
