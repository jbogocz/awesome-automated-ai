import { describe, expect, it } from "vitest";
import { MIN_FRESH_RATIO } from "../../src/constants.js";
import { type FetchResult, freshRatio } from "../../src/generator/fetch-api.js";

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
