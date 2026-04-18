import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getModel, MAX_TOKENS_TAG_CURATION } from "./llm.js";

const CuratedTagsSchema = z.object({
  tags: z.array(z.string()).min(3).max(20),
  reasoning: z.string(),
});

export type CuratedTags = z.infer<typeof CuratedTagsSchema> & {
  tokensUsed: number;
};

export interface TagCuratorInput {
  apiKey: string;
  name: string;
  repo: string;
  category: string;
  description: string;
  tagline?: string;
  currentTags: string[];
  githubTopics: string[];
}

const TOOL_DEFINITION = {
  name: "submit_tags" as const,
  description: "Submit a curated tag list for this project.",
  input_schema: {
    type: "object" as const,
    required: ["tags", "reasoning"],
    properties: {
      tags: {
        type: "array" as const,
        items: { type: "string" as const },
        minItems: 3,
        maxItems: 20,
        description:
          "5-15 kebab-case tags. Prefer widely-recognised ML/AI terms; dedupe synonyms; drop repo-specific noise.",
      },
      reasoning: {
        type: "string" as const,
        description: "One short sentence on what changed vs the current tags and why.",
      },
    },
  },
};

const VOCABULARY_HINTS = [
  "automl",
  "neural-architecture-search",
  "hyperparameter-optimization",
  "feature-engineering",
  "deep-learning",
  "machine-learning",
  "reinforcement-learning",
  "llm",
  "fine-tuning",
  "prompt-optimization",
  "rag",
  "agents",
  "multi-agent",
  "tabular-data",
  "time-series",
  "computer-vision",
  "nlp",
  "transformers",
  "mlops",
  "model-serving",
  "model-compression",
  "quantization",
  "pruning",
  "pytorch",
  "tensorflow",
  "jax",
];

export async function curateTags(input: TagCuratorInput): Promise<CuratedTags> {
  const anthropic = new Anthropic({ apiKey: input.apiKey });

  const prompt = `You are curating tags for the awesome-automl list - a registry of AI/ML automation tools.

## Project
- Name: ${input.name}
- Repo: ${input.repo}
- Category: ${input.category}
- Description: ${input.description}
${input.tagline ? `- Tagline: ${input.tagline}` : ""}

## Input tags (may be messy)
- Current YAML tags: ${input.currentTags.length > 0 ? input.currentTags.join(", ") : "(none)"}
- GitHub repo topics: ${input.githubTopics.length > 0 ? input.githubTopics.join(", ") : "(none)"}

## Rules for the output tag set
- Emit 5-15 kebab-case tags.
- Focus on what users search for: categories (automl, nas, hpo), techniques (fine-tuning, rag, pruning), domains (computer-vision, tabular-data, time-series), stacks (pytorch, jax, transformers).
- DROP: single-word noise ("ml", "learning"), duplicate synonyms ("deep" vs "deep-learning"), repo-specific tags (grant numbers, disease names unless the tool is medical, internal codenames), the category name itself as a tag.
- Prefer terms from this canonical vocabulary when applicable: ${VOCABULARY_HINTS.join(", ")}.
- Do NOT invent tags unsupported by description / current tags / topics.

Call the submit_tags tool with the curated list.`;

  const response = await anthropic.messages.create({
    model: getModel(),
    max_tokens: MAX_TOKENS_TAG_CURATION,
    tools: [TOOL_DEFINITION],
    tool_choice: { type: "tool", name: "submit_tags" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find((c) => c.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool call");
  }

  const parsed = CuratedTagsSchema.parse(toolUse.input);
  const tokensUsed = (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

  return { ...parsed, tokensUsed };
}
