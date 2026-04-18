import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { computeQualityScore } from "../scoring/quality.js";
import type { ApiData } from "./readme.js";

interface RawApiResult {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  topics: string[];
}

export function fetchRepoData(yamlContent: string): ApiData {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string; tagline?: string }[] }[];
  };
  const repos: { repo: string; name: string; tagline?: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) repos.push({ repo: entry.repo, name: entry.name ?? entry.repo, tagline: entry.tagline });
    }
  }
  console.log(`Fetching data for ${repos.length} repos...`);

  const dbPath = resolve(import.meta.dirname, "../../data/curator.db");
  const db = new DB(dbPath);
  db.migrate();

  const data: ApiData = {};
  for (const { repo, name, tagline: yamlTagline } of repos) {
    const raw = fetchOneRepo(repo);
    const projectId = db.upsertProject(repo, name);
    const starsPrevious = db.getPreviousStars(projectId);
    const trend = starsPrevious !== null ? raw.stars - starsPrevious : null;
    const score = computeQualityScore({
      stars: raw.stars,
      starsPrevious,
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
    const pushed = fetchLastActivity(repo) || parsed.pushed || "";
    return {
      stars: parsed.stars ?? 0,
      pushed,
      archived: parsed.archived ?? false,
      license: parsed.license ?? null,
      topics: parsed.topics ?? [],
    };
  } catch {
    return { stars: 0, pushed: "", archived: false, license: null, topics: [] };
  }
}

function fetchLastActivity(repo: string): string {
  // Try latest release date first
  try {
    const release = execFileSync("gh", ["api", `repos/${repo}/releases/latest`, "--jq", ".published_at"], {
      timeout: 10_000,
      encoding: "utf-8",
    }).trim();
    if (release) return release;
  } catch {
    // No releases - fall through
  }
  // Fallback: last commit on default branch
  try {
    const commit = execFileSync(
      "gh",
      ["api", `repos/${repo}/commits?per_page=1`, "--jq", ".[0].commit.committer.date"],
      { timeout: 10_000, encoding: "utf-8" },
    ).trim();
    if (commit) return commit;
  } catch {
    // Fall through
  }
  return "";
}
