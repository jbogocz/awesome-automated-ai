import { describe, expect, it } from "vitest";
import { buildPrBody, buildYamlEntry } from "../../src/pr/create-pr.js";

describe("buildYamlEntry", () => {
  it("formats a YAML entry", () => {
    const entry = buildYamlEntry({
      name: "FastTune",
      repo: "org/fasttune",
      description: "Fast fine-tuning framework with 2x speedup.",
      note: null,
    });
    expect(entry).toContain("name: FastTune");
    expect(entry).toContain("repo: org/fasttune");
    expect(entry).toContain("description: Fast fine-tuning framework");
    expect(entry).not.toContain("note:");
  });

  it("includes note when present", () => {
    const entry = buildYamlEntry({
      name: "OldTool",
      repo: "org/oldtool",
      description: "Legacy tool.",
      note: "Low activity since 2024.",
    });
    expect(entry).toContain("note: Low activity since 2024.");
  });
});

describe("buildPrBody", () => {
  it("builds a descriptive PR body", () => {
    const body = buildPrBody({
      repo: "org/fasttune",
      category: "Automated Fine-Tuning",
      description: "Fast fine-tuning framework with 2x speedup.",
      relevanceScore: 85,
      qualityScore: 72,
      reasoning: "Novel approach with benchmarked results.",
      source: "github",
    });
    expect(body).toContain("org/fasttune");
    expect(body).toContain("Automated Fine-Tuning");
    expect(body).toContain("85");
    expect(body).toContain("AI Curator Engine");
  });
});
