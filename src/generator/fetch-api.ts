import { parse as parseYaml } from "yaml";
import { fetchRepoMetadataBatch } from "../github/repo-metadata-graphql.ts";
import { computeQualityScore } from "../scoring/quality.ts";
import { computeTrends } from "../scoring/trends.ts";
import { lastLifeSign } from "../status.ts";
import { findLatest, type LatestRepo, type LatestState, latestDate, loadLatest, saveLatest } from "../store/latest.ts";
import { type DataPaths, defaultDataPaths } from "../store/paths.ts";
import {
  loadSnapshots,
  mergeSnapshots,
  previousStars,
  type StarPoint,
  type StarSnapshot,
  seriesById,
  seriesSince,
  starsNDaysAgo,
  todayUtc,
  writeSnapshots,
} from "../store/snapshots.ts";
import { logger } from "../utils/logger.ts";
import type { ApiData, ApiRepoData } from "./readme.ts";

/**
 * Build an ApiData entry from a repo's last live measurement. Shared by the
 * offline path and the live path's fallback for repos whose fetch failed.
 *
 * `runDate` is the date of the current run's fetch. A measurement older than
 * that failed to refresh, so the entry carries `stale` with the date its
 * figures were actually measured.
 */
function entryFromLatest(
  latest: LatestRepo,
  series: StarPoint[],
  repoTagline: string | undefined,
  runDate: string | null,
): ApiRepoData {
  // Trend windows look back from the measurement's own date. Measured from
  // today, a week-old fallback compared its count with itself and published
  // "+0 last 7d" under a window label it did not span.
  const asOf = latest.date;
  const { trend, trend7d, trend30d, trend30dDays, trend7dDays } = computeTrends({
    currentStars: latest.stars,
    stars7dAgo: starsNDaysAgo(series, 7, asOf),
    stars30dAgo: starsNDaysAgo(series, 30, asOf),
    starsPrevious: previousStars(series, asOf),
    today: new Date(`${asOf}T00:00:00Z`),
  });

  return {
    stars: latest.stars,
    pushed: latest.pushed,
    archived: latest.archived,
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
    score: latest.score,
    topics: latest.topics,
    // projects.yaml only, so deleting a tagline there removes it here.
    tagline: repoTagline ?? null,
    history: seriesSince(series, SPARKLINE_DAYS),
    ...(runDate && latest.date < runDate ? { stale: latest.date } : {}),
  };
}

/** Window the dashboard sparkline plots, in days. */
const SPARKLINE_DAYS = 90;

export interface FetchResult {
  data: ApiData;
  /** Repos whose live fetch failed but had a last measurement to fall back on. */
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

/**
 * Repo-backed entries of projects.yaml, plus one tagline per repo. Stats are
 * per repo, so a repo cross-listed under two entries takes the first tagline
 * any of them declares, rather than one that flips with YAML order.
 */
function readRepoEntries(yamlContent: string): { repos: { repo: string }[]; taglineByRepo: Map<string, string> } {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; tagline?: string }[] }[];
  };
  const repos: { repo: string }[] = [];
  const taglineByRepo = new Map<string, string>();
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (!entry.repo) continue;
      repos.push({ repo: entry.repo });
      if (entry.tagline && !taglineByRepo.has(entry.repo)) taglineByRepo.set(entry.repo, entry.tagline);
    }
  }
  return { repos, taglineByRepo };
}

export async function fetchRepoData(yamlContent: string, paths: DataPaths = defaultDataPaths()): Promise<FetchResult> {
  const { repos, taglineByRepo } = readRepoEntries(yamlContent);
  logger.info(`Fetching data for ${repos.length} repos...`);
  const rawByRepo = await fetchRepoMetadataBatch(repos.map((r) => r.repo));

  const previous = loadLatest(paths.latestPath);
  const runDate = todayUtc();

  // Today's measurements go into the history first, so each series below
  // already ends at today's point. Keyed by GitHub id, so a renamed entry
  // continues its own history instead of starting from nothing.
  const measured: StarSnapshot[] = [];
  for (const { repo } of repos) {
    const raw = rawByRepo.get(repo);
    if (raw?.githubId != null && !measured.some((m) => m.id === raw.githubId)) {
      measured.push({ date: runDate, id: raw.githubId, repo, stars: raw.stars });
    }
  }
  const history = mergeSnapshots(loadSnapshots(paths.snapshotsDir), measured);
  const seriesByRepoId = seriesById(history);

  const data: ApiData = {};
  const latest: LatestState = {};
  const stale: string[] = [];
  const failed: string[] = [];
  for (const { repo } of repos) {
    const raw = rawByRepo.get(repo);
    if (!raw || raw.githubId == null) {
      // Fetch failed: serve the last measurement when there is one,
      // otherwise leave the entry out so it renders as "stats pending".
      const fallback = findLatest(previous, repo);
      if (fallback) {
        latest[repo] = fallback;
        data[repo] = entryFromLatest(fallback, seriesByRepoId.get(fallback.id) ?? [], taglineByRepo.get(repo), runDate);
        stale.push(repo);
      } else {
        failed.push(repo);
      }
      continue;
    }

    const series = seriesByRepoId.get(raw.githubId) ?? [];
    const starsPrevious = previousStars(series);
    const { trend, trend7d, trend30d, trend30dDays, trend7dDays } = computeTrends({
      currentStars: raw.stars,
      stars7dAgo: starsNDaysAgo(series, 7),
      stars30dAgo: starsNDaysAgo(series, 30),
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

    latest[repo] = {
      date: runDate,
      id: raw.githubId,
      stars: raw.stars,
      score,
      archived: raw.archived,
      pushed: raw.pushed,
      license: raw.license,
      topics: raw.topics,
      lastRelease: raw.lastRelease,
      lastCommit: raw.lastCommit,
      lastTag: raw.lastTag,
      lastStableTag: raw.lastStableTag,
      commits90d: raw.commits90d,
    };
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
      tagline: taglineByRepo.get(repo) ?? null,
      history: seriesSince(series, SPARKLINE_DAYS),
    };
  }
  if (stale.length > 0) {
    logger.warn(`${stale.length} repo(s) failed to fetch; serving their last measurement: ${stale.join(", ")}`);
  }
  if (failed.length > 0) {
    logger.warn(`${failed.length} repo(s) failed to fetch with no measurement to fall back on: ${failed.join(", ")}`);
  }

  writeSnapshots(paths.snapshotsDir, history, [runDate.slice(0, 4)]);
  saveLatest(paths.latestPath, latest);
  return { data, stale, failed, attempted: repos.length };
}

/**
 * Assemble ApiData from the committed data only — no GitHub API calls. Trend
 * values compare each entry's last measurement against the measurements 7
 * and 30 days before it.
 */
export function loadApiData(yamlContent: string, paths: DataPaths = defaultDataPaths()): ApiData {
  const { repos, taglineByRepo } = readRepoEntries(yamlContent);
  const state = loadLatest(paths.latestPath);
  const seriesByRepoId = seriesById(loadSnapshots(paths.snapshotsDir));

  // The newest measurement is the last run's fetch date; an entry whose own
  // measurement is older failed to refresh on that run.
  const runDate = latestDate(state);
  const data: ApiData = {};
  const missing: string[] = [];
  for (const { repo } of repos) {
    const latest = findLatest(state, repo);
    if (!latest) {
      // Never measured — the entry renders as "stats pending".
      missing.push(repo);
      continue;
    }
    data[repo] = entryFromLatest(latest, seriesByRepoId.get(latest.id) ?? [], taglineByRepo.get(repo), runDate);
  }
  if (missing.length > 0) {
    logger.warn(
      `${missing.length} repo(s) have no measurement yet and will render without stats ` +
        `(run generate with fetch to record them): ${missing.join(", ")}`,
    );
  }
  return data;
}
