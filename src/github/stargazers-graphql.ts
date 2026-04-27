import { execFileSync } from "node:child_process";
import { logger } from "../utils/logger.js";
import type { RateLimitInfo, RepoStargazersPage } from "./types.js";

const GH_TIMEOUT_MS = 30_000;

// Transient GitHub failures (502/503/504, dropped connections, DNS hiccups) used to
// kill the whole weekly regen — see commit history. Retry with exponential backoff
// to ride them out; non-transient errors (auth, 4xx) still fail fast.
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 2_000;

// GraphQL cost is ceil(sum(connection first/last args) / 100). Base query with N aliases
// shares one `first: 100` denominator each; continuations bill per-alias. Keeping
// continuation chunks small (5) prevents multi-point follow-up queries.
const CONTINUATION_CHUNK_SIZE = 5;

interface EdgeResponse {
  starredAt: string;
}
interface RepoResponse {
  stargazerCount: number;
  stargazers: {
    edges: EdgeResponse[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}
interface GraphQLResponse {
  data?: Record<string, RepoResponse | RateLimitInfo | null>;
  errors?: { path?: (string | number)[]; message: string; type?: string }[];
}

export interface BatchResult {
  pages: Map<string, RepoStargazersPage>;
  rateLimit: RateLimitInfo;
  pointsUsed: number;
}

function aliasFor(i: number): string {
  return `r${i}`;
}

function sanitize(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]/g, "");
}

export function buildBatchQuery(repos: string[], cursorByAlias: Record<string, string | null> = {}): string {
  const repoBlocks = repos
    .map((repo, i) => {
      const [owner, name] = repo.split("/");
      const alias = aliasFor(i);
      const cursor = cursorByAlias[alias];
      const afterArg = cursor ? `, after: "${cursor}"` : "";
      return `  ${alias}: repository(owner: "${sanitize(owner)}", name: "${sanitize(name)}") {
    stargazerCount
    stargazers(first: 100, orderBy: {field: STARRED_AT, direction: DESC}${afterArg}) {
      edges { starredAt }
      pageInfo { hasNextPage endCursor }
    }
  }`;
    })
    .join("\n");
  return `query {
${repoBlocks}
  rateLimit { remaining resetAt cost }
}`;
}

function categorizeGraphQLError(err: { type?: string; message: string }): string {
  const type = err.type?.toUpperCase() ?? "";
  if (type === "NOT_FOUND") return "not_found";
  if (type === "FORBIDDEN") return "forbidden";
  if (/not resolve/i.test(err.message)) return "not_found";
  return "graphql_error";
}

export function parseBatchResponse(repos: string[], resp: GraphQLResponse): BatchResult {
  const pages = new Map<string, RepoStargazersPage>();
  const errorsByAlias = new Map<string, string>();

  if (resp.errors) {
    for (const e of resp.errors) {
      const alias = e.path?.[0];
      if (typeof alias === "string" && alias.startsWith("r")) {
        errorsByAlias.set(alias, categorizeGraphQLError(e));
      }
    }
  }

  repos.forEach((repo, i) => {
    const alias = aliasFor(i);
    const entry = resp.data?.[alias] as RepoResponse | null | undefined;
    const aliasError = errorsByAlias.get(alias);
    if (aliasError || !entry) {
      pages.set(repo, {
        stargazers: [],
        totalCount: 0,
        hasNextPage: false,
        endCursor: null,
        error: aliasError ?? "graphql_error",
      });
      return;
    }
    pages.set(repo, {
      stargazers: entry.stargazers.edges.map((e) => ({ starredAt: e.starredAt })),
      totalCount: entry.stargazerCount,
      hasNextPage: entry.stargazers.pageInfo.hasNextPage,
      endCursor: entry.stargazers.pageInfo.endCursor,
    });
  });

  const rl = (resp.data?.rateLimit as RateLimitInfo | undefined) ?? {
    remaining: 0,
    resetAt: new Date().toISOString(),
    cost: 0,
  };

  return { pages, rateLimit: rl, pointsUsed: rl.cost };
}

function isTransientGhError(err: unknown): boolean {
  const errMsg = err instanceof Error ? err.message : String(err);
  const stderrField = (err as { stderr?: unknown })?.stderr;
  const stderr =
    typeof stderrField === "string" ? stderrField : Buffer.isBuffer(stderrField) ? stderrField.toString("utf-8") : "";
  const haystack = `${errMsg}\n${stderr}`;
  return /HTTP 5\d\d|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|connection reset|i\/o timeout/i.test(haystack);
}

async function ghGraphQL(query: string): Promise<GraphQLResponse> {
  for (let attempt = 0; ; attempt++) {
    try {
      const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
        timeout: GH_TIMEOUT_MS,
        encoding: "utf-8",
        maxBuffer: 32 * 1024 * 1024,
      });
      return JSON.parse(out) as GraphQLResponse;
    } catch (err) {
      if (attempt >= MAX_RETRIES || !isTransientGhError(err)) throw err;
      const delay = BASE_BACKOFF_MS * 2 ** attempt;
      const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
      logger.warn(`gh graphql attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (${msg}); retrying in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export async function fetchRecentStargazersBatch(repos: string[], since: Date): Promise<BatchResult> {
  const firstQuery = buildBatchQuery(repos);
  const firstParse = parseBatchResponse(repos, await ghGraphQL(firstQuery));
  let totalPoints = firstParse.pointsUsed;
  let lastRl = firstParse.rateLimit;

  const needMore: { repo: string; cursor: string }[] = [];
  for (const repo of repos) {
    const page = firstParse.pages.get(repo);
    if (!page || page.error || !page.hasNextPage) continue;
    const oldest = page.stargazers[page.stargazers.length - 1];
    if (!oldest) continue;
    if (new Date(oldest.starredAt) >= since && page.endCursor) {
      needMore.push({ repo, cursor: page.endCursor });
    }
  }

  const pool = [...needMore];
  while (pool.length > 0) {
    const chunk = pool.splice(0, CONTINUATION_CHUNK_SIZE);
    const cursorByAlias: Record<string, string | null> = {};
    const chunkRepos = chunk.map((c) => c.repo);
    chunkRepos.forEach((_, i) => {
      cursorByAlias[aliasFor(i)] = chunk[i].cursor;
    });
    const q = buildBatchQuery(chunkRepos, cursorByAlias);
    const parsed = parseBatchResponse(chunkRepos, await ghGraphQL(q));
    totalPoints += parsed.pointsUsed;
    lastRl = parsed.rateLimit;

    for (const repo of chunkRepos) {
      const newPage = parsed.pages.get(repo);
      const existing = firstParse.pages.get(repo);
      if (!newPage || !existing) continue;
      existing.stargazers.push(...newPage.stargazers);
      existing.hasNextPage = newPage.hasNextPage;
      existing.endCursor = newPage.endCursor;
      if (newPage.error && !existing.error) existing.error = newPage.error;

      if (newPage.hasNextPage && newPage.endCursor && newPage.stargazers.length > 0) {
        const oldest = newPage.stargazers[newPage.stargazers.length - 1];
        if (new Date(oldest.starredAt) >= since) {
          pool.push({ repo, cursor: newPage.endCursor });
        }
      }
    }
  }

  for (const page of firstParse.pages.values()) {
    page.stargazers = page.stargazers.filter((s) => new Date(s.starredAt) >= since);
  }

  return { pages: firstParse.pages, rateLimit: lastRl, pointsUsed: totalPoints };
}
