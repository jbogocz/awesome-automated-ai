import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { reclassifyEntries, renderReport } from "../agents/reclassify.ts";
import { loadManifest } from "../categories.ts";
import { logger } from "../utils/logger.ts";

export interface ReclassifyOptions {
  projectsYamlPath: string;
  reportPath: string;
  apiKey: string;
  limit?: number;
}

export async function runReclassifyCommand(options: ReclassifyOptions): Promise<void> {
  const yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  const manifest = loadManifest();

  const result = await reclassifyEntries({
    yamlContent,
    manifest,
    apiKey: options.apiKey,
    limit: options.limit,
    onProgress: (e) => {
      const { verdict, target } = e.decision;
      const suffix = verdict === "move_to" ? ` -> ${target}` : "";
      logger.info(`[${e.index}/${e.total}] ${e.candidate.repo}  ${verdict}${suffix}`);
    },
  });

  // Thrown before the write: the report is untracked and a full pass paid for
  // it, so a run that classified nothing must not replace it with an empty one.
  const [first] = result.failures;
  if (result.records.length === 0 && first) {
    throw new Error(`All ${result.failures.length} entries failed; report left as it was. First error: ${first.error}`);
  }

  mkdirSync(resolve(options.reportPath, ".."), { recursive: true });
  writeFileSync(options.reportPath, renderReport(result.records, result.failures));
  logger.info(`Wrote ${options.reportPath}. Tokens used: ${result.tokensUsed}`);
}
