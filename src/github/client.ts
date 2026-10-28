import { logger } from "../utils/logger.ts";

/**
 * The one GitHub transport: GraphQL and REST over Node's fetch, with the
 * retry and rate-limit policy in one place.
 *
 * This replaced three: `gh api graphql` spawned per query through a blocking
 * execFileSync, @octokit/rest for discovery and PRs, and bare fetch. Talking
 * HTTP directly also retires the stdout scraping gh forced on us — gh exits
 * non-zero whenever a GraphQL response carries `errors` (one NOT_FOUND alias
 * in a batch) and the partial data had to be recovered from the exception.
 * Here a 200 is a 200, errors array or not.
 */

const API = "https://api.github.com";
const TIMEOUT_MS = 30_000;

// Transient failures (5xx, dropped connections, DNS hiccups, timeouts) are
// retried with exponential backoff; credentials and other 4xx fail fast.
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 2_000;

// Rate limiting needs a different, longer backoff than a dropped socket:
// GitHub's secondary limits want tens of seconds, not two.
const RATE_LIMIT_BASE_BACKOFF_MS = 30_000;
const RATE_LIMIT_MAX_BACKOFF_MS = 300_000;

/** Process boundary, injectable so the retry policy is testable offline. */
export interface GitHubDeps {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
  sleep: (ms: number) => Promise<void>;
  token: () => string;
}

/** GH_TOKEN first, as the workflows and the gh CLI name it. */
export function githubToken(): string {
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GH_TOKEN (or GITHUB_TOKEN) is not set. Locally: GH_TOKEN=$(gh auth token) pnpm run <script>");
  }
  return token;
}

const defaultDeps: GitHubDeps = {
  fetch: (url, init) => fetch(url, init),
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  token: githubToken,
};

export class GitHubError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
  }
}

/**
 * Primary and secondary rate limits. A bare 403 is deliberately not enough:
 * GitHub also answers 403 for a revoked token, a missing scope or an
 * SSO-blocked org, and treating those as rate limits burned the whole retry
 * budget at 30s-300s a step without ever saying the token was the problem.
 */
export function isRateLimited(status: number, headers: Headers, body: string): boolean {
  if (status === 429) return true;
  if (status !== 403) return false;
  return headers.get("x-ratelimit-remaining") === "0" || /rate limit|abuse detection/i.test(body);
}

/** Milliseconds to wait from Retry-After or an x-ratelimit-reset epoch, if either is present. */
export function retryAfterMs(headers: Headers, now: number = Date.now()): number | null {
  const after = headers.get("retry-after");
  if (after !== null && /^\d+$/.test(after)) return Number(after) * 1000;
  const reset = headers.get("x-ratelimit-reset");
  if (reset !== null) {
    const waitMs = Number(reset) * 1000 - now;
    if (waitMs > 0) return waitMs;
  }
  return null;
}

/** GraphQL reports its own rate limiting inside an HTTP 200. */
function graphqlRateLimited(data: unknown): boolean {
  const errors = (data as { errors?: { type?: string }[] } | null)?.errors;
  return Array.isArray(errors) && errors.some((e) => e.type === "RATE_LIMITED");
}

function rateLimitDelay(attempt: number, headers?: Headers): number {
  const hinted = headers ? retryAfterMs(headers) : null;
  return Math.min(hinted ?? RATE_LIMIT_BASE_BACKOFF_MS * 2 ** attempt, RATE_LIMIT_MAX_BACKOFF_MS);
}

export interface GitHubResponse<T> {
  data: T;
  headers: Headers;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
}

/** One API call under the shared retry policy. `path` is relative to api.github.com or a full API URL. */
export async function request<T>(
  path: string,
  opts: RequestOptions = {},
  deps: GitHubDeps = defaultDeps,
): Promise<GitHubResponse<T>> {
  const method = opts.method ?? "GET";
  // The token rides on every request, so a full URL must still be GitHub's
  // API: pagination links are, and nothing else may receive it.
  if (path.startsWith("https://") && !path.startsWith(`${API}/`)) {
    throw new Error(`Refusing to send the GitHub token outside ${API}: ${path}`);
  }
  const url = path.startsWith("https://") ? path : `${API}${path}`;
  const label = `${method} ${path.startsWith(API) ? path.slice(API.length) : path}`;

  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await deps.fetch(url, {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${deps.token()}`,
          "User-Agent": "awesome-automated-ai",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(opts.body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      // No answer at all: dropped connection, DNS failure or timeout.
      if (attempt >= MAX_RETRIES) throw err;
      const delay = BASE_BACKOFF_MS * 2 ** attempt;
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(
        `GitHub ${label} attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (${msg}); retrying in ${delay / 1000}s`,
      );
      await deps.sleep(delay);
      continue;
    }

    const text = await res.text();
    if (res.ok) {
      const data = (text === "" ? null : JSON.parse(text)) as T;
      if (graphqlRateLimited(data) && attempt < MAX_RETRIES) {
        const delay = rateLimitDelay(attempt);
        logger.warn(`GitHub ${label} returned RATE_LIMITED; retrying in ${Math.round(delay / 1000)}s`);
        await deps.sleep(delay);
        continue;
      }
      return { data, headers: res.headers };
    }

    const limited = isRateLimited(res.status, res.headers, text);
    const transient = res.status >= 500;
    if (!(limited || transient) || attempt >= MAX_RETRIES) {
      if ((res.status === 401 || res.status === 403) && !limited) {
        throw new GitHubError(
          `GitHub refused ${label} (HTTP ${res.status}, not rate limiting) - check that the token is valid and ` +
            "can read what was asked; not retrying",
          res.status,
        );
      }
      throw new GitHubError(`GitHub ${label} failed: HTTP ${res.status} ${text.slice(0, 200)}`, res.status);
    }

    const delay = limited ? rateLimitDelay(attempt, res.headers) : BASE_BACKOFF_MS * 2 ** attempt;
    logger.warn(
      `GitHub ${label} attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (HTTP ${res.status}` +
        `${limited ? ", rate limited" : ""}); retrying in ${Math.round(delay / 1000)}s`,
    );
    await deps.sleep(delay);
  }
}

/** A GraphQL query. Partial results (an `errors` array next to `data`) come back as-is for per-alias handling. */
export async function graphql<T>(query: string, deps: GitHubDeps = defaultDeps): Promise<T> {
  return (await request<T>("/graphql", { method: "POST", body: { query } }, deps)).data;
}
