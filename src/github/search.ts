import { request } from "./client.ts";

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
}

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
      per_page: String(Math.min(30, maxResults - candidates.length)),
    });
    const { data } = await request<{ items: SearchItem[] }>(`/search/repositories?${params}`);

    for (const item of data.items) {
      if (seen.has(item.full_name)) continue;
      if (item.stargazers_count < opts.minStars) continue;
      seen.add(item.full_name);

      const readme = await fetchReadme(item.full_name);

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
    const { data } = await request<{ content?: string }>(`/repos/${repo}/contents/README.md`);
    return typeof data.content === "string" ? Buffer.from(data.content, "base64").toString("utf-8").slice(0, 5000) : "";
  } catch {
    return "";
  }
}

function thirtyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

export interface RepoSignals {
  commitCount30d: number;
  contributorCount: number;
}

export async function fetchRepoSignals(repo: string): Promise<RepoSignals> {
  const since = thirtyDaysAgo();
  const [commitCount30d, contributorCount] = await Promise.all([
    fetchCommitCount(repo, since),
    fetchContributorCount(repo),
  ]);
  return { commitCount30d, contributorCount };
}

async function fetchCommitCount(repo: string, since: string): Promise<number> {
  try {
    const { data } = await request<unknown[]>(`/repos/${repo}/commits?since=${since}&per_page=100`);
    return data.length;
  } catch {
    return 0;
  }
}

async function fetchContributorCount(repo: string): Promise<number> {
  try {
    const { data, headers } = await request<unknown[]>(`/repos/${repo}/contributors?per_page=1`);
    const match = headers.get("link")?.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    return match ? Number(match[1]) : data.length;
  } catch {
    return 0;
  }
}
