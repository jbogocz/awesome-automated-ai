import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../src/config.ts";

describe("loadConfig", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubEnv("GITHUB_REPO_OWNER", "owner");
    vi.stubEnv("GITHUB_REPO_NAME", "repo");
    for (const name of [
      "DECISIONS_PATH",
      "MAX_CANDIDATES_PER_RUN",
      "SCORE_THRESHOLD_AUTO",
      "SCORE_THRESHOLD_QUEUE",
      "MAX_PRS_PER_DAY",
      "DRY_RUN",
    ]) {
      vi.stubEnv(name, undefined);
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("applies the documented defaults", () => {
    expect(loadConfig()).toMatchObject({
      decisionsPath: "data/decisions.jsonl",
      maxCandidatesPerRun: 50,
      scoreThresholdAuto: 70,
      scoreThresholdQueue: 50,
      maxPrsPerDay: 3,
      dryRun: false,
    });
  });

  it("reads every tuning variable", () => {
    vi.stubEnv("DECISIONS_PATH", "data/other.jsonl");
    vi.stubEnv("MAX_CANDIDATES_PER_RUN", "10");
    vi.stubEnv("SCORE_THRESHOLD_AUTO", "80");
    vi.stubEnv("SCORE_THRESHOLD_QUEUE", "60");
    vi.stubEnv("MAX_PRS_PER_DAY", "1");
    vi.stubEnv("DRY_RUN", "true");
    expect(loadConfig()).toMatchObject({
      decisionsPath: "data/other.jsonl",
      maxCandidatesPerRun: 10,
      scoreThresholdAuto: 80,
      scoreThresholdQueue: 60,
      maxPrsPerDay: 1,
      dryRun: true,
    });
  });

  it("treats an empty variable as unset", () => {
    vi.stubEnv("MAX_PRS_PER_DAY", "");
    vi.stubEnv("DRY_RUN", "");
    expect(loadConfig()).toMatchObject({ maxPrsPerDay: 3, dryRun: false });
  });

  // DRY_RUN=TRUE used to read as false and open real pull requests.
  it("rejects a DRY_RUN value that is not true or false", () => {
    for (const value of ["TRUE", "1", "yes"]) {
      vi.stubEnv("DRY_RUN", value);
      expect(() => loadConfig()).toThrow(/DRY_RUN/);
    }
  });

  // "7o" used to parse as 7 and "three" as the default, both silently.
  it("rejects a numeric variable that is not an integer", () => {
    for (const value of ["7o", "three", "2.5"]) {
      vi.stubEnv("SCORE_THRESHOLD_AUTO", value);
      expect(() => loadConfig()).toThrow(/SCORE_THRESHOLD_AUTO/);
    }
  });
});
