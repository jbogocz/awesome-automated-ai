import { execFileSync } from "node:child_process";
import { logger } from "../utils/logger.js";

/**
 * Shared `gh api graphql` transport.
 *
 * Extracted from the former stargazers-graphql module when stargazer history
 * reconstruction was retired (see src/github/repo-metadata-graphql.ts). The
 * retry and rate-limit handling is transport-level and has nothing to do with
 * which query is being sent, so it outlived the one caller it was written for.
 */

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
 * Primary ("rate limit", or an exhausted x-ratelimit-remaining) and secondary
 * ("abuse detection", "secondary rate limit") limits, HTTP 429, plus
 * GraphQL's own RATE_LIMITED error type, which arrives with HTTP 200.
 *
 * A bare 403 is deliberately not enough: GitHub also answers 403 for a
 * revoked token, a missing scope or an SSO-blocked org, and treating those as
 * rate limits burned the whole retry budget at 30s-300s a step until the job
 * timed out, without ever saying the token was the problem.
 */
export function isRateLimited(text: string): boolean {
  return /HTTP 429|rate limit|RATE_LIMITED|abuse detection|secondary rate|x-ratelimit-remaining:\s*0\b/i.test(text);
}

/** 401/403 that is not rate limiting: retrying cannot fix credentials. */
function isAuthError(text: string): boolean {
  return /HTTP 40[13]\b/.test(text) && !isRateLimited(text);
}

/** Process boundary, injectable so retry behaviour is testable without `gh`. */
export interface GhDeps {
  /** Runs `gh api graphql` and returns stdout; throws like execFileSync on a non-zero exit. */
  run: (query: string) => string;
  sleep: (ms: number) => Promise<void>;
}

const defaultDeps: GhDeps = {
  run: (query) =>
    execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
      timeout: GH_TIMEOUT_MS,
      encoding: "utf-8",
      maxBuffer: 32 * 1024 * 1024,
    }),
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
};

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
export async function ghGraphQL<T>(query: string, deps: GhDeps = defaultDeps): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const out = deps.run(query);
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
        await deps.sleep(delay);
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
      const msg = err instanceof Error ? (err.message.split("\n")[0] ?? "") : String(err);

      if (isAuthError(text)) {
        throw new Error(
          `gh graphql was refused (HTTP 401/403, not rate limiting) - check that the token is valid and has ` +
            `access to the repositories queried; not retrying. ${msg}`,
          { cause: err },
        );
      }

      // A rate-limit body is JSON too, and recovering it as success is worse
      // than failing: every alias in the chunk silently resolves to nothing
      // and the run reports a clean pass over missing data. The same goes
      // for a 502/503/504 or timeout ({"data":null,"errors":[...]}): taking
      // it dropped a whole chunk of repos on a blip one retry would have
      // cleared. So a body counts as the answer only for a non-transient
      // failure, or once the retries are spent and it is all there is.
      const transient = isTransientGhError(err);
      const recovered = !limited && body.trimStart().startsWith("{") ? tryParse<T>(body) : null;
      if (recovered !== null && (!transient || attempt >= MAX_RETRIES)) return recovered;
      if (attempt >= MAX_RETRIES || !(limited || transient)) throw err;

      const delay = limited
        ? Math.min(retryAfterMs(text) ?? RATE_LIMIT_BASE_BACKOFF_MS * 2 ** attempt, RATE_LIMIT_MAX_BACKOFF_MS)
        : BASE_BACKOFF_MS * 2 ** attempt;
      logger.warn(
        `gh graphql attempt ${attempt + 1}/${MAX_RETRIES + 1} failed` +
          `${limited ? " (rate limited)" : ""} (${msg}); retrying in ${Math.round(delay / 1000)}s`,
      );
      await deps.sleep(delay);
    }
  }
}

function tryParse<T>(body: string): T | null {
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}
