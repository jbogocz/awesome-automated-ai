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
});
