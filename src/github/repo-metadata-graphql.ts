import { logger } from "../utils/logger.js";
import { ghGraphQL } from "./stargazers-graphql.js";

// Live repo metadata for the weekly regen, fetched as alias-batched GraphQL.
// Replaces three sequential REST calls per repo (repos/{r}, releases/latest,
// commits?per_page=1) with one query per CHUNK_SIZE repos — the same batching
// pattern the stargazer backfill already uses, so the pipeline stays O(N/40)
// requests instead of O(3N) subprocess spawns as the list grows.

export interface RepoMetadata {
  stars: number;
  /** Freshest activity signal: max(pushedAt, lastRelease, lastCommit). */
  pushed: string;
  archived: boolean;
  license: string | null;
  topics: string[];
  lastRelease: string | null;
  lastCommit: string | null;
  language: string | null;
}

export const EMPTY_METADATA: RepoMetadata = {
  stars: 0,
  pushed: "",
  archived: false,
  license: null,
  topics: [],
  lastRelease: null,
  lastCommit: null,
  language: null,
};

// GraphQL cost is ceil(nodes/100); 40 aliases with 20 topic nodes each is
// well under a single-digit point cost per chunk.
const CHUNK_SIZE = 40;
// README/site display at most 5 tags; 20 covers projects.yaml curation needs.
const TOPICS_FIRST = 20;

interface RepoNode {
  stargazerCount?: number | null;
  pushedAt?: string | null;
  isArchived?: boolean | null;
  licenseInfo?: { spdxId?: string | null } | null;
  primaryLanguage?: { name?: string | null } | null;
  repositoryTopics?: { nodes?: ({ topic?: { name?: string | null } | null } | null)[] | null } | null;
  latestRelease?: { publishedAt?: string | null } | null;
  defaultBranchRef?: { target?: { committedDate?: string | null } | null } | null;
}

interface MetadataGraphQLResponse {
  data?: Record<string, RepoNode | null>;
  errors?: { path?: (string | number)[]; message: string; type?: string }[];
}

function aliasFor(i: number): string {
  return `r${i}`;
}

function sanitize(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]/g, "");
}

export function buildMetadataQuery(repos: string[]): string {
  const blocks = repos.map((repo, i) => {
    const [owner = "", name = ""] = repo.split("/");
    return `  ${aliasFor(i)}: repository(owner: "${sanitize(owner)}", name: "${sanitize(name)}") {
    stargazerCount
    pushedAt
    isArchived
    licenseInfo { spdxId }
    primaryLanguage { name }
    repositoryTopics(first: ${TOPICS_FIRST}) { nodes { topic { name } } }
    latestRelease { publishedAt }
    defaultBranchRef { target { ... on Commit { committedDate } } }
  }`;
  });
  return `query {\n${blocks.join("\n")}\n}`;
}

export function parseMetadataResponse(repos: string[], resp: MetadataGraphQLResponse): Map<string, RepoMetadata> {
  const erroredAliases = new Set<string>();
  for (const e of resp.errors ?? []) {
    const alias = e.path?.[0];
    if (typeof alias === "string") erroredAliases.add(alias);
  }

  const out = new Map<string, RepoMetadata>();
  repos.forEach((repo, i) => {
    const alias = aliasFor(i);
    const node = resp.data?.[alias];
    if (!node || erroredAliases.has(alias)) {
      logger.warn(`Failed to fetch repo metadata for ${repo}`);
      out.set(repo, { ...EMPTY_METADATA });
      return;
    }

    const lastRelease = node.latestRelease?.publishedAt ?? null;
    const lastCommit = node.defaultBranchRef?.target?.committedDate ?? null;
    const activityDates = [lastRelease, lastCommit, node.pushedAt].filter(
      (d): d is string => typeof d === "string" && d.length > 0,
    );
    // ISO-8601 sorts lexicographically, so max string = newest timestamp.
    const pushed = activityDates.length > 0 ? activityDates.reduce((a, b) => (a > b ? a : b)) : "";

    out.set(repo, {
      stars: node.stargazerCount ?? 0,
      pushed,
      archived: node.isArchived ?? false,
      license: node.licenseInfo?.spdxId ?? null,
      topics: (node.repositoryTopics?.nodes ?? [])
        .map((n) => n?.topic?.name)
        .filter((n): n is string => typeof n === "string"),
      lastRelease,
      lastCommit,
      language: node.primaryLanguage?.name ?? null,
    });
  });
  return out;
}

export async function fetchRepoMetadataBatch(repos: string[]): Promise<Map<string, RepoMetadata>> {
  const out = new Map<string, RepoMetadata>();
  for (let i = 0; i < repos.length; i += CHUNK_SIZE) {
    const chunk = repos.slice(i, i + CHUNK_SIZE);
    try {
      const resp = await ghGraphQL<MetadataGraphQLResponse>(buildMetadataQuery(chunk));
      for (const [repo, meta] of parseMetadataResponse(chunk, resp)) out.set(repo, meta);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(`Metadata batch ${i}-${i + chunk.length} failed after retries: ${msg}`);
      for (const repo of chunk) out.set(repo, { ...EMPTY_METADATA });
    }
  }
  return out;
}
