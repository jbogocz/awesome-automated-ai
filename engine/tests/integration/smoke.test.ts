import { describe, expect, it } from "vitest";
import { classifyCandidate } from "../../src/agents/discovery.js";
import { generateReadme } from "../../src/generator/readme.js";
import { buildPrBody, buildYamlEntry } from "../../src/pr/create-pr.js";
import { computeScore } from "../../src/scoring/composite.js";

describe("integration: full pipeline logic", () => {
  it("score → classify → PR body → README roundtrip", () => {
    const score = computeScore({
      stars: 3000,
      starsLastMonth: 300,
      commitCount30d: 25,
      issueResponseHours: 8,
      contributorCount: 15,
      llmRelevanceScore: 85,
      hasReadme: true,
      hasLicense: true,
    });
    expect(score.total).toBeGreaterThan(50);

    const decision = classifyCandidate({
      relevant: true,
      relevanceScore: 85,
      qualityScore: score.total,
      scoreThresholdAuto: 70,
      scoreThresholdQueue: 50,
    });
    expect(decision).toBe("auto");

    const entry = buildYamlEntry({
      name: "SuperAutoML",
      repo: "org/super-automl",
      description: "Next-gen AutoML.",
      note: null,
    });
    expect(entry).toContain("name: SuperAutoML");

    const body = buildPrBody({
      repo: "org/super-automl",
      category: "General-Purpose AutoML",
      description: "Next-gen AutoML.",
      relevanceScore: 85,
      qualityScore: score.total,
      reasoning: "Strong.",
      source: "github",
    });
    expect(body).toContain("AI Curator Engine");

    const readme = generateReadme({
      yamlContent:
        "categories:\n- name: General-Purpose AutoML\n  description: Frameworks.\n  entries:\n  - name: SuperAutoML\n    repo: org/super-automl\n    description: Next-gen AutoML.\n",
      header: "# Awesome AutoML\n",
      footer: "## Contributing\n",
      apiData: { "org/super-automl": { stars: 3000, pushed: "2026-04-01T00:00:00Z", archived: false } },
    });
    expect(readme).toContain("SuperAutoML");
  });
});
