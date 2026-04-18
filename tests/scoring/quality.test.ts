import { describe, expect, it } from "vitest";
import { computeQualityScore, type QualityInput } from "../../src/scoring/quality.js";

describe("computeQualityScore", () => {
  it("scores a healthy active project high", () => {
    const input: QualityInput = {
      stars: 10000,
      starsPrevious: 9700,
      pushedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("scores an unmaintained project low", () => {
    const input: QualityInput = {
      stars: 500,
      starsPrevious: 510,
      pushedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      license: null,
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeLessThan(45);
  });

  it("gives neutral trend when no previous data", () => {
    const input: QualityInput = {
      stars: 5000,
      starsPrevious: null,
      pushedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "Apache-2.0",
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it("penalizes archived projects", () => {
    const active: QualityInput = {
      stars: 5000,
      starsPrevious: 4900,
      pushedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
    };
    const archived: QualityInput = { ...active, archived: true };
    expect(computeQualityScore(active)).toBeGreaterThan(computeQualityScore(archived));
  });

  it("clamps score between 0 and 100", () => {
    const extreme: QualityInput = {
      stars: 999999,
      starsPrevious: 1,
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    expect(computeQualityScore(extreme)).toBeLessThanOrEqual(100);
    expect(computeQualityScore(extreme)).toBeGreaterThanOrEqual(0);
  });

  it("distinguishes mega-repos instead of saturating at 100K stars", () => {
    const base: QualityInput = {
      stars: 0,
      starsPrevious: null,
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    const hundredK = computeQualityScore({ ...base, stars: 100_000 });
    const hundredFortyK = computeQualityScore({ ...base, stars: 145_000 });
    const millionStar = computeQualityScore({ ...base, stars: 1_000_000 });
    expect(hundredFortyK).toBeGreaterThan(hundredK);
    expect(millionStar).toBeGreaterThan(hundredFortyK);
  });

  it("tiers license: permissive > copyleft > NOASSERTION > null/proprietary", () => {
    const base: QualityInput = {
      stars: 10000,
      starsPrevious: null,
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    const mit = computeQualityScore(base);
    const gpl = computeQualityScore({ ...base, license: "GPL-3.0" });
    const noassert = computeQualityScore({ ...base, license: "NOASSERTION" });
    const proprietary = computeQualityScore({ ...base, license: null });
    expect(mit).toBeGreaterThan(gpl);
    expect(gpl).toBeGreaterThan(noassert);
    expect(noassert).toBeGreaterThan(proprietary);
  });

  it("imputes momentum from other dimensions when no snapshot history", () => {
    const healthyNoHistory: QualityInput = {
      stars: 145000,
      starsPrevious: null,
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    const poorNoHistory: QualityInput = {
      stars: 145000,
      starsPrevious: null,
      pushedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      license: null,
      archived: false,
    };
    // A healthy-but-new repo should not be penalised for lacking snapshot history;
    // its momentum should mirror its other (good) signals, not default to 50.
    expect(computeQualityScore(healthyNoHistory)).toBeGreaterThan(computeQualityScore(poorNoHistory));
    expect(computeQualityScore(healthyNoHistory)).toBeGreaterThanOrEqual(85);
  });

  it("prefers trend30d over trend7d over legacy starsPrevious", () => {
    const base: QualityInput = {
      stars: 10000,
      starsPrevious: 9500, // legacy -> +500
      trend30d: 0, // 30d -> 0 (flat)
      trend7d: 500, // 7d -> +500 (hot)
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    // trend30d=0 wins, momentum should be neutral 50
    const score30d = computeQualityScore(base);
    // With trend30d omitted, falls back to trend7d (hot) -> higher score
    const score7d = computeQualityScore({ ...base, trend30d: null });
    expect(score7d).toBeGreaterThan(score30d);
  });
});
