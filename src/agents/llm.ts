export const DEFAULT_MODEL = "claude-sonnet-4-6";

export const MAX_TOKENS_ANALYSIS = 1024;
export const MAX_TOKENS_TAG_CURATION = 512;

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}
