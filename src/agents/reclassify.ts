import Anthropic from "@anthropic-ai/sdk";
import { isMap, isScalar, isSeq, parseDocument } from "yaml";
import { type Manifest, renderCategoryCatalog } from "../categories.js";
import { getModel } from "./llm.js";

const MAX_TOKENS = 512;

export type Verdict = "fits" | "move_to" | "uncertain";

export interface ReclassifyCandidate {
  name: string;
  repo: string;
  description: string;
  tagline?: string;
  currentCategory: string;
}

export interface ReclassifyDecision {
  verdict: Verdict;
  target: string | null;
  reason: string;
}

export interface ReclassifyProgress {
  index: number;
  total: number;
  candidate: ReclassifyCandidate;
  decision: ReclassifyDecision;
}

export interface ReclassifyOptions {
  apiKey: string;
  yamlContent: string;
  manifest: Manifest;
  limit?: number;
  onProgress?: (evt: ReclassifyProgress) => void;
}

export interface ReclassifyRecord extends ReclassifyCandidate {
  decision: ReclassifyDecision;
}

export interface ReclassifyResult {
  records: ReclassifyRecord[];
  tokensUsed: number;
}

const TOOL_DEFINITION = {
  name: "submit_verdict" as const,
  description: "Submit whether this entry still belongs in its current category.",
  input_schema: {
    type: "object" as const,
    required: ["verdict", "target", "reason"],
    properties: {
      verdict: {
        type: "string" as const,
        enum: ["fits", "move_to", "uncertain"],
        description:
          "fits = current category is correct. move_to = should move to target category. uncertain = human review.",
      },
      target: {
        type: ["string", "null"] as const,
        description: "Target category name when verdict=move_to, otherwise null.",
      },
      reason: {
        type: "string" as const,
        description: "One sentence citing the decisive scope_in / scope_out rule.",
      },
    },
  },
};

export async function reclassifyEntries(opts: ReclassifyOptions): Promise<ReclassifyResult> {
  const candidates = extractCandidates(opts.yamlContent);
  const allowedNames = new Set(opts.manifest.categories.map((c) => c.name));
  const processed = opts.limit !== undefined ? candidates.slice(0, opts.limit) : candidates;

  const anthropic = new Anthropic({ apiKey: opts.apiKey });
  const catalog = renderCategoryCatalog(opts.manifest.categories);

  const records: ReclassifyRecord[] = [];
  let tokensUsed = 0;

  for (let i = 0; i < processed.length; i++) {
    const c = processed[i];
    const decision = await classifyOne(anthropic, c, catalog, allowedNames);
    tokensUsed += decision.tokensUsed;
    records.push({ ...c, decision: decision.result });
    opts.onProgress?.({ index: i + 1, total: processed.length, candidate: c, decision: decision.result });
  }

  return { records, tokensUsed };
}

async function classifyOne(
  anthropic: Anthropic,
  candidate: ReclassifyCandidate,
  catalog: string,
  allowedNames: Set<string>,
): Promise<{ result: ReclassifyDecision; tokensUsed: number }> {
  const prompt = `You are auditing the awesome-automated-ai list. One entry at a time, decide whether the entry still matches its current category under the new manifest.

## Entry
- Name: ${candidate.name}
- Repo: ${candidate.repo}
- Description: ${candidate.description}
${candidate.tagline ? `- Tagline: ${candidate.tagline}` : ""}
- Current category: ${candidate.currentCategory}

## Category catalog
${catalog}

## Rules
- "fits" if current category's scope_in matches the entry AND its scope_out does not.
- "move_to" if another category fits strictly better. Pick the single best target.
- "uncertain" only when two categories fit equally or information is insufficient.
- Target category must be an exact name from the catalog above.

Call the submit_verdict tool.`;

  const response = await anthropic.messages.create({
    model: getModel(),
    max_tokens: MAX_TOKENS,
    tools: [TOOL_DEFINITION],
    tool_choice: { type: "tool", name: "submit_verdict" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find((c) => c.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error(`No tool call for ${candidate.repo}`);
  }

  const parsed = toolUse.input as { verdict: Verdict; target: string | null; reason: string };
  const target = parsed.verdict === "move_to" ? parsed.target : null;

  if (parsed.verdict === "move_to" && (!target || !allowedNames.has(target))) {
    return {
      result: {
        verdict: "uncertain",
        target: null,
        reason: `LLM proposed invalid target '${target ?? ""}'. Original reason: ${parsed.reason}`,
      },
      tokensUsed: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
    };
  }

  return {
    result: { verdict: parsed.verdict, target, reason: parsed.reason },
    tokensUsed: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
  };
}

function extractCandidates(yamlContent: string): ReclassifyCandidate[] {
  const doc = parseDocument(yamlContent);
  const categoriesNode = doc.get("categories", true);
  if (!isSeq(categoriesNode)) return [];

  const out: ReclassifyCandidate[] = [];
  for (const catItem of categoriesNode.items) {
    if (!isMap(catItem)) continue;
    const categoryName = stringFrom(catItem.get("name")) ?? "";
    const entriesNode = catItem.get("entries", true);
    if (!isSeq(entriesNode)) continue;

    for (const entry of entriesNode.items) {
      if (!isMap(entry)) continue;
      const repo = stringFrom(entry.get("repo"));
      if (!repo) continue;
      out.push({
        name: stringFrom(entry.get("name")) ?? repo,
        repo,
        description: stringFrom(entry.get("description")) ?? "",
        tagline: stringFrom(entry.get("tagline")),
        currentCategory: categoryName,
      });
    }
  }
  return out;
}

function stringFrom(node: unknown): string | undefined {
  if (typeof node === "string") return node;
  if (isScalar(node) && typeof node.value === "string") return node.value;
  return undefined;
}

export function renderReport(records: ReclassifyRecord[]): string {
  const fits = records.filter((r) => r.decision.verdict === "fits");
  const moves = records.filter((r) => r.decision.verdict === "move_to");
  const uncertain = records.filter((r) => r.decision.verdict === "uncertain");

  const lines: string[] = [];
  lines.push(`# Reclassify audit report`);
  lines.push("");
  lines.push(`Generated ${new Date().toISOString()}. Total entries reviewed: ${records.length}.`);
  lines.push(
    `| Verdict | Count |`,
    `| ------- | ----- |`,
    `| fits | ${fits.length} |`,
    `| move_to | ${moves.length} |`,
    `| uncertain | ${uncertain.length} |`,
  );
  lines.push("");

  if (moves.length > 0) {
    lines.push(`## Proposed moves`);
    lines.push("");
    for (const r of moves) {
      lines.push(`- **${r.name}** (${r.repo}): \`${r.currentCategory}\` -> \`${r.decision.target}\``);
      lines.push(`  - ${r.decision.reason}`);
    }
    lines.push("");
  }

  if (uncertain.length > 0) {
    lines.push(`## Uncertain - needs human review`);
    lines.push("");
    for (const r of uncertain) {
      lines.push(`- **${r.name}** (${r.repo}): in \`${r.currentCategory}\``);
      lines.push(`  - ${r.decision.reason}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
