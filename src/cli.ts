import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runDiscovery } from "./agents/discovery.js";
import { loadConfig } from "./config.js";
import { fetchRepoData } from "./generator/fetch-api.js";
import { type ApiData, generateReadme } from "./generator/readme.js";

const ROOT = resolve(import.meta.dirname, "..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const HEADER_MD = resolve(ROOT, "templates/header.md");
const FOOTER_MD = resolve(ROOT, "templates/footer.md");
const README_MD = resolve(ROOT, "README.md");
const CACHE_FILE = resolve(ROOT, "data/api_cache.json");

async function main() {
  const command = process.argv[2];

  if (command === "discover") {
    const config = loadConfig();
    console.log(`Starting discovery (dry_run=${config.dryRun})...`);
    const result = await runDiscovery(config, PROJECTS_YAML);
    console.log(`\nDiscovery complete:`);
    console.log(`  Candidates: ${result.candidatesFound}`);
    console.log(`  PRs created: ${result.prsCreated}`);
    console.log(`  Queued: ${result.queued}`);
    console.log(`  Discarded: ${result.discarded}`);
    console.log(`  Tokens: ${result.tokensUsed}`);
  } else if (command === "generate") {
    const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
    const header = readFileSync(HEADER_MD, "utf-8");
    const footer = readFileSync(FOOTER_MD, "utf-8");

    const noFetch = process.argv.includes("--no-fetch");
    let apiData: ApiData;

    if (noFetch) {
      apiData = JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
      console.log("Using cached API data");
    } else {
      apiData = fetchRepoData(yamlContent);
      writeFileSync(CACHE_FILE, JSON.stringify(apiData, null, 2));
      console.log("Cached API data");
    }

    const readme = generateReadme({ yamlContent, header, footer, apiData });
    writeFileSync(README_MD, readme);
    console.log("Generated README.md");
  } else {
    console.error("Usage: tsx src/cli.ts <discover|generate>");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
