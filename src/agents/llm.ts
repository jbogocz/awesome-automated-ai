import type Anthropic from "@anthropic-ai/sdk";

export const DEFAULT_MODEL = "claude-sonnet-5-5";

export const MAX_TOKENS_ANALYSIS = 16000;
export const MAX_TOKENS_TAG_CURATION = 16000;

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}

/**
 * The input of the tool call a reply was asked to make.
 *
 * Requests leave `tool_choice` on auto: current models reject a forced tool
 * with HTTP 400, so the prompt asks for the call and this check enforces it.
 * A reply that stopped for another reason is named as such. A reply cut off at
 * `max_tokens` is refused even when its partial input happens to validate,
 * since a truncated description or reason would be stored as a finished one.
 */
export function toolInput(response: Anthropic.Message, toolName: string, subject: string): unknown {
  if (response.stop_reason === "refusal") {
    const category = response.stop_details?.category;
    throw new Error(`Claude refused ${subject}${category ? ` (${category})` : ""}`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error(`Claude's reply for ${subject} hit max_tokens before the ${toolName} call was complete`);
  }
  const block = response.content.find((c) => c.type === "tool_use" && c.name === toolName);
  if (block?.type !== "tool_use") {
    throw new Error(`Claude did not call ${toolName} for ${subject}`);
  }
  return block.input;
}
