import { Octokit } from "@octokit/rest";

export interface GitHubCandidate {
  repo: string;
  name: string;
  description: string;
  stars: number;
  pushedAt: string;
  language: string | null;
  archived: boolean;
  license: string | null;
  readme: string;
  source: "github";
}

interface SearchOptions {
  token: string;
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

export async function searchGitHub(opts: SearchOptions): Promise<GitHubCandidate[]> {
  const octokit = new Octokit({ auth: opts.token });
  const maxResults = opts.maxResults ?? 50;
  const candidates: GitHubCandidate[] = [];
  const seen = new Set<string>();

  for (const topic of opts.topics) {
    if (candidates.length >= maxResults) break;

    const q = `topic:${topic} stars:>=${opts.minStars} pushed:>${thirtyDaysAgo()}`;
    const { data } = await octokit.search.repos({
      q,
      sort: "stars",
      order: "desc",
      per_page: Math.min(30, maxResults - candidates.length),
    });

    for (const item of data.items) {
      if (seen.has(item.full_name)) continue;
      if (item.stargazers_count < opts.minStars) continue;
      seen.add(item.full_name);

      const readme = await fetchReadme(octokit, item.full_name);

      candidates.push({
        repo: item.full_name,
        name: item.name,
        description: item.description ?? "",
        stars: item.stargazers_count,
        pushedAt: item.pushed_at ?? "",
        language: item.language,
        archived: item.archived ?? false,
        license: item.license?.spdx_id ?? null,
        readme,
        source: "github",
      });
    }
  }
  return candidates;
}

async function fetchReadme(octokit: Octokit, repo: string): Promise<string> {
  try {
    const [owner, name] = repo.split("/");
    const { data } = await octokit.repos.getContent({ owner, repo: name, path: "README.md" });
    if ("content" in data && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf-8").slice(0, 5000);
    }
    return "";
  } catch {
    return "";
  }
}

function thirtyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split("T")[0];
}
