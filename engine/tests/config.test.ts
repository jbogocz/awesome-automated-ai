import { afterEach, describe, expect, it } from "vitest";

describe("config", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("loads valid config from env vars", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    process.env.GITHUB_TOKEN = "ghp_test";
    process.env.GITHUB_REPO_OWNER = "jbogocz";
    process.env.GITHUB_REPO_NAME = "awesome-automl";

    const { loadConfig } = await import("../src/config.js");
    const config = loadConfig();

    expect(config.anthropicApiKey).toBe("sk-ant-test");
    expect(config.dbPath).toBe("data/curator.db");
    expect(config.githubRepoOwner).toBe("jbogocz");
    expect(config.maxCandidatesPerRun).toBe(50);
    expect(config.scoreThresholdAuto).toBe(70);
    expect(config.scoreThresholdQueue).toBe(50);
    expect(config.maxPrsPerDay).toBe(3);
    expect(config.dryRun).toBe(false);
  });

  it("enables dry run mode via DRY_RUN env", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    process.env.GITHUB_TOKEN = "ghp_test";
    process.env.GITHUB_REPO_OWNER = "jbogocz";
    process.env.GITHUB_REPO_NAME = "awesome-automl";
    process.env.DRY_RUN = "true";

    const { loadConfig } = await import("../src/config.js");
    const config = loadConfig();

    expect(config.dryRun).toBe(true);
  });

  it("throws on missing required env vars", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPO_OWNER;
    delete process.env.GITHUB_REPO_NAME;

    const { loadConfig } = await import("../src/config.js");
    expect(() => loadConfig()).toThrow();
  });
});
