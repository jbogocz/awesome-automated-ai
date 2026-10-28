import { readFileSync, writeFileSync } from "node:fs";
import { refreshTags } from "../agents/refresh-tags.ts";
import { loadApiData } from "../generator/fetch-api.ts";
import { logger } from "../utils/logger.ts";

export interface RefreshTagsOptions {
  projectsYamlPath: string;
  apiKey: string;
  dryRun: boolean;
  limit?: number;
}

export async function runRefreshTagsCommand(options: RefreshTagsOptions): Promise<void> {
  const yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  const apiData = loadApiData(yamlContent);

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
