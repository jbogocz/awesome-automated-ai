import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { GitHubCandidate } from "../sources/github.js";

const AnalysisSchema = z.object({
  relevant: z.boolean(),
  category: z.string(),
  description: z.string(),
  note: z.string().nullable(),
  relevance_score: z.number().int().min(0).max(100),
  reasoning: z.string(),
  comparable_to: z.array(z.string()),
  is_novel: z.boolean(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema> & {
  tokensUsed: number;
};

interface AnalyzeOptions {
  apiKey: string;
  candidate: GitHubCandidate;
  existingCategories: string[];
}

const TOOL_DEFINITION = {
  name: "evaluate_project" as const,
  description: "Submit the evaluation of this AutoML/AI project.",
  input_schema: {
    type: "object" as const,
    required: [
      "relevant",
      "category",
      "description",
      "note",
      "relevance_score",
      "reasoning",
      "comparable_to",
      "is_novel",
    ],
    properties: {
      relevant: { type: "boolean" as const, description: "Whether this project belongs in the awesome-automl list." },
      category: { type: "string" as const, description: "Which category this project belongs to." },
      description: {
        type: "string" as const,
        description: "1-2 sentence opinionated description with concrete facts.",
      },
      note: { type: ["string", "null"] as const, description: "Status note or null." },
      relevance_score: {
        type: "integer" as const,
        minimum: 0,
        maximum: 100,
        description: "Relevance to AutoML/AI automation (0-100).",
      },
      reasoning: { type: "string" as const, description: "2-3 sentences explaining the decision." },
      comparable_to: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Similar repos already on the list (owner/repo format).",
      },
      is_novel: { type: "boolean" as const, description: "Whether this fills a gap not covered by existing entries." },
    },
  },
};

export async function analyzeCandidate(opts: AnalyzeOptions): Promise<AnalysisResult> {
  const anthropic = new Anthropic({ apiKey: opts.apiKey });
  const { candidate, existingCategories } = opts;

  const prompt = `You are a senior ML engineer curating the definitive AutoML/AI automation list on GitHub.

Evaluate whether this project belongs in the awesome-automl list.

## Project
- **Repo:** ${candidate.repo}
- **Name:** ${candidate.name}
- **Description:** ${candidate.description}
- **Stars:** ${candidate.stars.toLocaleString()}
- **Last push:** ${candidate.pushedAt}
- **Language:** ${candidate.language ?? "unknown"}
- **Archived:** ${candidate.archived}
- **License:** ${candidate.license ?? "none"}

## README (first 5000 chars)
${candidate.readme || "(no README found)"}

## Existing categories
${existingCategories.map((c) => `- ${c}`).join("\n")}

## Instructions
- The list covers: AutoML, NAS, HPO, feature engineering, fine-tuning, prompt optimization, AI research agents, ML engineering agents, LLM eval, model compression, deployment, monitoring, safety, MLOps.
- Write descriptions with personality and concrete numbers. Max 2 sentences.
- Choose the best-fitting existing category. If none fit, suggest a new name.
- Be honest about relevance. Not everything belongs.

Call the evaluate_project tool with your assessment.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [TOOL_DEFINITION],
    tool_choice: { type: "tool", name: "evaluate_project" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find((c) => c.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool call");
  }

  const parsed = AnalysisSchema.parse(toolUse.input);
  const tokensUsed = (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

  return { ...parsed, tokensUsed };
}
