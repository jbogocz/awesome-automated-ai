import { describe, expect, it } from "vitest";
import { computeScore, type ScoreInput } from "../../src/scoring/composite.js";

describe("computeScore", () => {
  it("scores a healthy popular project high", () => {
    const input: ScoreInput = {
      stars: 5000,
      starsLastMonth: 500,
      commitCount30d: 45,
      issueResponseHours: 12,
      contributorCount: 30,
      llmRelevanceScore: 90,
      hasReadme: true,
      hasLicense: true,
    };
    const result = computeScore(input);
    expect(result.total).toBeGreaterThanOrEqual(75);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("scores an inactive project low", () => {
    const input: ScoreInput = {
      stars: 100,
      starsLastMonth: 0,
      commitCount30d: 0,
      issueResponseHours: 0,
      contributorCount: 1,
      llmRelevanceScore: 40,
      hasReadme: false,
      hasLicense: false,
    };
    const result = computeScore(input);
    expect(result.total).toBeLessThan(40);
  });

  it("clamps total between 0 and 100", () => {
    const extreme: ScoreInput = {
      stars: 999999,
      starsLastMonth: 99999,
      commitCount30d: 999,
      issueResponseHours: 1,
      contributorCount: 500,
      llmRelevanceScore: 100,
      hasReadme: true,
      hasLicense: true,
    };
    const result = computeScore(extreme);
    expect(result.total).toBeLessThanOrEqual(100);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("returns individual component scores", () => {
    const input: ScoreInput = {
      stars: 2000,
      starsLastMonth: 200,
      commitCount30d: 20,
      issueResponseHours: 24,
      contributorCount: 10,
      llmRelevanceScore: 80,
      hasReadme: true,
      hasLicense: true,
    };
    const result = computeScore(input);
    expect(result).toHaveProperty("starsVelocity");
    expect(result).toHaveProperty("commitFrequency");
    expect(result).toHaveProperty("issueResponse");
    expect(result).toHaveProperty("contributors");
    expect(result).toHaveProperty("documentation");
    expect(result).toHaveProperty("llmRelevance");
  });
});
