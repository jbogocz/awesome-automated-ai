import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  runDiscovery: vi.fn(async () => ({
    candidatesFound: 0,
    prsCreated: 0,
    queued: 0,
    discarded: 0,
    tokensUsed: 0,
  })),
}));

vi.mock("../src/agents/discovery.ts", () => ({ runDiscovery: mocks.runDiscovery }));

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
