import type Anthropic from "@anthropic-ai/sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeCandidate } from "../../src/agents/analysis.ts";
import { DEFAULT_MODEL, getModel, toolInput } from "../../src/agents/llm.ts";
import { reclassifyEntries } from "../../src/agents/reclassify.ts";
import { curateTags } from "../../src/agents/tag-curator.ts";
import { loadManifest } from "../../src/categories.ts";

const create = vi.hoisted(() => vi.fn());

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create };
  },
}));

function message(overrides: Partial<Anthropic.Message>): Anthropic.Message {
  return {
    id: "msg_1",
    type: "message",
    role: "assistant",
    model: "claude-sonnet-5-5",
    content: [],
    stop_reason: "end_turn",
    stop_sequence: null,
    stop_details: null,
    usage: { input_tokens: 10, output_tokens: 5 },
    ...overrides,
  } as Anthropic.Message;
}

function toolUse(name: string, input: unknown): Anthropic.ToolUseBlock {
  return { type: "tool_use", id: "toolu_1", name, input } as Anthropic.ToolUseBlock;
}

describe("getModel", () => {
  it("defaults to a current model id", () => {
    delete process.env.ANTHROPIC_MODEL;
    expect(DEFAULT_MODEL).toBe("claude-sonnet-5-5");
    expect(getModel()).toBe("claude-sonnet-5-5");
  });
});

describe("toolInput", () => {
  it("returns the input of the named tool call", () => {
    const res = message({ stop_reason: "tool_use", content: [toolUse("submit_tags", { tags: ["a"] })] });
    expect(toolInput(res, "submit_tags", "owner/repo")).toEqual({ tags: ["a"] });
  });

  it("reports a refusal with its category instead of a missing tool call", () => {
    const res = message({
      stop_reason: "refusal",
      stop_details: { type: "refusal", category: "frontier_llm", explanation: null },
    });
    expect(() => toolInput(res, "submit_tags", "owner/repo")).toThrow(/refused owner\/repo.*frontier_llm/);
  });

  it("reports a reply cut off by max_tokens even when a partial tool call is present", () => {
    const res = message({ stop_reason: "max_tokens", content: [toolUse("submit_tags", { tags: ["a", "b", "c"] })] });
    expect(() => toolInput(res, "submit_tags", "owner/repo")).toThrow(/max_tokens/);
  });

  it("reports a reply that answered in text without calling the tool", () => {
    const res = message({ content: [{ type: "text", text: "Sure!", citations: null } as Anthropic.TextBlock] });
    expect(() => toolInput(res, "submit_tags", "owner/repo")).toThrow(/did not call submit_tags/);
  });
});

// Claude Sonnet 5.5 and Claude Opus 5.5 answer a forced tool_choice
// ("tool" or "any") with HTTP 400, so every request must leave the choice to
// the model and rely on the prompt, which already names the tool.
describe("request shape", () => {
  beforeEach(() => {
    create.mockReset();
  });

  const candidate = {
    repo: "owner/repo",
    name: "Repo",
    description: "d",
    stars: 100,
    pushedAt: "2026-11-01T00:00:00Z",
    language: "Python",
    archived: false,
    license: "MIT",
    topics: [],
    readme: "# Repo",
    source: "github" as const,
  };

  it("analyzeCandidate does not force a tool", async () => {
    create.mockResolvedValue(
      message({
        stop_reason: "tool_use",
        content: [
          toolUse("evaluate_project", {
            relevant: true,
            category: "c",
            description: "d",
            tagline: "t",
            tags: ["x"],
            note: null,
            relevance_score: 80,
            reasoning: "r",
            comparable_to: [],
            is_novel: true,
          }),
        ],
      }),
    );
    await analyzeCandidate({ apiKey: "k", candidate, categories: loadManifest().categories });
    const params = create.mock.calls[0]?.[0];
    expect(params.model).toBe("claude-sonnet-5-5");
    expect(params.tool_choice?.type).not.toMatch(/^(tool|any)$/);
  });

  it("curateTags does not force a tool", async () => {
    create.mockResolvedValue(
      message({
        stop_reason: "tool_use",
        content: [toolUse("submit_tags", { tags: ["a", "b", "c"], reasoning: "r" })],
      }),
    );
    await curateTags({
      apiKey: "k",
      name: "Repo",
      repo: "owner/repo",
      category: "c",
      description: "d",
      currentTags: [],
      githubTopics: [],
    });
    expect(create.mock.calls[0]?.[0].tool_choice?.type).not.toMatch(/^(tool|any)$/);
  });

  it("reclassifyEntries does not force a tool", async () => {
    create.mockResolvedValue(
      message({
        stop_reason: "tool_use",
        content: [toolUse("submit_verdict", { verdict: "fits", target: null, reason: "r" })],
      }),
    );
    const manifest = loadManifest();
    const yaml = `categories:\n- name: ${manifest.categories[0]?.name}\n  entries:\n  - name: A\n    repo: o/a\n    description: d\n`;
    const result = await reclassifyEntries({ apiKey: "k", yamlContent: yaml, manifest });
    expect(result.records).toHaveLength(1);
    expect(create.mock.calls[0]?.[0].tool_choice?.type).not.toMatch(/^(tool|any)$/);
  });
});

describe("truncated and refused replies", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("curateTags names the cause when the reply was cut off at max_tokens", async () => {
    create.mockResolvedValue(
      message({
        stop_reason: "max_tokens",
        content: [toolUse("submit_tags", { tags: ["a", "b", "c"], reasoning: "cut o" })],
      }),
    );
    // The truncated input still satisfies the schema, so without the check it
    // would be accepted as a finished answer.
    await expect(
      curateTags({
        apiKey: "k",
        name: "Repo",
        repo: "owner/repo",
        category: "c",
        description: "d",
        currentTags: [],
        githubTopics: [],
      }),
    ).rejects.toThrow(/max_tokens/);
  });
});
