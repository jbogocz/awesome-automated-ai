import { logger } from "../utils/logger.ts";
import { GitHubError, request } from "./client.ts";

export interface GitHubCandidate {
  repo: string;
  name: string;
  description: string;
  stars: number;
  pushedAt: string;
  language: string | null;
  archived: boolean;
  license: string | null;
  topics: string[];
  readme: string;
  source: "github";
}

interface SearchOptions {
  topics: string[];
  minStars: number;
  maxResults?: number;
  /** Repositories discovery has already settled. They must not spend `maxResults`. */
  isKnown: (repo: string) => boolean;
}

// The search API's page limit. Results are sorted by stars and the top of each
// topic is mostly already listed, so a page sized to the remaining budget can
// hold nothing new.
const SEARCH_PAGE_SIZE = 100;

const SEARCH_TOPICS = [
  "automl",
  "automated-machine-learning",
  "neural-architecture-search",
  "hyperparameter-optimization",
  "llm-fine-tuning",
  "prompt-optimization",
  "ml-agents",
  "ai-agents",
  "model-compression",
  "feature-engineering",
  "llm-evaluation",
  "mlops",
];

export function getDefaultTopics(): string[] {
  return SEARCH_TOPICS;
}

interface SearchItem {
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string | null;
  language: string | null;
  archived?: boolean;
  license: { spdx_id?: string | null } | null;
  topics?: string[];
}

export async function searchGitHub(opts: SearchOptions): Promise<GitHubCandidate[]> {
  const maxResults = opts.maxResults ?? 50;
  const candidates: GitHubCandidate[] = [];
  const seen = new Set<string>();

  for (const topic of opts.topics) {
    if (candidates.length >= maxResults) break;

    const q = `topic:${topic} stars:>=${opts.minStars} pushed:>${thirtyDaysAgo()}`;
    const params = new URLSearchParams({
      q,
      sort: "stars",
      order: "desc",
      per_page: String(SEARCH_PAGE_SIZE),
    });
    const { data } = await request<{ items: SearchItem[] }>(`/search/repositories?${params}`);

    for (const item of data.items) {
      if (candidates.length >= maxResults) break;
      if (seen.has(item.full_name)) continue;
      if (item.stargazers_count < opts.minStars) continue;
      if (opts.isKnown(item.full_name)) continue;
      seen.add(item.full_name);

      let readme: string;
      try {
        readme = await fetchReadme(item.full_name);
      } catch (err) {
        // Left out for this run only: no verdict is recorded, so the next run
        // sees it again. One takedown must not end the search for the others.
        logger.warn(`Skipping ${item.full_name}: ${err instanceof Error ? err.message : String(err)}`);
        continue;
      }

      candidates.push({
        repo: item.full_name,
        name: item.name,
        description: item.description ?? "",
        stars: item.stargazers_count,
        pushedAt: item.pushed_at ?? "",
        language: item.language,
        archived: item.archived ?? false,
        license: item.license?.spdx_id ?? null,
        topics: item.topics ?? [],
        readme,
        source: "github",
      });
    }
  }
  return candidates;
}

async function fetchReadme(repo: string): Promise<string> {
  try {
    const { data } = await request<{ content?: string }>(`/repos/${repo}/readme`);
    return typeof data.content === "string" ? Buffer.from(data.content, "base64").toString("utf-8").slice(0, 5000) : "";
  } catch (err) {
    // Only "this repository has no README" is an empty README. Any other
    // failure would otherwise score the candidate as README-less and the
    // verdict recorded for it is final.
    if (err instanceof GitHubError && err.status === 404) return "";
    throw err;
  }
}

function thirtyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

/** Undefined when the read failed, which scoring treats as neutral. A failure is not a measured zero. */
export interface RepoSignals {
  commitCount30d: number | undefined;
  contributorCount: number | undefined;
}

export async function fetchRepoSignals(repo: string): Promise<RepoSignals> {
  const since = thirtyDaysAgo();
  const [commitCount30d, contributorCount] = await Promise.all([
    fetchCommitCount(repo, since),
    fetchContributorCount(repo),
  ]);
  return { commitCount30d, contributorCount };
}

async function fetchCommitCount(repo: string, since: string): Promise<number | undefined> {
  try {
    const { data } = await request<unknown[]>(`/repos/${repo}/commits?since=${since}&per_page=100`);
    return data.length;
  } catch (err) {
    logger.warn(`Commit count for ${repo} unknown: ${err instanceof Error ? err.message : String(err)}`);
    return undefined;
  }
}

async function fetchContributorCount(repo: string): Promise<number | undefined> {
  try {
    const { data, headers } = await request<unknown[]>(`/repos/${repo}/contributors?per_page=1`);
    const match = headers.get("link")?.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    return match ? Number(match[1]) : data.length;
  } catch (err) {
    logger.warn(`Contributor count for ${repo} unknown: ${err instanceof Error ? err.message : String(err)}`);
    return undefined;
  }
}
