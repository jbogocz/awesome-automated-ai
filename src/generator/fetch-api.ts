import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { computeQualityScore } from "../scoring/quality.js";
import { backfillBatch } from "./backfill.js";
import type { ApiData } from "./readme.js";

interface RawApiResult {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  topics: string[];
  lastRelease: string | null;
  lastCommit: string | null;
}

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
  console.log(`Fetching data for ${repos.length} repos...`);

  const dbPath = resolve(import.meta.dirname, "../../data/curator.db");
  const db = new DB(dbPath);
  db.migrate();

  // Pass 1: fetch live state and detect which repos lack 30d history.
  const rawByRepo = new Map<string, RawApiResult>();
  const projectIdByRepo = new Map<string, number>();
  const pendingBackfill: { repo: string; projectId: number; currentStars: number }[] = [];

  for (const { repo, name } of repos) {
    const raw = fetchOneRepo(repo);
    const projectId = db.upsertProject(repo, name);
    rawByRepo.set(repo, raw);
    projectIdByRepo.set(repo, projectId);
    if (db.getStarsNDaysAgo(projectId, 30) === null) {
      pendingBackfill.push({ repo, projectId, currentStars: raw.stars });
    }
  }

  if (pendingBackfill.length > 0) {
    console.log(`Backfilling 30d history for ${pendingBackfill.length} new/missing repos...`);
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
    const trend7d = stars7dAgo !== null ? raw.stars - stars7dAgo : null;
    const trend30d = stars30dAgo !== null ? raw.stars - stars30dAgo : null;
    const trend = trend30d ?? (starsPrevious !== null ? raw.stars - starsPrevious : null);

    const score = computeQualityScore({
      stars: raw.stars,
      starsPrevious,
      trend7d,
      trend30d,
      pushedAt: raw.pushed,
      license: raw.license,
      archived: raw.archived,
    });
    db.insertSnapshot(projectId, raw.stars, score);

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
      score,
      topics: raw.topics,
      tagline,
    };
  }

  db.close();
  return data;
}

function fetchOneRepo(repo: string): RawApiResult {
  try {
    const result = execFileSync(
      "gh",
      [
        "api",
        `repos/${repo}`,
        "--jq",
        "{stars: .stargazers_count, pushed: .pushed_at, archived: .archived, license: .license.spdx_id, topics: .topics}",
      ],
      { timeout: 15_000, encoding: "utf-8" },
    );
    const parsed = JSON.parse(result);
    const { lastRelease, lastCommit } = fetchReleaseAndCommit(repo);
    const activityDates = [lastRelease, lastCommit, parsed.pushed].filter(
      (d): d is string => typeof d === "string" && d.length > 0,
    );
    // ISO-8601 sorts lexicographically, so max string = newest timestamp.
    const pushed = activityDates.length > 0 ? activityDates.reduce((a, b) => (a > b ? a : b)) : "";
    return {
      stars: parsed.stars ?? 0,
      pushed,
      archived: parsed.archived ?? false,
      license: parsed.license ?? null,
      topics: parsed.topics ?? [],
      lastRelease,
      lastCommit,
    };
  } catch {
    return {
      stars: 0,
      pushed: "",
      archived: false,
      license: null,
      topics: [],
      lastRelease: null,
      lastCommit: null,
    };
  }
}

function fetchReleaseAndCommit(repo: string): { lastRelease: string | null; lastCommit: string | null } {
  let lastRelease: string | null = null;
  try {
    const out = execFileSync("gh", ["api", `repos/${repo}/releases/latest`, "--jq", ".published_at"], {
      timeout: 10_000,
      encoding: "utf-8",
    }).trim();
    if (out) lastRelease = out;
  } catch {
    // No releases - leave null
  }
  let lastCommit: string | null = null;
  try {
    const out = execFileSync("gh", ["api", `repos/${repo}/commits?per_page=1`, "--jq", ".[0].commit.committer.date"], {
      timeout: 10_000,
      encoding: "utf-8",
    }).trim();
    if (out) lastCommit = out;
  } catch {
    // Leave null
  }
  return { lastRelease, lastCommit };
}
