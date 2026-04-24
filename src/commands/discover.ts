import { runDiscovery } from "../agents/discovery.js";
import { loadConfig } from "../config.js";
import { logger } from "../utils/logger.js";

export interface DiscoverOptions {
  projectsYamlPath: string;
}

export async function runDiscoverCommand(options: DiscoverOptions): Promise<void> {
  const config = loadConfig();
  logger.info(`Starting discovery (dry_run=${config.dryRun})...`);
  const result = await runDiscovery(config, options.projectsYamlPath);
  logger.info(`Discovery complete:`);
  logger.info(`  Candidates: ${result.candidatesFound}`);
  logger.info(`  PRs created: ${result.prsCreated}`);
  logger.info(`  Queued: ${result.queued}`);
  logger.info(`  Discarded: ${result.discarded}`);
  logger.info(`  Tokens: ${result.tokensUsed}`);
}
