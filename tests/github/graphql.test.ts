import { describe, expect, it } from "vitest";
import { type GhDeps, ghGraphQL, isRateLimited, retryAfterMs } from "../../src/github/graphql.js";

describe("isRateLimited", () => {
  it("matches primary, secondary and GraphQL-level rate limiting", () => {
    expect(isRateLimited("HTTP 403 rate limit exceeded")).toBe(true);
    expect(isRateLimited("HTTP 429")).toBe(true);
    expect(isRateLimited("You have exceeded a secondary rate limit")).toBe(true);
    expect(isRateLimited('{"errors":[{"type":"RATE_LIMITED"}]}')).toBe(true);
    expect(isRateLimited("abuse detection mechanism")).toBe(true);
  });

  it("does not match ordinary failures", () => {
    expect(isRateLimited("HTTP 502 Bad Gateway")).toBe(false);
    expect(isRateLimited("Could not resolve to a Repository")).toBe(false);
  });

  // A bare 403 is also a revoked token or missing scope; 409 is a conflict.
  it("does not treat a 403 or 409 without a rate-limit signal as rate limiting", () => {
    expect(isRateLimited("gh: Resource not accessible by integration (HTTP 403)")).toBe(false);
    expect(isRateLimited("HTTP 409: Conflict")).toBe(false);
    expect(isRateLimited("HTTP 403\nx-ratelimit-remaining: 0")).toBe(true);
  });
});

/** An error shaped like execFileSync's on a non-zero gh exit. */
function ghExit(stderr: string, stdout = ""): Error {
  return Object.assign(new Error(`Command failed: gh api graphql\n${stderr}`), { stderr, stdout });
}

/** Fake transport: replays `outcomes` in order (a string is stdout, an Error is thrown). */
function fakeGh(outcomes: (string | Error)[]): GhDeps & { calls: () => number; delays: number[] } {
  let calls = 0;
  const delays: number[] = [];
  return {
    run: () => {
      const next = outcomes[Math.min(calls, outcomes.length - 1)];
      calls++;
      if (next instanceof Error) throw next;
      return next ?? "";
    },
    sleep: async (ms) => {
      delays.push(ms);
    },
    calls: () => calls,
    delays,
  };
}

describe("ghGraphQL retry", () => {
  const ok = JSON.stringify({ data: { r0: { stargazerCount: 1 } } });

  // gh exits 1 on a 502 and still prints GitHub's JSON error body. Taking
  // that body as the answer dropped a whole chunk of repos without a retry.
  it("retries a transient 5xx even when a JSON body came with it", async () => {
    const gh = fakeGh([ghExit("HTTP 502: Bad Gateway", '{"data":null,"errors":[{"message":"502"}]}'), ok]);
    await expect(ghGraphQL("q", gh)).resolves.toEqual(JSON.parse(ok));
    expect(gh.calls()).toBe(2);
  });

  it("returns the last JSON body once transient retries are exhausted", async () => {
    const body = '{"data":null,"errors":[{"message":"timeout"}]}';
    const gh = fakeGh([ghExit("HTTP 504: Gateway Timeout", body)]);
    await expect(ghGraphQL("q", gh)).resolves.toEqual(JSON.parse(body));
    expect(gh.calls()).toBe(5);
  });

  it("recovers a partial-data body from a non-transient failure without retrying", async () => {
    const body = '{"data":{"r0":null},"errors":[{"type":"NOT_FOUND","path":["r0"]}]}';
    const gh = fakeGh([ghExit("GraphQL: Could not resolve to a Repository", body)]);
    await expect(ghGraphQL("q", gh)).resolves.toEqual(JSON.parse(body));
    expect(gh.calls()).toBe(1);
  });

  it("fails fast with a clear message on a 403 that is not rate limiting", async () => {
    const gh = fakeGh([ghExit("gh: Resource not accessible by integration (HTTP 403)", '{"message":"nope"}')]);
    await expect(ghGraphQL("q", gh)).rejects.toThrow(/not rate limiting.*token/);
    expect(gh.calls()).toBe(1);
    expect(gh.delays).toEqual([]);
  });

  it("still backs off on a 403 that says it is a rate limit", async () => {
    const gh = fakeGh([ghExit("gh: API rate limit exceeded for user (HTTP 403)"), ok]);
    await expect(ghGraphQL("q", gh)).resolves.toEqual(JSON.parse(ok));
    expect(gh.delays).toEqual([30_000]);
  });
});

describe("retryAfterMs", () => {
  it("prefers an explicit Retry-After header", () => {
    expect(retryAfterMs("retry-after: 42")).toBe(42_000);
  });

  it("falls back to x-ratelimit-reset relative to now", () => {
    const now = 1_000_000_000_000;
    const resetEpoch = Math.floor(now / 1000) + 90;
    expect(retryAfterMs(`x-ratelimit-reset: ${resetEpoch}`, now)).toBe(90_000);
  });

  it("ignores an x-ratelimit-reset already in the past", () => {
    const now = 1_000_000_000_000;
    expect(retryAfterMs(`x-ratelimit-reset: ${Math.floor(now / 1000) - 10}`, now)).toBeNull();
  });

  it("returns null when the text carries no timing hint", () => {
    expect(retryAfterMs("HTTP 403 rate limit exceeded")).toBeNull();
  });
});
