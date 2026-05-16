import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runBackfillTrendsCommand } from "./commands/backfill-trends.js";
import { runDiscoverCommand } from "./commands/discover.js";
import { runGenerateCommand } from "./commands/generate.js";
import { runReclassifyCommand } from "./commands/reclassify.js";
import { runRefreshTagsCommand } from "./commands/refresh-tags.js";
import { runValidateCommand } from "./commands/validate.js";
import { logger } from "./utils/logger.js";

const ROOT = resolve(import.meta.dirname, "..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const HEADER_MD = resolve(ROOT, "templates/header.md");
const FOOTER_MD = resolve(ROOT, "templates/footer.md");
const README_MD = resolve(ROOT, "README.md");
const CACHE_FILE = resolve(ROOT, "data/api_cache.json");
const RECLASSIFY_REPORT = resolve(ROOT, "data/reclassify-report.md");
const DB_PATH = resolve(ROOT, "data/curator.db");

const USAGE =
  "Usage: tsx src/cli.ts <discover|generate|refresh-tags|reclassify|backfill-trends|validate> [--dry-run] [--limit=N] [--force] [--repo=X/Y] [--resume] [--no-fetch] [--verbose]";

function usage(): never {
  logger.error(USAGE);
  process.exit(1);
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      "dry-run": { type: "boolean" },
      force: { type: "boolean" },
      resume: { type: "boolean" },
      "no-fetch": { type: "boolean" },
      verbose: { type: "boolean" },
      limit: { type: "string" },
      repo: { type: "string" },
    },
  });

  const command = positionals[0];
  const dryRun = values["dry-run"] ?? false;
  const force = values.force ?? false;
  const resume = values.resume ?? false;
  const noFetch = values["no-fetch"] ?? false;
  const verbose = values.verbose ?? false;
  const limit = values.limit !== undefined ? Number.parseInt(values.limit, 10) : undefined;
  const repo = values.repo;

  if (verbose) {
    process.env.LOG_LEVEL = "debug";
  }

  try {
    switch (command) {
      case "discover": {
        await runDiscoverCommand({ projectsYamlPath: PROJECTS_YAML });
        break;
      }
      case "generate": {
        await runGenerateCommand({
          projectsYamlPath: PROJECTS_YAML,
          headerPath: HEADER_MD,
          footerPath: FOOTER_MD,
          readmePath: README_MD,
          cachePath: CACHE_FILE,
          noFetch,
        });
        break;
      }
      case "refresh-tags": {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          logger.error("ANTHROPIC_API_KEY env var is required for refresh-tags");
          process.exit(1);
        }
        await runRefreshTagsCommand({
          projectsYamlPath: PROJECTS_YAML,
          cachePath: CACHE_FILE,
          apiKey,
          dryRun,
          limit,
        });
        break;
      }
      case "reclassify": {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          logger.error("ANTHROPIC_API_KEY env var is required for reclassify");
          process.exit(1);
        }
        await runReclassifyCommand({
          projectsYamlPath: PROJECTS_YAML,
          reportPath: RECLASSIFY_REPORT,
          apiKey,
          limit,
        });
        break;
      }
      case "backfill-trends": {
        await runBackfillTrendsCommand({
          projectsYamlPath: PROJECTS_YAML,
          dbPath: DB_PATH,
          force,
          resume,
          repo,
        });
        break;
      }
      case "validate": {
        runValidateCommand({ projectsYamlPath: PROJECTS_YAML });
        break;
      }
      default: {
        usage();
      }
    }
  } catch (err) {
    logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
    process.exit(1);
  }
}

await main();
