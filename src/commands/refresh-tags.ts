import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { refreshTags } from "../agents/refresh-tags.js";
import type { ApiData } from "../generator/readme.js";
import { logger } from "../utils/logger.js";

export interface RefreshTagsOptions {
  projectsYamlPath: string;
  cachePath: string;
  apiKey: string;
  dryRun: boolean;
  limit?: number;
}

export async function runRefreshTagsCommand(options: RefreshTagsOptions): Promise<void> {
  const yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  const apiData: ApiData = existsSync(options.cachePath) ? JSON.parse(readFileSync(options.cachePath, "utf-8")) : {};

  const result = await refreshTags({
    yamlContent,
    apiData,
    apiKey: options.apiKey,
    limit: options.limit,
    dryRun: options.dryRun,
    onProgress: (e) => {
      const diff = `${e.before.length} -> ${e.after.length}`;
      logger.info(`[${e.index}/${e.total}] ${e.repo}  ${diff}  -  ${e.reasoning}`);
    },
  });

  if (!options.dryRun) {
    writeFileSync(options.projectsYamlPath, result.yamlContent);
    logger.info(`Wrote projects.yaml (${result.refreshedCount} entries updated)`);
  } else {
    logger.info(`Dry run: would update ${result.refreshedCount} entries`);
  }
  logger.info(`Failed: ${result.failedCount}. Tokens used: ${result.tokensUsed}`);
}
