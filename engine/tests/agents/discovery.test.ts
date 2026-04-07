import { describe, expect, it } from "vitest";
import { classifyCandidate } from "../../src/agents/discovery.js";

describe("classifyCandidate", () => {
  it("returns 'auto' for high score + relevant", () => {
    expect(
      classifyCandidate({
        relevant: true,
        relevanceScore: 82,
        qualityScore: 75,
        scoreThresholdAuto: 70,
        scoreThresholdQueue: 50,
      }),
    ).toBe("auto");
  });

  it("returns 'queue' for medium score + relevant", () => {
    expect(
      classifyCandidate({
        relevant: true,
        relevanceScore: 60,
        qualityScore: 55,
        scoreThresholdAuto: 70,
        scoreThresholdQueue: 50,
      }),
    ).toBe("queue");
  });

  it("returns 'discard' for low score", () => {
    expect(
      classifyCandidate({
        relevant: true,
        relevanceScore: 30,
        qualityScore: 25,
        scoreThresholdAuto: 70,
        scoreThresholdQueue: 50,
      }),
    ).toBe("discard");
  });

  it("returns 'discard' when not relevant regardless of score", () => {
    expect(
      classifyCandidate({
        relevant: false,
        relevanceScore: 90,
        qualityScore: 85,
        scoreThresholdAuto: 70,
        scoreThresholdQueue: 50,
      }),
    ).toBe("discard");
  });
});
