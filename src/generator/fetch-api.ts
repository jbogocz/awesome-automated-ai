import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { fetchRepoMetadataBatch } from "../github/repo-metadata-graphql.js";
import { computeQualityScore } from "../scoring/quality.js";
import { computeTrends } from "../scoring/trends.js";
import { lastLifeSign } from "../status.js";
import { logger } from "../utils/logger.js";
import { backfillBatch } from "./backfill.js";
import type { ApiData, ApiRepoData } from "./readme.js";

/**
 * Build an ApiData entry from the latest DB snapshot. Shared by the offline
 * path and the live path's fallback for repos whose fetch failed.
 */
function entryFromLatestSnapshot(db: DB, projectId: number, yamlTagline: string | undefined): ApiRepoData | null {
  const latest = db.getLatestSnapshot(projectId);
  if (!latest) return null;

  const stars7dAgo = db.getStarsNDaysAgo(projectId, 7);
  const stars30dAgo = db.getStarsNDaysAgo(projectId, 30);
  const starsPrevious = db.getPreviousStars(projectId);
  const { trend, trend7d, trend30d } = computeTrends({
    currentStars: latest.stars,
    stars7dAgo,
    stars30dAgo,
    starsPrevious,
  });

  return {
    stars: latest.stars,
    pushed: latest.pushedAt ?? "",
    archived: latest.archived ?? false,
    license: latest.license,
    trend,
    trend7d,
    trend30d,
    lastRelease: latest.lastRelease,
    lastCommit: latest.lastCommit,
    lastTag: latest.lastTag,
    lastStableTag: latest.lastStableTag,
    commits90d: latest.commits90d,
    score: latest.compositeScore ?? 0,
    topics: latest.topics ?? [],
    tagline: yamlTagline ?? db.getTagline(projectId) ?? null,
    history: db.getSnapshotSeries(projectId, SPARKLINE_DAYS),
  };
}

/** Window the dashboard sparkline plots, in days. */
const SPARKLINE_DAYS = 90;

export interface FetchResult {
  data: ApiData;
  /** Repos whose live fetch failed but had a DB snapshot to fall back on. */
  stale: string[];
  /** Repos whose live fetch failed with no snapshot to fall back on. */
  failed: string[];
  /** Repos with a `repo:` field that were attempted this run. */
  attempted: number;
}

/** Share of attempted repos that returned live data this run. */
export function freshRatio(r: FetchResult): number {
  if (r.attempted === 0) return 1;
  return (r.attempted - r.stale.length - r.failed.length) / r.attempted;
}

export async function fetchRepoData(yamlContent: string): Promise<FetchResult> {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string; tagline?: string }[] }[];
  };
  const repos: { repo: string; name: string; tagline?: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) {
        repos.push({ repo: entry.repo, name: entry.name ?? entry.repo, tagline: entry.tagline });
      }
    }
  }
  logger.info(`Fetching data for ${repos.length} repos...`);

  const dbPath = resolve(import.meta.dirname, "../../data/curator.db");
  const db = new DB(dbPath);
  try {
    return await collectRepoData(db, repos);
  } finally {
    db.close();
  }
}

async function collectRepoData(
  db: DB,
  repos: { repo: string; name: string; tagline?: string }[],
): Promise<FetchResult> {
  db.migrate();

  // Pass 1: fetch live state (alias-batched GraphQL) and detect which
  // repos lack 30d history.
  const rawByRepo = await fetchRepoMetadataBatch(repos.map((r) => r.repo));
  const projectIdByRepo = new Map<string, number>();
  const pendingBackfill: { repo: string; projectId: number; currentStars: number }[] = [];

  for (const { repo, name } of repos) {
    const projectId = db.upsertProject(repo, name);
    projectIdByRepo.set(repo, projectId);
    // Only backfill from live metadata. Seeding from a failed fetch meant
    // currentStars=0, which computeDailySnapshots turned into 30 zero and
    // negative star rows — persisted with INSERT OR IGNORE, never rewritten
    // (the getStarsNDaysAgo guard below stays satisfied forever after), and
    // later surfacing as a fabricated four-digit "+N last 30d".
    const raw = rawByRepo.get(repo);
    if (raw && raw.stars > 0 && db.getStarsNDaysAgo(projectId, 30) === null) {
      pendingBackfill.push({ repo, projectId, currentStars: raw.stars });
    }
  }

  // Keep projects.status truthful: projects.yaml is the authoritative list.
  const { delisted, relisted } = db.syncListedStatus(repos.map((r) => r.repo));
  if (delisted.length > 0) {
    logger.info(`Delisted ${delisted.length} project(s) removed from projects.yaml: ${delisted.join(", ")}`);
  }
  if (relisted.length > 0) {
    logger.info(`Marked ${relisted.length} project(s) as listed: ${relisted.join(", ")}`);
  }

  if (pendingBackfill.length > 0) {
    logger.info(`Backfilling 30d history for ${pendingBackfill.length} new/missing repos...`);
    await backfillBatch(pendingBackfill, db);
  }

  // Pass 2: compute trends + scores now that history exists.
  const data: ApiData = {};
  const stale: string[] = [];
  const failed: string[] = [];
  for (const { repo, tagline: yamlTagline } of repos) {
    const raw = rawByRepo.get(repo);
    const projectId = projectIdByRepo.get(repo);
    if (!raw || projectId === undefined) {
      // Fetch failed: serve the latest DB snapshot when one exists,
      // otherwise leave the entry out so it renders as "stats pending".
      const fallback = projectId !== undefined ? entryFromLatestSnapshot(db, projectId, yamlTagline) : null;
      if (fallback) {
        data[repo] = fallback;
        stale.push(repo);
      } else {
        failed.push(repo);
      }
      continue;
    }

    const starsPrevious = db.getPreviousStars(projectId);
    const stars7dAgo = db.getStarsNDaysAgo(projectId, 7);
    const stars30dAgo = db.getStarsNDaysAgo(projectId, 30);
    const { trend, trend7d, trend30d } = computeTrends({
      currentStars: raw.stars,
      stars7dAgo,
      stars30dAgo,
      starsPrevious,
    });

    const score = computeQualityScore({
      stars: raw.stars,
      starsPrevious,
      trend7d,
      trend30d,
      lastLifeSign: lastLifeSign({
        archived: raw.archived,
        lastCommit: raw.lastCommit,
        lastRelease: raw.lastRelease,
        lastTag: raw.lastTag,
        lastStableTag: raw.lastStableTag,
        commits90d: raw.commits90d,
      }),
      license: raw.license,
      archived: raw.archived,
    });
    db.insertSnapshot(projectId, raw.stars, score, {
      archived: raw.archived,
      pushedAt: raw.pushed || null,
      license: raw.license,
      topics: raw.topics,
      lastRelease: raw.lastRelease,
      lastCommit: raw.lastCommit,
      lastTag: raw.lastTag,
      lastStableTag: raw.lastStableTag,
      commits90d: raw.commits90d,
    });
    db.updateProjectMetadata(projectId, {
      stars: raw.stars,
      archived: raw.archived,
      lastCommit: raw.lastCommit,
      language: raw.language,
    });

    // Tagline: projects.yaml is the source of truth, so a YAML edit wins and
    // rewrites the cached copy. The DB used to win, which meant curators
    // editing projects.yaml saw no effect and no error.
    let tagline = db.getTagline(projectId);
    if (yamlTagline && yamlTagline !== tagline) {
      db.setTagline(projectId, yamlTagline);
      tagline = yamlTagline;
    }

    data[repo] = {
      stars: raw.stars,
      pushed: raw.pushed,
      archived: raw.archived,
      license: raw.license,
      trend,
      trend7d,
      trend30d,
      lastRelease: raw.lastRelease,
      lastCommit: raw.lastCommit,
      lastTag: raw.lastTag,
      lastStableTag: raw.lastStableTag,
      commits90d: raw.commits90d,
      score,
      topics: raw.topics,
      tagline,
      // Read after insertSnapshot above so today's point is included.
      history: db.getSnapshotSeries(projectId, SPARKLINE_DAYS),
    };
  }
  if (stale.length > 0) {
    logger.warn(`${stale.length} repo(s) failed to fetch; serving their latest DB snapshot: ${stale.join(", ")}`);
  }
  if (failed.length > 0) {
    logger.warn(`${failed.length} repo(s) failed to fetch with no snapshot to fall back on: ${failed.join(", ")}`);
  }

  return { data, stale, failed, attempted: repos.length };
}

/**
 * Assemble ApiData from the SQLite database only — no GitHub API calls.
 * Uses the latest snapshot per repo + projects.tagline. Trend values come from
 * comparing latest snapshot.stars against snapshots from 7 and 30 days ago.
 * Safe to call offline; requires that generate or backfill-trends has been
 * run at least once to populate the DB.
 */
export function loadApiDataFromDB(yamlContent: string): ApiData {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string; tagline?: string }[] }[];
  };
  const repos: { repo: string; name: string; tagline?: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) {
        repos.push({ repo: entry.repo, name: entry.name ?? entry.repo, tagline: entry.tagline });
      }
    }
  }

  const dbPath = resolve(import.meta.dirname, "../../data/curator.db");
  const db = new DB(dbPath);
  try {
    db.migrate();

    const data: ApiData = {};
    const missing: string[] = [];
    for (const { repo, name, tagline: yamlTagline } of repos) {
      const projectId = db.upsertProject(repo, name);
      const entry = entryFromLatestSnapshot(db, projectId, yamlTagline);
      if (!entry) {
        // No snapshot yet — the entry renders as "stats pending".
        missing.push(repo);
        continue;
      }
      data[repo] = entry;
    }
    if (missing.length > 0) {
      logger.warn(
        `${missing.length} repo(s) have no snapshot yet and will render without stats ` +
          `(run generate with fetch to backfill): ${missing.join(", ")}`,
      );
    }
    return data;
  } finally {
    db.close();
  }
}
