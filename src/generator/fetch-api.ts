import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { fetchRepoMetadataBatch } from "../github/repo-metadata-graphql.js";
import { computeQualityScore } from "../scoring/quality.js";
import { computeTrends } from "../scoring/trends.js";
import { lastLifeSign } from "../status.js";
import { logger } from "../utils/logger.js";
import type { ApiData, ApiRepoData } from "./readme.js";

/**
 * Build an ApiData entry from the latest DB snapshot. Shared by the offline
 * path and the live path's fallback for repos whose fetch failed.
 *
 * `runDate` is the date of the current run's fetch. A latest snapshot older
 * than that failed to refresh, so the entry carries `stale` with the date its
 * figures were actually measured.
 */
function entryFromLatestSnapshot(
  db: DB,
  projectId: number,
  repoTagline: string | undefined,
  runDate: string | null,
): ApiRepoData | null {
  const latest = db.getLatestSnapshot(projectId);
  if (!latest) return null;

  // Trend windows look back from the snapshot's own date. Measured from
  // today, a week-old fallback compared its count with itself and published
  // "+0 last 7d" under a window label it did not span.
  const asOf = latest.snapshotDate;
  const stars7dAgo = db.getStarsNDaysAgo(projectId, 7, asOf);
  const stars30dAgo = db.getStarsNDaysAgo(projectId, 30, asOf);
  const starsPrevious = db.getPreviousStars(projectId, asOf);
  const { trend, trend7d, trend30d, trend30dDays, trend7dDays } = computeTrends({
    currentStars: latest.stars,
    stars7dAgo,
    stars30dAgo,
    starsPrevious,
    today: new Date(`${asOf}T00:00:00Z`),
  });

  return {
    stars: latest.stars,
    pushed: latest.pushedAt ?? "",
    archived: latest.archived ?? false,
    license: latest.license,
    trend,
    trend7d,
    trend30d,
    trend30dDays,
    trend7dDays,
    lastRelease: latest.lastRelease,
    lastCommit: latest.lastCommit,
    lastTag: latest.lastTag,
    lastStableTag: latest.lastStableTag,
    commits90d: latest.commits90d,
    score: latest.compositeScore ?? 0,
    topics: latest.topics ?? [],
    // projects.yaml only: the DB copy mirrors it, and falling back to that
    // copy kept rendering a tagline after the curator deleted it.
    tagline: repoTagline ?? null,
    history: db.getSnapshotSeries(projectId, SPARKLINE_DAYS),
    ...(runDate && latest.snapshotDate < runDate ? { stale: latest.snapshotDate } : {}),
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

const DEFAULT_DB_PATH = resolve(import.meta.dirname, "../../data/curator.db");

interface RepoEntry {
  repo: string;
  name: string;
}

/**
 * Repo-backed entries of projects.yaml, plus the tagline cached per repo. The
 * cache is repo-keyed, so a repo cross-listed under two entries takes the
 * first tagline any of them declares — otherwise the entry without one would
 * clear what its sibling just wrote, and the stored value would flip with
 * YAML order.
 */
function readRepoEntries(yamlContent: string): { repos: RepoEntry[]; taglineByRepo: Map<string, string> } {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string; tagline?: string }[] }[];
  };
  const repos: RepoEntry[] = [];
  const taglineByRepo = new Map<string, string>();
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (!entry.repo) continue;
      repos.push({ repo: entry.repo, name: entry.name ?? entry.repo });
      if (entry.tagline && !taglineByRepo.has(entry.repo)) taglineByRepo.set(entry.repo, entry.tagline);
    }
  }
  return { repos, taglineByRepo };
}

export async function fetchRepoData(yamlContent: string): Promise<FetchResult> {
  const { repos, taglineByRepo } = readRepoEntries(yamlContent);
  logger.info(`Fetching data for ${repos.length} repos...`);

  const db = new DB(DEFAULT_DB_PATH);
  try {
    return await collectRepoData(db, repos, taglineByRepo);
  } finally {
    db.close();
  }
}

async function collectRepoData(db: DB, repos: RepoEntry[], taglineByRepo: Map<string, string>): Promise<FetchResult> {
  db.migrate();

  // Pass 1: fetch live state (alias-batched GraphQL) and resolve project rows.
  //
  // This used to also queue repos with no 30-day history for star-history
  // reconstruction. That path is gone: GitHub restricted stargazer listings
  // to admins and collaborators (2026-06-30 changelog), so the connection now
  // returns an empty edge list with no error for every third-party repo, and
  // the reconstruction arithmetic turned that silence into today's star count
  // stamped across all 30 past days. It ran here, inside the unattended
  // weekly job, so every newly listed entry would have been fabricated afresh
  // each week. A new entry now simply starts accumulating measured history
  // from its first weekly snapshot, and shows no trend until it has one.
  const rawByRepo = await fetchRepoMetadataBatch(repos.map((r) => r.repo));
  const projectIdByRepo = new Map<string, number>();

  for (const { repo, name } of repos) {
    projectIdByRepo.set(repo, db.upsertProject(repo, name, rawByRepo.get(repo)?.githubId));
  }

  // Keep projects.status truthful: projects.yaml is the authoritative list.
  const { delisted, relisted } = db.syncListedStatus(repos.map((r) => r.repo));
  if (delisted.length > 0) {
    logger.info(`Delisted ${delisted.length} project(s) removed from projects.yaml: ${delisted.join(", ")}`);
  }
  if (relisted.length > 0) {
    logger.info(`Marked ${relisted.length} project(s) as listed: ${relisted.join(", ")}`);
  }

  // Pass 2: compute trends + scores now that history exists.
  const data: ApiData = {};
  const stale: string[] = [];
  const failed: string[] = [];
  // The date insertSnapshot stamps on every live row this run.
  const runDate = new Date().toISOString().slice(0, 10);
  for (const { repo } of repos) {
    const raw = rawByRepo.get(repo);
    const projectId = projectIdByRepo.get(repo);
    if (!raw || projectId === undefined) {
      // Fetch failed: serve the latest DB snapshot when one exists,
      // otherwise leave the entry out so it renders as "stats pending".
      const fallback =
        projectId !== undefined ? entryFromLatestSnapshot(db, projectId, taglineByRepo.get(repo), runDate) : null;
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
    const { trend, trend7d, trend30d, trend30dDays, trend7dDays } = computeTrends({
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
      trend7dDays,
      trend30dDays,
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
    // editing projects.yaml saw no effect and no error. A deletion is an edit
    // too: only overwriting meant a removed tagline lived on in the cache.
    const tagline = taglineByRepo.get(repo) ?? null;
    if (db.getTagline(projectId) !== tagline) db.setTagline(projectId, tagline);

    data[repo] = {
      stars: raw.stars,
      pushed: raw.pushed,
      archived: raw.archived,
      license: raw.license,
      trend,
      trend7d,
      trend30d,
      trend30dDays,
      trend7dDays,
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

  // Keep the committed database bounded: full weekly resolution for the last
  // six months, monthly beyond that. Nothing renders past the 90-day
  // sparkline window, so this costs no visible history.
  const pruned = db.pruneSnapshotHistory();
  if (pruned > 0) logger.info(`Thinned ${pruned} snapshot row(s) older than 180 days to monthly resolution`);

  return { data, stale, failed, attempted: repos.length };
}

/**
 * Assemble ApiData from the SQLite database only — no GitHub API calls.
 * Uses the latest snapshot per repo + the projects.yaml tagline. Trend values
 * compare each entry's latest snapshot against the snapshots 7 and 30 days
 * before it. Safe to call offline; requires that generate has been run at
 * least once to populate the DB.
 */
export function loadApiDataFromDB(yamlContent: string, dbPath: string = DEFAULT_DB_PATH): ApiData {
  const { repos, taglineByRepo } = readRepoEntries(yamlContent);

  const db = new DB(dbPath);
  try {
    db.migrate();

    // The newest measurement in the DB is the last run's fetch date; an entry
    // whose own latest snapshot is older failed to refresh on that run.
    const runDate = db.getMaxSnapshotDate();
    const data: ApiData = {};
    const missing: string[] = [];
    for (const { repo, name } of repos) {
      const projectId = db.upsertProject(repo, name);
      const entry = entryFromLatestSnapshot(db, projectId, taglineByRepo.get(repo), runDate);
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
          `(run generate with fetch to record them): ${missing.join(", ")}`,
      );
    }
    return data;
  } finally {
    db.close();
  }
}
