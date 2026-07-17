import { PULSE_WINDOW_DAYS } from "../constants.js";
import { isPrereleaseTag } from "../status.js";
import { logger } from "../utils/logger.js";
import { ghGraphQL } from "./stargazers-graphql.js";

// Live repo metadata for the weekly regen, fetched as alias-batched GraphQL:
// one query per CHUNK_SIZE repos instead of several REST calls per repo, so
// request count stays O(N/CHUNK_SIZE) as the list grows.

export interface RepoMetadata {
  stars: number;
  /** Raw pushedAt (any-branch pushes) — used for quality-score recency only,
   * never for health status (see src/status.ts). */
  pushed: string;
  archived: boolean;
  license: string | null;
  topics: string[];
  lastRelease: string | null;
  lastCommit: string | null;
  /** Newest tag's commit/tagger date, prereleases included. */
  lastTag: string | null;
  /** Newest tag whose name is not a prerelease (see isPrereleaseTag). */
  lastStableTag: string | null;
  /** Commits on the default branch in the last PULSE_WINDOW_DAYS days. */
  commits90d: number | null;
  language: string | null;
}

// GraphQL cost is ceil(nodes/100); 15 aliases with 20 topic nodes, 20 tag
// refs and a commit-history count each stays a single-digit point cost per chunk.
const CHUNK_SIZE = 15;
// README/site display at most 5 tags; 20 covers projects.yaml curation needs.
const TOPICS_FIRST = 20;
// Deep enough to find the newest STABLE tag behind a run of prereleases
// (e.g. rc1..rc9 before a stable); latestRelease is the backstop beyond it.
const TAGS_FIRST = 20;

interface TagTarget {
  committedDate?: string | null; // lightweight tag -> Commit
  tagger?: { date?: string | null } | null; // annotated tag -> Tag
  target?: { committedDate?: string | null } | null; // annotated tag's commit
}

interface TagNode {
  name?: string | null;
  target?: TagTarget | null;
}

interface RepoNode {
  stargazerCount?: number | null;
  pushedAt?: string | null;
  isArchived?: boolean | null;
  licenseInfo?: { spdxId?: string | null } | null;
  primaryLanguage?: { name?: string | null } | null;
  repositoryTopics?: { nodes?: ({ topic?: { name?: string | null } | null } | null)[] | null } | null;
  latestRelease?: { publishedAt?: string | null } | null;
  refs?: { nodes?: (TagNode | null)[] | null } | null;
  defaultBranchRef?: {
    target?: { committedDate?: string | null; history?: { totalCount?: number | null } | null } | null;
  } | null;
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

export function buildMetadataQuery(repos: string[], pulseSince?: string): string {
  const since = pulseSince ?? new Date(Date.now() - PULSE_WINDOW_DAYS * 86_400_000).toISOString();
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
    refs(refPrefix: "refs/tags/", first: ${TAGS_FIRST}, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
      nodes { name target { ... on Commit { committedDate } ... on Tag { tagger { date } target { ... on Commit { committedDate } } } } }
    }
    defaultBranchRef { target { ... on Commit { committedDate history(since: "${since}") { totalCount } } } }
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
      // Omit failed repos instead of fabricating zeros — a zeroed entry
      // would be snapshotted into the DB and rendered as a dead project.
      logger.warn(`Failed to fetch repo metadata for ${repo} — skipping`);
      return;
    }

    const lastRelease = node.latestRelease?.publishedAt ?? null;
    const branchTarget = node.defaultBranchRef?.target;
    const lastCommit = branchTarget?.committedDate ?? null;

    // Tags arrive newest-first. lastTag = newest of any kind (life sign);
    // lastStableTag = newest whose name is not a prerelease (shipping).
    let lastTag: string | null = null;
    let lastStableTag: string | null = null;
    for (const tagNode of node.refs?.nodes ?? []) {
      const t = tagNode?.target;
      const date = t?.committedDate ?? t?.tagger?.date ?? t?.target?.committedDate ?? null;
      if (!date) continue;
      if (lastTag === null) lastTag = date;
      if (lastStableTag === null && typeof tagNode?.name === "string" && !isPrereleaseTag(tagNode.name)) {
        lastStableTag = date;
      }
      if (lastTag !== null && lastStableTag !== null) break;
    }

    out.set(repo, {
      stars: node.stargazerCount ?? 0,
      pushed: node.pushedAt ?? "",
      archived: node.isArchived ?? false,
      license: node.licenseInfo?.spdxId ?? null,
      topics: (node.repositoryTopics?.nodes ?? [])
        .map((n) => n?.topic?.name)
        .filter((n): n is string => typeof n === "string"),
      lastRelease,
      lastCommit,
      lastTag,
      lastStableTag,
      commits90d: branchTarget?.history?.totalCount ?? null,
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
    }
  }
  return out;
}
