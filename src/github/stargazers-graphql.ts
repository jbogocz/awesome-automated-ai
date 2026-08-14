import { execFileSync } from "node:child_process";
import { logger } from "../utils/logger.js";
import type { RateLimitInfo, RepoStargazersPage } from "./types.js";

const GH_TIMEOUT_MS = 30_000;

// Transient GitHub failures (502/503/504, dropped connections, DNS hiccups)
// are retried with exponential backoff; non-transient errors (auth, 4xx)
// fail fast.
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 2_000;

// Rate limiting needs a different, longer backoff than a dropped socket:
// GitHub's secondary limits want tens of seconds, not two.
const RATE_LIMIT_BASE_BACKOFF_MS = 30_000;
const RATE_LIMIT_MAX_BACKOFF_MS = 300_000;

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
      const [owner = "", name = ""] = repo.split("/");
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

function errorText(err: unknown): string {
  const errMsg = err instanceof Error ? err.message : String(err);
  const read = (field: unknown): string =>
    typeof field === "string" ? field : Buffer.isBuffer(field) ? field.toString("utf-8") : "";
  return `${errMsg}\n${read((err as { stderr?: unknown })?.stderr)}`;
}

function isTransientGhError(err: unknown): boolean {
  return /HTTP 5\d\d|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|connection reset|i\/o timeout/i.test(errorText(err));
}

/**
 * Primary (403/429 + "rate limit") and secondary ("abuse detection",
 * "secondary rate limit") limits, plus GraphQL's own RATE_LIMITED error type,
 * which arrives with HTTP 200. None of these were retried before, and the
 * GraphQL one was worse than not retried — see recoverJsonBody.
 */
export function isRateLimited(text: string): boolean {
  return /HTTP 40[39]|HTTP 429|rate limit|RATE_LIMITED|abuse detection|secondary rate/i.test(text);
}

/** Seconds to wait from a Retry-After header or an x-ratelimit-reset epoch, if present. */
export function retryAfterMs(text: string, now: number = Date.now()): number | null {
  const after = text.match(/retry-after:\s*(\d+)/i);
  if (after) return Number(after[1]) * 1000;
  const reset = text.match(/x-ratelimit-reset:\s*(\d+)/i);
  if (reset) {
    const waitMs = Number(reset[1]) * 1000 - now;
    if (waitMs > 0) return waitMs;
  }
  return null;
}

/** Shared gh-CLI GraphQL transport: transient-error retry with exponential backoff. */
export async function ghGraphQL<T>(query: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
        timeout: GH_TIMEOUT_MS,
        encoding: "utf-8",
        maxBuffer: 32 * 1024 * 1024,
      });
      const parsed = JSON.parse(out) as T & {
        errors?: { type?: string; message?: string }[];
      };
      // GraphQL reports its own rate limiting inside a 200 response, so gh
      // exits 0 and this looks like a clean result carrying no data.
      const rateLimitedOk = parsed.errors?.some((e) => e.type === "RATE_LIMITED");
      if (rateLimitedOk && attempt < MAX_RETRIES) {
        const delay = Math.min(RATE_LIMIT_BASE_BACKOFF_MS * 2 ** attempt, RATE_LIMIT_MAX_BACKOFF_MS);
        logger.warn(
          `gh graphql attempt ${attempt + 1}/${MAX_RETRIES + 1} returned RATE_LIMITED; retrying in ${Math.round(delay / 1000)}s`,
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return parsed as T;
    } catch (err) {
      // gh exits non-zero whenever the GraphQL response carries an `errors`
      // array (e.g. one NOT_FOUND alias in a batch) but still prints the full
      // JSON body — including partial data — to stdout. Recover that body so
      // callers can do per-alias error handling instead of failing the batch.
      const stdout = (err as { stdout?: unknown })?.stdout;
      const body = typeof stdout === "string" ? stdout : Buffer.isBuffer(stdout) ? stdout.toString("utf-8") : "";
      const text = `${errorText(err)}\n${body}`;
      const limited = isRateLimited(text);

      // A rate-limit body is JSON too, and recovering it as success is worse
      // than failing: every alias in the chunk silently resolves to nothing
      // and the run reports a clean pass over missing data.
      if (!limited && body.trimStart().startsWith("{")) {
        try {
          return JSON.parse(body) as T;
        } catch {
          // Not a JSON body — fall through to retry/throw.
        }
      }
      if (attempt >= MAX_RETRIES || !(limited || isTransientGhError(err))) throw err;
      const delay = limited
        ? Math.min(retryAfterMs(text) ?? RATE_LIMIT_BASE_BACKOFF_MS * 2 ** attempt, RATE_LIMIT_MAX_BACKOFF_MS)
        : BASE_BACKOFF_MS * 2 ** attempt;
      const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
      logger.warn(
        `gh graphql attempt ${attempt + 1}/${MAX_RETRIES + 1} failed` +
          `${limited ? " (rate limited)" : ""} (${msg}); retrying in ${Math.round(delay / 1000)}s`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export async function fetchRecentStargazersBatch(repos: string[], since: Date): Promise<BatchResult> {
  const firstQuery = buildBatchQuery(repos);
  const firstParse = parseBatchResponse(repos, await ghGraphQL<GraphQLResponse>(firstQuery));
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
    chunk.forEach((c, i) => {
      cursorByAlias[aliasFor(i)] = c.cursor;
    });
    const q = buildBatchQuery(chunkRepos, cursorByAlias);
    const parsed = parseBatchResponse(chunkRepos, await ghGraphQL<GraphQLResponse>(q));
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
        const oldest = newPage.stargazers.at(-1);
        if (oldest && new Date(oldest.starredAt) >= since) {
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
