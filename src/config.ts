import { z } from "zod";

const ConfigSchema = z.object({
  anthropicApiKey: z.string().min(1),
  githubRepoOwner: z.string().min(1),
  githubRepoName: z.string().min(1),
  decisionsPath: z.string().min(1).default("data/decisions.jsonl"),
  maxCandidatesPerRun: z.number().int().positive().default(50),
  scoreThresholdAuto: z.number().int().min(0).max(100).default(70),
  scoreThresholdQueue: z.number().int().min(0).max(100).default(50),
  maxPrsPerDay: z.number().int().positive().default(3),
  dryRun: z.boolean().default(false),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  return ConfigSchema.parse({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    githubRepoOwner: process.env.GITHUB_REPO_OWNER,
    githubRepoName: process.env.GITHUB_REPO_NAME,
    decisionsPath: process.env.DECISIONS_PATH ?? "data/decisions.jsonl",
    maxCandidatesPerRun: intVar("MAX_CANDIDATES_PER_RUN") ?? 50,
    scoreThresholdAuto: intVar("SCORE_THRESHOLD_AUTO") ?? 70,
    scoreThresholdQueue: intVar("SCORE_THRESHOLD_QUEUE") ?? 50,
    maxPrsPerDay: intVar("MAX_PRS_PER_DAY") ?? 3,
    dryRun: boolVar("DRY_RUN") ?? false,
  });
}

// A variable that is set but unreadable is an error, not a default: DRY_RUN=TRUE
// used to mean "not a dry run" and open real pull requests, and parseInt read
// SCORE_THRESHOLD_AUTO=7o as 7. An empty value counts as unset.
function intVar(name: string): number | undefined {
  const val = process.env[name];
  if (val === undefined || val === "") return undefined;
  if (!/^-?\d+$/.test(val)) throw new Error(`${name} must be an integer, got "${val}"`);
  return Number(val);
}

function boolVar(name: string): boolean | undefined {
  const val = process.env[name];
  if (val === undefined || val === "") return undefined;
  if (val !== "true" && val !== "false") throw new Error(`${name} must be "true" or "false", got "${val}"`);
  return val === "true";
}
