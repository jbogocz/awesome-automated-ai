import { describe, expect, it } from "vitest";
import { computeTrends } from "../../src/scoring/trends.js";

// Fixed reference date so window arithmetic is deterministic.
const TODAY = new Date("2026-08-14T00:00:00Z");
const at = (date: string, stars: number) => ({ date, stars });

describe("computeTrends", () => {
  it("computes all trends when history is available", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: at("2026-08-07", 950),
      stars30dAgo: at("2026-07-15", 800),
      starsPrevious: 700,
      today: TODAY,
    });
    expect(result.trend7d).toBe(50);
    expect(result.trend30d).toBe(200);
    expect(result.trend).toBe(200); // prefers 30d
  });

  it("falls back to previous stars when 30d is missing", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: at("2026-08-07", 950),
      stars30dAgo: null,
      starsPrevious: 700,
      today: TODAY,
    });
    expect(result.trend).toBe(300);
    expect(result.trend7d).toBe(50);
    expect(result.trend30d).toBeNull();
  });

  it("returns null trends when no history exists", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: null,
      stars30dAgo: null,
      starsPrevious: null,
      today: TODAY,
    });
    expect(result.trend).toBeNull();
    expect(result.trend7d).toBeNull();
    expect(result.trend30d).toBeNull();
  });

  it("handles negative growth", () => {
    const result = computeTrends({
      currentStars: 800,
      stars7dAgo: at("2026-08-07", 1000),
      stars30dAgo: at("2026-07-15", 1200),
      starsPrevious: 1500,
      today: TODAY,
    });
    expect(result.trend7d).toBe(-200);
    expect(result.trend30d).toBe(-400);
    expect(result.trend).toBe(-400);
  });

  // The weekly Monday cadence means the snapshot nearest t-30 is normally
  // t-28, so labelling every delta "last 30d" overstated the window by ~7%.
  it("reports the window the snapshots actually span, not the one requested", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: at("2026-08-10", 980), // 4 days back, not 7
      stars30dAgo: at("2026-07-17", 800), // 28 days back, not 30
      starsPrevious: 700,
      today: TODAY,
    });
    expect(result.trend30dDays).toBe(28);
    expect(result.trend7dDays).toBe(4);
  });

  it("reports no window for a delta that has none", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: null,
      stars30dAgo: null,
      starsPrevious: 700, // previous snapshot of unknown age
      today: TODAY,
    });
    expect(result.trend).toBe(300);
    expect(result.trend30dDays).toBeNull();
    expect(result.trend7dDays).toBeNull();
  });

  it("never reports a zero-day window", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: at("2026-08-14", 1000), // same day
      stars30dAgo: null,
      starsPrevious: null,
      today: TODAY,
    });
    expect(result.trend7dDays).toBe(1);
  });
});
