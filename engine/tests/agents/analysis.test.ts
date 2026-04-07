import { describe, expect, it, vi } from "vitest";
import { analyzeCandidate } from "../../src/agents/analysis.js";

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: "tool_use",
              id: "call_1",
              name: "evaluate_project",
              input: {
                relevant: true,
                category: "Automated Fine-Tuning",
                description:
                  "Fast fine-tuning framework achieving 2x speedup over standard LoRA with custom CUDA kernels.",
                note: null,
                relevance_score: 82,
                reasoning: "Novel approach to fine-tuning with benchmarked speedups.",
                comparable_to: ["unslothai/unsloth"],
                is_novel: true,
              },
            },
          ],
          usage: { input_tokens: 1500, output_tokens: 300 },
        }),
      },
    };
  }),
}));

describe("analyzeCandidate", () => {
  it("returns structured analysis from Claude", async () => {
    const result = await analyzeCandidate({
      apiKey: "sk-ant-test",
      candidate: {
        repo: "org/fast-finetune",
        name: "fast-finetune",
        description: "Fast fine-tuning framework",
        stars: 1200,
        pushedAt: "2026-04-01T00:00:00Z",
        language: "Python",
        archived: false,
        license: "Apache-2.0",
        readme: "# Fast FineTune\nAchieves 2x speedup over standard LoRA.",
        source: "github",
      },
      existingCategories: ["General-Purpose AutoML", "Automated Fine-Tuning"],
    });

    expect(result.relevant).toBe(true);
    expect(result.category).toBe("Automated Fine-Tuning");
    expect(result.description).toContain("fine-tuning");
    expect(result.relevance_score).toBeGreaterThanOrEqual(0);
    expect(result.relevance_score).toBeLessThanOrEqual(100);
    expect(result.tokensUsed).toBe(1800);
  });
});
