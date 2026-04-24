import { describe, expect, it } from "vitest";
import { computeTrends } from "../../src/scoring/trends.js";

describe("computeTrends", () => {
  it("computes all trends when history is available", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: 950,
      stars30dAgo: 800,
      starsPrevious: 700,
    });
    expect(result.trend7d).toBe(50);
    expect(result.trend30d).toBe(200);
    expect(result.trend).toBe(200); // prefers 30d
  });

  it("falls back to previous stars when 30d is missing", () => {
    const result = computeTrends({
      currentStars: 1000,
      stars7dAgo: 950,
      stars30dAgo: null,
      starsPrevious: 700,
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
    });
    expect(result.trend).toBeNull();
    expect(result.trend7d).toBeNull();
    expect(result.trend30d).toBeNull();
  });

  it("handles negative growth", () => {
    const result = computeTrends({
      currentStars: 800,
      stars7dAgo: 1000,
      stars30dAgo: 1200,
      starsPrevious: 1500,
    });
    expect(result.trend7d).toBe(-200);
    expect(result.trend30d).toBe(-400);
    expect(result.trend).toBe(-400);
  });
});
