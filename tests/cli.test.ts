import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  runDiscovery: vi.fn(async () => ({
    candidatesFound: 0,
    prsCreated: 0,
    queued: 0,
    discarded: 0,
    tokensUsed: 0,
  })),
  runRefreshTagsCommand: vi.fn(async () => {}),
}));

vi.mock("../src/agents/discovery.ts", () => ({ runDiscovery: mocks.runDiscovery }));
vi.mock("../src/commands/refresh-tags.ts", () => ({ runRefreshTagsCommand: mocks.runRefreshTagsCommand }));

/** Runs src/cli.ts as `node src/cli.ts <args>`; it executes on import. */
async function cli(...args: string[]): Promise<void> {
  vi.resetModules();
  process.argv = ["node", "src/cli.ts", ...args];
  await import("../src/cli.ts");
}

const originalArgv = process.argv;

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  vi.stubEnv("GITHUB_REPO_OWNER", "o");
  vi.stubEnv("GITHUB_REPO_NAME", "r");
  vi.stubEnv("DRY_RUN", undefined);
  vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
    throw new Error(`exit ${code}`);
  }) as never);
});

afterEach(() => {
  process.argv = originalArgv;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function discoveryDryRun(): unknown {
  const call = mocks.runDiscovery.mock.calls[0] as unknown as [{ dryRun: boolean }];
  return call[0].dryRun;
}

describe("discover", () => {
  // Without the flag reaching the config, this run opens real pull requests.
  it("honours --dry-run", async () => {
    await cli("discover", "--dry-run");
    expect(discoveryDryRun()).toBe(true);
  });

  it("is a real run with neither the flag nor DRY_RUN", async () => {
    await cli("discover");
    expect(discoveryDryRun()).toBe(false);
  });

  it("still honours DRY_RUN=true without the flag", async () => {
    vi.stubEnv("DRY_RUN", "true");
    await cli("discover");
    expect(discoveryDryRun()).toBe(true);
  });
});

describe("--limit", () => {
  it("passes a positive integer through", async () => {
    await cli("refresh-tags", "--limit=5");
    expect(mocks.runRefreshTagsCommand).toHaveBeenCalledWith(expect.objectContaining({ limit: 5 }));
  });

  it("leaves the limit unset when the flag is absent", async () => {
    await cli("refresh-tags");
    expect(mocks.runRefreshTagsCommand).toHaveBeenCalledWith(expect.objectContaining({ limit: undefined }));
  });

  // "abc" parsed to NaN and processed nothing, "-1" sliced off only the last
  // entry and "5x" parsed to 5, all with exit code 0.
  it.each(["abc", "-1", "0", "5x", "1.5", ""])("rejects --limit=%s", async (value) => {
    await expect(cli("refresh-tags", `--limit=${value}`)).rejects.toThrow("exit 1");
    expect(mocks.runRefreshTagsCommand).not.toHaveBeenCalled();
  });
});
