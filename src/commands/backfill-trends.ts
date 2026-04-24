import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { backfillBatch } from "../generator/backfill.js";
import { logger } from "../utils/logger.js";

export interface BackfillTrendsOptions {
  projectsYamlPath: string;
  dbPath: string;
  force: boolean;
  resume: boolean;
  repo?: string;
}

function sanitizeRepoComponent(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]/g, "");
}

function resolveCurrentStarsBatch(repos: { repo: string; name: string }[]): {
  starsByRepo: Map<string, number>;
  unresolvedRepos: Set<string>;
} {
  const starsByRepo = new Map<string, number>();
  const unresolvedRepos = new Set<string>();
  const CHUNK = 50;

  for (let i = 0; i < repos.length; i += CHUNK) {
    const chunk = repos.slice(i, i + CHUNK);
    const aliases = chunk.map((r, idx) => {
      const [owner, name] = r.repo.split("/");
      return `  r${idx}: repository(owner: "${sanitizeRepoComponent(owner)}", name: "${sanitizeRepoComponent(name)}") { stargazerCount }`;
    });
    const query = `query {\n${aliases.join("\n")}\n}`;

    try {
      const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
        timeout: 30_000,
        encoding: "utf-8",
        maxBuffer: 32 * 1024 * 1024,
      });
      const resp = JSON.parse(out) as {
        data?: Record<string, { stargazerCount: number } | null>;
      };
      chunk.forEach((r, idx) => {
        const entry = resp.data?.[`r${idx}`];
        if (entry && typeof entry.stargazerCount === "number") {
          starsByRepo.set(r.repo, entry.stargazerCount);
        } else {
          unresolvedRepos.add(r.repo);
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(`GraphQL batch ${i}-${i + chunk.length} failed: ${msg}`);
      for (const r of chunk) unresolvedRepos.add(r.repo);
    }
  }

  return { starsByRepo, unresolvedRepos };
}

export async function runBackfillTrendsCommand(options: BackfillTrendsOptions): Promise<void> {
  const yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string }[] }[];
  };
  const allRepos: { repo: string; name: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) allRepos.push({ repo: entry.repo, name: entry.name ?? entry.repo });
    }
  }

  const db = new DB(options.dbPath);
  db.migrate();

  const doForce = options.force;
  const doResume = options.resume;
  const onlyMissing = !doForce;

  let target = allRepos;
  if (options.repo) {
    target = allRepos.filter((r) => r.repo === options.repo);
    if (target.length === 0) {
      logger.error(`No such repo in projects.yaml: ${options.repo}`);
      process.exit(1);
    }
  }

  const projectIdByRepo = new Map<string, number>();
  for (const { repo, name } of target) {
    projectIdByRepo.set(repo, db.upsertProject(repo, name));
  }

  let targetAfterMissing = target;
  if (onlyMissing) {
    targetAfterMissing = target.filter((r) => db.getStarsNDaysAgo(projectIdByRepo.get(r.repo) ?? -1, 30) === null);
    logger.info(`Skipping fully-backfilled: ${targetAfterMissing.length}/${target.length} repos need backfill`);
  }

  const { starsByRepo, unresolvedRepos } =
    targetAfterMissing.length > 0
      ? resolveCurrentStarsBatch(targetAfterMissing)
      : { starsByRepo: new Map<string, number>(), unresolvedRepos: new Set<string>() };

  if (unresolvedRepos.size > 0) {
    logger.warn(
      `Could not resolve currentStars for ${unresolvedRepos.size} repos, skipping them: ${[...unresolvedRepos].join(", ")}`,
    );
  }

  const filtered = targetAfterMissing
    .filter((r) => !unresolvedRepos.has(r.repo))
    .map(({ repo }) => ({
      repo,
      projectId: projectIdByRepo.get(repo) ?? 0,
      currentStars: starsByRepo.get(repo) ?? 0,
    }));

  let resumeRunId: number | undefined;
  if (doResume) {
    const rid = db.getResumableBackfillRun();
    if (rid === null) {
      logger.info("No resumable run found; starting a new one.");
    } else {
      resumeRunId = rid;
      logger.info(`Resuming run ${rid}`);
    }
  }

  const summary = await backfillBatch(filtered, db, { resumeRunId });
  logger.info(`Backfill complete: OK=${summary.ok} skipped=${summary.skipped} points=${summary.pointsUsed}`);
  logger.info(`Reasons: ${JSON.stringify(summary.reasons)}`);
  db.close();
}
