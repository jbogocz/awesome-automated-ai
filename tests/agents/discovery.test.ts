import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { analyzeCandidate } from "../../src/agents/analysis.ts";
import { classifyCandidate } from "../../src/agents/discovery.ts";
import type { Config } from "../../src/config.ts";
import { loadDecisions } from "../../src/store/decisions.ts";
import { todayUtc } from "../../src/store/snapshots.ts";

vi.mock("../../src/github/search.ts", () => ({
  getDefaultTopics: () => ["automl"],
  fetchRepoSignals: vi.fn(async () => ({ commitCount30d: 60, contributorCount: 120 })),
  searchGitHub: vi.fn(async ({ isKnown }: { isKnown: (repo: string) => boolean }) =>
    [
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
    ].filter((candidate) => !isKnown(candidate.repo)),
  ),
}));

vi.mock("../../src/github/pr.ts", () => ({
  createPr: vi.fn(async () => 123),
}));

vi.mock("../../src/agents/analysis.ts", () => ({
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

// The category the analysis mock picks has to exist: a PR can only file an
// entry under a heading projects.yaml already has.
const PROJECTS_YAML = `categories:
- name: General-Purpose AutoML
  entries:
  - name: Existing
    repo: owner/existing
`;

function testConfig(maxPrsPerDay: number, dryRun = false): Config {
  return {
    anthropicApiKey: "test-key",
    githubRepoOwner: "owner",
    githubRepoName: "repo",
    decisionsPath: "decisions.jsonl",
    maxCandidatesPerRun: 50,
    scoreThresholdAuto: 70,
    scoreThresholdQueue: 50,
    maxPrsPerDay,
    dryRun,
  };
}

describe("runDiscovery daily PR cap", () => {
  it("queues auto-worthy candidates over the cap instead of permanently rejecting them", async () => {
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    writeFileSync(projectsYamlPath, PROJECTS_YAML);

    const { runDiscovery } = await import("../../src/agents/discovery.ts");
    const result = await runDiscovery(testConfig(1), projectsYamlPath);

    expect(result.candidatesFound).toBe(2);
    expect(result.prsCreated).toBe(1);
    expect(result.queued).toBe(1);
    expect(result.discarded).toBe(0);

    const decisions = loadDecisions(join(dir, "decisions.jsonl"));
    expect(decisions.filter((d) => d.decision === "reject")).toHaveLength(0);

    const queuedDecision = decisions.find((d) => d.repo === "owner/two" && d.prNumber === undefined);
    expect(queuedDecision?.decision).toBe("add");
    expect(queuedDecision?.reasoning).toMatch(/cap/i);

    // Cross-run cap accounting: the PR opened above is what the next run counts.
    expect(decisions.filter((d) => d.prNumber !== undefined && d.date === todayUtc())).toHaveLength(1);
  });
});

describe("runDiscovery dry run", () => {
  // Any earlier verdict is final for discovery, so a dry run that wrote
  // "queue" and "reject" rows would bury those candidates from the real run.
  it("opens no PR and records no decision, whatever the verdict", async () => {
    const { createPr } = await import("../../src/github/pr.ts");
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    writeFileSync(projectsYamlPath, PROJECTS_YAML);
    vi.mocked(createPr).mockClear();
    const real = vi.mocked(analyzeCandidate).getMockImplementation();
    let n = 0;
    vi.mocked(analyzeCandidate).mockImplementation(async (...args) => {
      const analysis = await (real as typeof analyzeCandidate)(...args);
      // First candidate: auto. Second: not relevant, so rejected.
      return n++ === 0 ? analysis : { ...analysis, relevant: false };
    });

    try {
      const { runDiscovery } = await import("../../src/agents/discovery.ts");
      const result = await runDiscovery(testConfig(10, true), projectsYamlPath);
      expect(result.prsCreated).toBe(1);
      expect(result.discarded).toBe(1);
      expect(createPr).not.toHaveBeenCalled();
      expect(loadDecisions(join(dir, "decisions.jsonl"))).toEqual([]);
    } finally {
      if (real) vi.mocked(analyzeCandidate).mockImplementation(real);
    }
  });
});

describe("runDiscovery known repositories", () => {
  // GitHub slugs ignore case and the search returns the canonical spelling,
  // while projects.yaml and decisions.jsonl keep whatever was typed
  // (e2b-dev/E2B is listed, e2b-dev/e2b is what the search reports).
  it("skips a candidate the list or the decisions log already holds under another case", async () => {
    const { createPr } = await import("../../src/github/pr.ts");
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    // A commercial entry has a url and no repo; it must not trip the lookup.
    writeFileSync(
      projectsYamlPath,
      `${PROJECTS_YAML.replace("owner/existing", "Owner/One")}  - name: Vendor\n    url: https://example.com\n`,
    );
    writeFileSync(
      join(dir, "decisions.jsonl"),
      `${JSON.stringify({ date: "2026-07-16", repo: "OWNER/Two", decision: "reject", reasoning: "off topic" })}\n`,
    );
    vi.mocked(createPr).mockClear();

    const { runDiscovery } = await import("../../src/agents/discovery.ts");
    const result = await runDiscovery(testConfig(10), projectsYamlPath);

    expect(result.candidatesFound).toBe(0);
    expect(createPr).not.toHaveBeenCalled();
  });
});

describe("runDiscovery failures", () => {
  // A refusal or a truncated reply on one README used to end the run, and since
  // no verdict is recorded the next run stopped at the same repository.
  it("carries on past a candidate that fails, leaves it unjudged and still ends in an error", async () => {
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    writeFileSync(projectsYamlPath, PROJECTS_YAML);
    vi.mocked(analyzeCandidate).mockRejectedValueOnce(new Error("Claude refused owner/one"));

    const { runDiscovery } = await import("../../src/agents/discovery.ts");
    await expect(runDiscovery(testConfig(10), projectsYamlPath)).rejects.toThrow(/1 of 2 .*owner\/one/);

    const decisions = loadDecisions(join(dir, "decisions.jsonl"));
    expect(decisions.map((d) => d.repo)).toEqual(["owner/two"]);
  });
});

describe("runDiscovery category validation", () => {
  it("queues instead of opening a PR when the model's category matches nothing", async () => {
    const dir = mkdtempSync(join(tmpdir(), "discovery-test-"));
    const projectsYamlPath = join(dir, "projects.yaml");
    writeFileSync(projectsYamlPath, PROJECTS_YAML);
    const real = vi.mocked(analyzeCandidate).getMockImplementation();
    vi.mocked(analyzeCandidate).mockImplementation(async (...args) => {
      const analysis = await (real as typeof analyzeCandidate)(...args);
      return { ...analysis, category: "AutoML Frameworks" };
    });

    try {
      const { runDiscovery } = await import("../../src/agents/discovery.ts");
      const result = await runDiscovery(testConfig(10), projectsYamlPath);
      expect(result.prsCreated).toBe(0);
      expect(result.queued).toBe(2);

      const reasons = loadDecisions(join(dir, "decisions.jsonl")).filter((d) => d.prNumber === undefined);
      expect(reasons).toHaveLength(2);
      for (const r of reasons) expect(r.reasoning).toMatch(/category "AutoML Frameworks" matches no category/);
    } finally {
      if (real) vi.mocked(analyzeCandidate).mockImplementation(real);
    }
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
