import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { fetchRepoMetadataBatch } from "../github/repo-metadata-graphql.js";
import { computeQualityScore } from "../scoring/quality.js";
import { computeTrends } from "../scoring/trends.js";
import { logger } from "../utils/logger.js";
import { backfillBatch } from "./backfill.js";
import type { ApiData } from "./readme.js";

export async function fetchRepoData(yamlContent: string): Promise<ApiData> {
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
  db.migrate();

  // Pass 1: fetch live state (alias-batched GraphQL, ~40 repos per request)
  // and detect which repos lack 30d history.
  const rawByRepo = await fetchRepoMetadataBatch(repos.map((r) => r.repo));
  const projectIdByRepo = new Map<string, number>();
  const pendingBackfill: { repo: string; projectId: number; currentStars: number }[] = [];

  for (const { repo, name } of repos) {
    const projectId = db.upsertProject(repo, name);
    projectIdByRepo.set(repo, projectId);
    if (db.getStarsNDaysAgo(projectId, 30) === null) {
      pendingBackfill.push({ repo, projectId, currentStars: rawByRepo.get(repo)?.stars ?? 0 });
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
  for (const { repo, tagline: yamlTagline } of repos) {
    const raw = rawByRepo.get(repo);
    const projectId = projectIdByRepo.get(repo);
    if (!raw || projectId === undefined) continue;

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
      pushedAt: raw.pushed,
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
      commits90d: raw.commits90d,
    });
    db.updateProjectMetadata(projectId, {
      stars: raw.stars,
      archived: raw.archived,
      lastCommit: raw.lastCommit,
      language: raw.language,
    });

    // Tagline: DB first, seed from YAML if DB empty
    let tagline = db.getTagline(projectId);
    if (!tagline && yamlTagline) {
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
      commits90d: raw.commits90d,
      score,
      topics: raw.topics,
      tagline,
    };
  }

  db.close();
  return data;
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
  db.migrate();

  const data: ApiData = {};
  const missing: string[] = [];
  for (const { repo, name, tagline: yamlTagline } of repos) {
    const projectId = db.upsertProject(repo, name);
    const latest = db.getLatestSnapshot(projectId);
    if (!latest) {
      // No snapshot yet (added to projects.yaml after the last generate run).
      // Skipping keeps the entry out of ApiData so consumers render it as
      // "no data yet" instead of fabricating zero stars / a red dot.
      missing.push(repo);
      continue;
    }

    const stars7dAgo = db.getStarsNDaysAgo(projectId, 7);
    const stars30dAgo = db.getStarsNDaysAgo(projectId, 30);
    const starsPrevious = db.getPreviousStars(projectId);
    const { trend, trend7d, trend30d } = computeTrends({
      currentStars: latest.stars,
      stars7dAgo,
      stars30dAgo,
      starsPrevious,
    });

    const tagline = db.getTagline(projectId) ?? yamlTagline ?? null;

    data[repo] = {
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
      commits90d: latest.commits90d,
      score: latest.compositeScore ?? 0,
      topics: latest.topics ?? [],
      tagline,
    };
  }
  if (missing.length > 0) {
    logger.warn(
      `${missing.length} repo(s) have no snapshot yet and will render without stats ` +
        `(run generate with fetch to backfill): ${missing.join(", ")}`,
    );
  }
  db.close();
  return data;
}
