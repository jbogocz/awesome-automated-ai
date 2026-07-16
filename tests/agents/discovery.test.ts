import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { describe, expect, it, vi } from "vitest";
import { classifyCandidate } from "../../src/agents/discovery.js";
import type { Config } from "../../src/config.js";

vi.mock("../../src/github/search.js", () => ({
  getDefaultTopics: () => ["automl"],
  fetchRepoSignals: vi.fn(async () => ({ commitCount30d: 60, contributorCount: 120 })),
  searchGitHub: vi.fn(async () => [
    {
      repo: "owner/one",
      name: "One",
      description: "d1",
      stars: 20_000,
      pushedAt: "2026-07-01T00:00:00Z",
      language: "Python",
      archived: false,
      license: "MIT",
      topics: ["automl"],
      readme: "# One",
      source: "github",
    },
    {
      repo: "owner/two",
      name: "Two",
      description: "d2",
      stars: 15_000,
      pushedAt: "2026-07-01T00:00:00Z",
      language: "Python",
      archived: false,
      license: "MIT",
      topics: ["automl"],
      readme: "# Two",
      source: "github",
    },
  ]),
}));

vi.mock("../../src/github/pr.js", () => ({
  createPr: vi.fn(async () => 123),
}));

vi.mock("../../src/agents/analysis.js", () => ({
  analyzeCandidate: vi.fn(async () => ({
    relevant: true,
    category: "General-Purpose AutoML",
    description: "desc",
    tagline: "tagline",
    tags: ["automl"],
    note: null,
    relevance_score: 95,
    reasoning: "strong fit",
    comparable_to: [],
    is_novel: true,
    tokensUsed: 10,
  })),
}));

function testConfig(maxPrsPerDay: number): Config {
  return {
    anthropicApiKey: "test-key",
    githubToken: "test-token",
    githubRepoOwner: "owner",
    githubRepoName: "repo",
    dbPath: "curator.db",
    maxCandidatesPerRun: 50,
    scoreThresholdAuto: 70,
    scoreThresholdQueue: 50,
    maxPrsPerDay,
    dryRun: false,
  };
}

describe("runDiscovery daily PR cap", () => {
  it("queues auto-worthy candidates over the cap instead of permanently rejecting them", async () => {
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    writeFileSync(projectsYamlPath, "categories: []\n");

    const { runDiscovery } = await import("../../src/agents/discovery.js");
    const result = await runDiscovery(testConfig(1), projectsYamlPath);

    expect(result.candidatesFound).toBe(2);
    expect(result.prsCreated).toBe(1);
    expect(result.queued).toBe(1);
    expect(result.discarded).toBe(0);

    const sqlite = new Database(join(dir, "curator.db"), { readonly: true });
    const rejected = sqlite.prepare("SELECT COUNT(*) AS n FROM projects WHERE status = 'rejected'").get() as {
      n: number;
    };
    expect(rejected.n).toBe(0);

    const two = sqlite.prepare("SELECT status FROM projects WHERE repo = 'owner/two'").get() as { status: string };
    expect(two.status).toBe("candidate");

    const queuedDecision = sqlite
      .prepare(
        "SELECT d.reasoning FROM decisions d JOIN projects p ON p.id = d.project_id WHERE p.repo = 'owner/two' AND d.decision = 'add' AND d.pr_number IS NULL",
      )
      .get() as { reasoning: string };
    expect(queuedDecision.reasoning).toMatch(/cap/i);

    // Cross-run cap accounting: the PR opened above must be visible to countPrsToday.
    const prsToday = sqlite
      .prepare("SELECT COUNT(*) AS n FROM decisions WHERE pr_number IS NOT NULL AND date(created_at) = date('now')")
      .get() as { n: number };
    expect(prsToday.n).toBe(1);
    sqlite.close();
  });
});

describe("classifyCandidate", () => {
  it("keeps the existing threshold semantics", () => {
    const base = { relevant: true, scoreThresholdAuto: 70, scoreThresholdQueue: 50 };
    expect(classifyCandidate({ ...base, relevanceScore: 90, qualityScore: 80 })).toBe("auto");
    expect(classifyCandidate({ ...base, relevanceScore: 60, qualityScore: 50 })).toBe("queue");
    expect(classifyCandidate({ ...base, relevanceScore: 30, qualityScore: 20 })).toBe("discard");
    expect(classifyCandidate({ ...base, relevant: false, relevanceScore: 99, qualityScore: 99 })).toBe("discard");
  });
});
