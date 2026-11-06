import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { runGenerateCommand } from "../../src/commands/generate.ts";
import { fetchRepoData } from "../../src/generator/fetch-api.ts";

vi.mock("../../src/generator/fetch-api.ts", async (original) => ({
  ...(await original<typeof import("../../src/generator/fetch-api.ts")>()),
  fetchRepoData: vi.fn(),
}));

const ROOT = resolve(import.meta.dirname, "../..");
const dir = mkdtempSync(join(tmpdir(), "generate-test-"));

afterAll(() => rmSync(dir, { recursive: true, force: true }));
afterEach(() => vi.restoreAllMocks());

function run(readmePath: string) {
  return runGenerateCommand({
    projectsYamlPath: join(ROOT, "projects.yaml"),
    headerPath: join(ROOT, "templates/header.md"),
    footerPath: join(ROOT, "templates/footer.md"),
    readmePath,
    noFetch: false,
  });
}

// The gate is what stops an unattended run from publishing an outage's cached
// data as current, so the threshold is spelled out rather than read back from
// the constant it guards.
describe("runGenerateCommand fresh-data gate", () => {
  it("refuses to write the README when under 90% of repos returned live data", async () => {
    vi.mocked(fetchRepoData).mockResolvedValue({
      data: {},
      stale: new Array(11).fill("a/b"),
      failed: [],
      attempted: 100,
    });
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`exit ${code}`);
    });

    const readmePath = join(dir, "refused.md");
    await expect(run(readmePath)).rejects.toThrow("exit 1");
    expect(existsSync(readmePath)).toBe(false);
  });

  it("counts repos with no fallback against the threshold too", async () => {
    vi.mocked(fetchRepoData).mockResolvedValue({
      data: {},
      stale: [],
      failed: new Array(11).fill("a/b"),
      attempted: 100,
    });
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`exit ${code}`);
    });

    await expect(run(join(dir, "refused-failed.md"))).rejects.toThrow("exit 1");
  });

  it("writes the README at exactly 90%", async () => {
    vi.mocked(fetchRepoData).mockResolvedValue({
      data: {},
      stale: new Array(10).fill("a/b"),
      failed: [],
      attempted: 100,
    });

    const readmePath = join(dir, "written.md");
    await run(readmePath);
    expect(existsSync(readmePath)).toBe(true);
  });
});
