import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { reclassifyEntries, renderReport } from "../agents/reclassify.js";
import { loadManifest } from "../categories.js";
import { logger } from "../utils/logger.js";

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

  mkdirSync(resolve(options.reportPath, ".."), { recursive: true });
  writeFileSync(options.reportPath, renderReport(result.records));
  logger.info(`Wrote ${options.reportPath}. Tokens used: ${result.tokensUsed}`);
}
