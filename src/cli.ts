import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { runDiscovery } from "./agents/discovery.js";
import { reclassifyEntries, renderReport } from "./agents/reclassify.js";
import { refreshTags } from "./agents/refresh-tags.js";
import { loadManifest } from "./categories.js";
import { loadConfig } from "./config.js";
import { DB } from "./db/client.js";
import { backfillBatch } from "./generator/backfill.js";
import { fetchRepoData } from "./generator/fetch-api.js";
import { type ApiData, generateReadme } from "./generator/readme.js";

const ROOT = resolve(import.meta.dirname, "..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const HEADER_MD = resolve(ROOT, "templates/header.md");
const FOOTER_MD = resolve(ROOT, "templates/footer.md");
const README_MD = resolve(ROOT, "README.md");
const CACHE_FILE = resolve(ROOT, "data/api_cache.json");
const RECLASSIFY_REPORT = resolve(ROOT, "data/reclassify-report.md");

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
      apiData = await fetchRepoData(yamlContent);
      writeFileSync(CACHE_FILE, JSON.stringify(apiData, null, 2));
      console.log("Cached API data");
    }

    const readme = generateReadme({ yamlContent, header, footer, apiData });
    writeFileSync(README_MD, readme);
    console.log("Generated README.md");
  } else if (command === "refresh-tags") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY env var is required for refresh-tags");
      process.exit(1);
    }
    const dryRun = process.argv.includes("--dry-run");
    const limitArg = process.argv.find((a) => a.startsWith("--limit="));
    const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : undefined;

    const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
    const apiData: ApiData = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf-8")) : {};

    const result = await refreshTags({
      yamlContent,
      apiData,
      apiKey,
      limit,
      dryRun,
      onProgress: (e) => {
        const diff = `${e.before.length} -> ${e.after.length}`;
        console.log(`[${e.index}/${e.total}] ${e.repo}  ${diff}  -  ${e.reasoning}`);
      },
    });

    if (!dryRun) {
      writeFileSync(PROJECTS_YAML, result.yamlContent);
      console.log(`Wrote projects.yaml (${result.refreshedCount} entries updated)`);
    } else {
      console.log(`Dry run: would update ${result.refreshedCount} entries`);
    }
    console.log(`Failed: ${result.failedCount}. Tokens used: ${result.tokensUsed}`);
  } else if (command === "reclassify") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY env var is required for reclassify");
      process.exit(1);
    }
    const limitArg = process.argv.find((a) => a.startsWith("--limit="));
    const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : undefined;

    const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
    const manifest = loadManifest();

    const result = await reclassifyEntries({
      yamlContent,
      manifest,
      apiKey,
      limit,
      onProgress: (e) => {
        const { verdict, target } = e.decision;
        const suffix = verdict === "move_to" ? ` -> ${target}` : "";
        console.log(`[${e.index}/${e.total}] ${e.candidate.repo}  ${verdict}${suffix}`);
      },
    });

    mkdirSync(resolve(ROOT, "data"), { recursive: true });
    writeFileSync(RECLASSIFY_REPORT, renderReport(result.records));
    console.log(`Wrote ${RECLASSIFY_REPORT}. Tokens used: ${result.tokensUsed}`);
  } else if (command === "backfill-trends") {
    const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
    const doc = parseYaml(yamlContent) as {
      categories: { entries?: { repo?: string; name?: string }[] }[];
    };
    const allRepos: { repo: string; name: string }[] = [];
    for (const cat of doc.categories) {
      for (const entry of cat.entries ?? []) {
        if (entry.repo) allRepos.push({ repo: entry.repo, name: entry.name ?? entry.repo });
      }
    }

    const dbPath = resolve(ROOT, "data/curator.db");
    const db = new DB(dbPath);
    db.migrate();

    const repoFlag = process.argv.find((a) => a.startsWith("--repo="));
    const onlyMissing = process.argv.includes("--missing");
    const doResume = process.argv.includes("--resume");

    let target = allRepos;
    if (repoFlag) {
      const wanted = repoFlag.split("=")[1];
      target = allRepos.filter((r) => r.repo === wanted);
      if (target.length === 0) {
        console.error(`No such repo in projects.yaml: ${wanted}`);
        process.exit(1);
      }
    }

    // Resolve currentStars via gh CLI (same auth path as fetch-api).
    const currentStarsByRepo = new Map<string, number>();
    for (const { repo } of target) {
      try {
        const out = execFileSync("gh", ["api", `repos/${repo}`, "--jq", ".stargazers_count"], {
          timeout: 15_000,
          encoding: "utf-8",
        }).trim();
        currentStarsByRepo.set(repo, Number(out) || 0);
      } catch {
        currentStarsByRepo.set(repo, 0);
      }
    }

    const inputs = target.map(({ repo, name }) => {
      const projectId = db.upsertProject(repo, name);
      return { repo, projectId, currentStars: currentStarsByRepo.get(repo) ?? 0 };
    });

    let filtered = inputs;
    if (onlyMissing) {
      filtered = inputs.filter((i) => db.getStarsNDaysAgo(i.projectId, 30) === null);
      console.log(`--missing: ${filtered.length}/${inputs.length} repos need backfill`);
    }

    let resumeRunId: number | undefined;
    if (doResume) {
      const rid = db.getResumableBackfillRun();
      if (rid === null) {
        console.log("No resumable run found; starting a new one.");
      } else {
        resumeRunId = rid;
        console.log(`Resuming run ${rid}`);
      }
    }

    const summary = await backfillBatch(filtered, db, { resumeRunId });
    console.log(`Backfill complete: OK=${summary.ok} skipped=${summary.skipped} points=${summary.pointsUsed}`);
    console.log(`Reasons: ${JSON.stringify(summary.reasons)}`);
    db.close();
  } else {
    console.error(
      "Usage: tsx src/cli.ts <discover|generate|refresh-tags|reclassify|backfill-trends> [--dry-run] [--limit=N] [--all] [--missing] [--repo=X/Y] [--resume]",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
