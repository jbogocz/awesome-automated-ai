import { z } from "zod";

const ConfigSchema = z.object({
  anthropicApiKey: z.string().min(1),
  githubToken: z.string().min(1),
  githubRepoOwner: z.string().min(1),
  githubRepoName: z.string().min(1),
  dbPath: z.string().min(1).default("data/curator.db"),
  maxCandidatesPerRun: z.number().int().positive().default(50),
  scoreThresholdAuto: z.number().int().min(0).max(100).default(70),
  scoreThresholdQueue: z.number().int().min(0).max(100).default(50),
  maxPrsPerDay: z.number().int().positive().default(3),
  dryRun: z.boolean().default(false),
  costCapPerRun: z.number().positive().default(10),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  return ConfigSchema.parse({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepoOwner: process.env.GITHUB_REPO_OWNER,
    githubRepoName: process.env.GITHUB_REPO_NAME,
    dbPath: process.env.DB_PATH ?? "data/curator.db",
    maxCandidatesPerRun: maybeInt(process.env.MAX_CANDIDATES_PER_RUN) ?? 50,
    scoreThresholdAuto: maybeInt(process.env.SCORE_THRESHOLD_AUTO) ?? 70,
    scoreThresholdQueue: maybeInt(process.env.SCORE_THRESHOLD_QUEUE) ?? 50,
    maxPrsPerDay: maybeInt(process.env.MAX_PRS_PER_DAY) ?? 3,
    dryRun: process.env.DRY_RUN === "true",
    costCapPerRun: maybeFloat(process.env.COST_CAP_PER_RUN) ?? 10,
  });
}

function maybeInt(val: string | undefined): number | undefined {
  if (val === undefined) return undefined;
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? undefined : n;
}

function maybeFloat(val: string | undefined): number | undefined {
  if (val === undefined) return undefined;
  const n = parseFloat(val);
  return Number.isNaN(n) ? undefined : n;
}
