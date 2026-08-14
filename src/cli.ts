import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { defaultAuditOptions, renderAuditReport, runAuditCommand } from "./commands/audit.js";
import { runBackfillTrendsCommand } from "./commands/backfill-trends.js";
import { defaultCheckLinksOptions, runCheckLinksCommand } from "./commands/check-links.js";
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
  "Usage: tsx src/cli.ts <discover|generate|refresh-tags|reclassify|backfill-trends|validate|check-links|audit> [--dry-run] [--limit=N] [--force] [--repo=X/Y] [--resume] [--no-fetch] [--strict] [--verbose]";

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
      strict: { type: "boolean" },
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
  const strict = values.strict ?? false;

  if (verbose) {
    process.env.LOG_LEVEL = "debug";
  }

  try {
    switch (command) {
      case "audit": {
        const findings = await runAuditCommand(defaultAuditOptions(ROOT));
        const report = renderAuditReport(findings);
        if (report === "") {
          logger.info("No catalog drift found.");
        } else {
          logger.warn(`${findings.length} drift finding(s):`);
          // stdout so the workflow can pipe this straight into an issue body.
          process.stdout.write(`${report}\n`);
        }
        break;
      }
      case "check-links": {
        // Advisory by default: link rot appears with no code change, so a
        // scheduled run reports it rather than failing the pipeline. --strict
        // is for a deliberate pre-release check.
        const broken = await runCheckLinksCommand({ ...defaultCheckLinksOptions(ROOT), reportRedirects: true });
        if (strict && broken > 0) process.exit(1);
        break;
      }
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
