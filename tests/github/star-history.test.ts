import { describe, expect, it } from "vitest";
import { type StarWeek, starsGivenBetween } from "../../src/github/star-history.ts";

// Week of Sunday 2026-10-25 (as GitHub returns it: Unix seconds, days from Sunday).
const week = (start: string, days: number[]): StarWeek => ({
  week: Date.parse(`${start}T00:00:00Z`) / 1000,
  total: days.reduce((a, b) => a + b, 0),
  days,
});

describe("starsGivenBetween", () => {
  const weeks = [week("2026-10-25", [7, 5, 4, 33, 0, 0, 0]), week("2026-10-18", [1, 3, 2, 30, 11, 6, 14])];

  it("sums the days of a window, both ends included", () => {
    expect(starsGivenBetween(weeks, "2026-10-24", "2026-10-26")).toBe(14 + 7 + 5);
  });

  // Our snapshot on the end day is taken partway through it, so that day's
  // stars can already be in our count.
  it("includes the end day the last measurement was taken on", () => {
    expect(starsGivenBetween(weeks, "2026-10-28", "2026-10-28")).toBe(33);
  });

  it("is 0 for a window the history does not reach", () => {
    expect(starsGivenBetween(weeks, "2026-01-01", "2026-01-31")).toBe(0);
  });
});
