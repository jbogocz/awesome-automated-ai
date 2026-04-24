import { readFileSync, writeFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { fetchRepoData, loadApiDataFromDB } from "../generator/fetch-api.js";
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
    apiData = await fetchRepoData(yamlContent);
    writeFileSync(options.cachePath, JSON.stringify(apiData, null, 2));
    logger.info("Cached API data");
  }

  const readme = generateReadme({ yamlContent, header, footer, apiData });
  writeFileSync(options.readmePath, readme);
  logger.info("Generated README.md");
}
