import { runDiscovery } from "../agents/discovery.ts";
import { loadConfig } from "../config.ts";
import { logger } from "../utils/logger.ts";

export interface DiscoverOptions {
  projectsYamlPath: string;
  /** --dry-run. Adds to DRY_RUN and cannot switch it off. */
  dryRun: boolean;
}

export async function runDiscoverCommand(options: DiscoverOptions): Promise<void> {
  const loaded = loadConfig();
  const config = { ...loaded, dryRun: options.dryRun || loaded.dryRun };
  logger.info(`Starting discovery (dry_run=${config.dryRun})...`);
  const result = await runDiscovery(config, options.projectsYamlPath);
  logger.info(`Discovery complete:`);
  logger.info(`  Candidates: ${result.candidatesFound}`);
  logger.info(`  PRs created: ${result.prsCreated}`);
  logger.info(`  Queued: ${result.queued}`);
  logger.info(`  Discarded: ${result.discarded}`);
  logger.info(`  Tokens: ${result.tokensUsed}`);
}
