import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { type ReclassifyResult, reclassifyEntries } from "../../src/agents/reclassify.ts";
import { runReclassifyCommand } from "../../src/commands/reclassify.ts";

vi.mock("../../src/agents/reclassify.ts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/agents/reclassify.ts")>()),
  reclassifyEntries: vi.fn(),
}));

const dir = mkdtempSync(join(tmpdir(), "reclassify-test-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

function run(result: ReclassifyResult): { reportPath: string; run: Promise<void> } {
  vi.mocked(reclassifyEntries).mockResolvedValue(result);
  const projectsYamlPath = join(dir, "projects.yaml");
  writeFileSync(projectsYamlPath, "categories: []\n");
  const reportPath = join(dir, "report.md");
  writeFileSync(reportPath, "the last run's paid-for verdicts\n");
  return { reportPath, run: runReclassifyCommand({ projectsYamlPath, reportPath, apiKey: "test-key" }) };
}

const failure = { name: "Tool", error: "401 invalid x-api-key" };

describe("runReclassifyCommand", () => {
  // With an expired key every entry fails. The run exited 0 and replaced the
  // last report, which is untracked and cost a full pass to produce, with an
  // empty one reading "Total entries reviewed: 0".
  it("fails and keeps the existing report when no entry could be classified", async () => {
    const { reportPath, run: done } = run({ records: [], tokensUsed: 0, failures: [failure] });
    await expect(done).rejects.toThrow(/401 invalid x-api-key/);
    expect(readFileSync(reportPath, "utf-8")).toBe("the last run's paid-for verdicts\n");
  });

  it("names the entries a partial run could not classify", async () => {
    const decision = { verdict: "fits" as const, target: null, reason: "r" };
    const record = { name: "Ok", repo: "o/ok", description: "d", currentCategory: "C", decision };
    const { reportPath, run: done } = run({ records: [record], tokensUsed: 1, failures: [failure] });
    await done;
    const report = readFileSync(reportPath, "utf-8");
    expect(report).toContain("Total entries reviewed: 1");
    expect(report).toContain("- **Tool**: 401 invalid x-api-key");
  });
});
