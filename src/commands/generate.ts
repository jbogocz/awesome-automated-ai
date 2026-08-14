import { readFileSync, writeFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { loadManifest } from "../categories.js";
import { MIN_FRESH_RATIO } from "../constants.js";
import { fetchRepoData, freshRatio, loadApiDataFromDB } from "../generator/fetch-api.js";
import { type ApiData, generateReadme } from "../generator/readme.js";
import { logger } from "../utils/logger.js";
import { validateProjectsYaml } from "../validation/projects-yaml.js";

export interface GenerateOptions {
  projectsYamlPath: string;
  headerPath: string;
  footerPath: string;
  readmePath: string;
  cachePath: string;
  noFetch: boolean;
}

export async function runGenerateCommand(options: GenerateOptions): Promise<void> {
  const yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  const header = readFileSync(options.headerPath, "utf-8");
  const footer = readFileSync(options.footerPath, "utf-8");

  // Validate YAML structure before generating
  const parsed = parseYaml(yamlContent);
  const validation = validateProjectsYaml(parsed);
  if (!validation.ok) {
    logger.error(`projects.yaml validation failed: ${validation.error}`);
    process.exit(1);
  }

  let apiData: ApiData;

  if (options.noFetch) {
    apiData = loadApiDataFromDB(yamlContent);
    logger.info(`Loaded ${Object.keys(apiData).length} repos from DB (--no-fetch)`);
  } else {
    const result = await fetchRepoData(yamlContent);
    const fresh = freshRatio(result);
    // The weekly job runs unattended. Without this gate a total GitHub
    // outage fetched 0 of 249 repos, exited 0, and still committed, version
    // bumped, released and deployed — publishing week-old fallback as
    // current with nothing to distinguish it from a good run.
    if (fresh < MIN_FRESH_RATIO) {
      logger.error(
        `Only ${(fresh * 100).toFixed(1)}% of ${result.attempted} repos returned live data ` +
          `(${result.stale.length} stale, ${result.failed.length} with no fallback); ` +
          `refusing to regenerate below ${(MIN_FRESH_RATIO * 100).toFixed(0)}%.`,
      );
      process.exit(1);
    }
    if (fresh < 1) {
      logger.warn(`${(fresh * 100).toFixed(1)}% live coverage — proceeding, but some entries serve cached data.`);
    }
    apiData = result.data;
    writeFileSync(options.cachePath, JSON.stringify(apiData, null, 2));
    logger.info("Cached API data");
  }

  const readme = generateReadme({ yamlContent, header, footer, apiData, manifest: loadManifest() });
  writeFileSync(options.readmePath, readme);
  logger.info("Generated README.md");
}
