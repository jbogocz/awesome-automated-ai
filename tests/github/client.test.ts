import { describe, expect, it } from "vitest";
import { type GitHubDeps, graphql, isRateLimited, request, retryAfterMs } from "../../src/github/client.ts";

const h = (init: Record<string, string> = {}) => new Headers(init);

describe("isRateLimited", () => {
  it("matches 429 and a 403 that says it is a rate limit", () => {
    expect(isRateLimited(429, h(), "")).toBe(true);
    expect(isRateLimited(403, h(), "API rate limit exceeded for user")).toBe(true);
    expect(isRateLimited(403, h(), "You have exceeded a secondary rate limit")).toBe(true);
    expect(isRateLimited(403, h(), "abuse detection mechanism")).toBe(true);
    expect(isRateLimited(403, h({ "x-ratelimit-remaining": "0" }), "")).toBe(true);
  });

  // A bare 403 is also a revoked token or missing scope.
  it("does not treat a 403 without a rate-limit signal, or a 5xx, as rate limiting", () => {
    expect(isRateLimited(403, h(), '{"message":"Resource not accessible by integration"}')).toBe(false);
    expect(isRateLimited(502, h(), "Bad Gateway")).toBe(false);
  });
});

describe("retryAfterMs", () => {
  it("prefers an explicit Retry-After header", () => {
    expect(retryAfterMs(h({ "retry-after": "42" }))).toBe(42_000);
  });

  it("falls back to x-ratelimit-reset relative to now", () => {
    const now = 1_000_000_000_000;
    const reset = String(Math.floor(now / 1000) + 90);
    expect(retryAfterMs(h({ "x-ratelimit-reset": reset }), now)).toBe(90_000);
  });

  it("ignores an x-ratelimit-reset already in the past", () => {
    const now = 1_000_000_000_000;
    expect(retryAfterMs(h({ "x-ratelimit-reset": String(Math.floor(now / 1000) - 10) }), now)).toBeNull();
  });

  it("returns null when no timing hint is present", () => {
    expect(retryAfterMs(h())).toBeNull();
  });
});

type Outcome = Response | Error;

/** Fake transport: replays `outcomes` in order (a Response is returned, an Error is thrown). */
function fakeGitHub(outcomes: Outcome[]): GitHubDeps & { calls: () => number; delays: number[]; seen: RequestInit[] } {
  let calls = 0;
  const delays: number[] = [];
  const seen: RequestInit[] = [];
  return {
    fetch: async (_url, init) => {
      seen.push(init);
      const next = outcomes[Math.min(calls, outcomes.length - 1)];
      calls++;
      if (next instanceof Error) throw next;
      return (next as Response).clone();
    },
    sleep: async (ms) => {
      delays.push(ms);
    },
    token: () => "test-token",
    calls: () => calls,
    delays,
    seen,
  };
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers });

describe("request retry policy", () => {
  const ok = { data: { r0: { stargazerCount: 1 } } };

  it("retries a transient 5xx and returns the next success", async () => {
    const gh = fakeGitHub([json({ data: null, errors: [{ message: "502" }] }, 502), json(ok)]);
    await expect(graphql("q", gh)).resolves.toEqual(ok);
    expect(gh.calls()).toBe(2);
    expect(gh.delays).toEqual([2_000]);
  });

  it("retries a dropped connection", async () => {
    const gh = fakeGitHub([new TypeError("fetch failed"), json(ok)]);
    await expect(graphql("q", gh)).resolves.toEqual(ok);
    expect(gh.calls()).toBe(2);
  });

  it("gives up after the retry budget on a persistent 5xx", async () => {
    const gh = fakeGitHub([json({ message: "timeout" }, 504)]);
    await expect(graphql("q", gh)).rejects.toThrow(/HTTP 504/);
    expect(gh.calls()).toBe(5);
  });

  it("returns a partial-data GraphQL body as-is, without retrying", async () => {
    const body = { data: { r0: null }, errors: [{ type: "NOT_FOUND", path: ["r0"] }] };
    const gh = fakeGitHub([json(body)]);
    await expect(graphql("q", gh)).resolves.toEqual(body);
    expect(gh.calls()).toBe(1);
  });

  it("backs off on GraphQL's in-band RATE_LIMITED", async () => {
    const gh = fakeGitHub([json({ errors: [{ type: "RATE_LIMITED" }] }), json(ok)]);
    await expect(graphql("q", gh)).resolves.toEqual(ok);
    expect(gh.delays).toEqual([30_000]);
  });

  it("fails fast with a clear message on a 403 that is not rate limiting", async () => {
    const gh = fakeGitHub([json({ message: "Resource not accessible by integration" }, 403)]);
    await expect(graphql("q", gh)).rejects.toThrow(/not rate limiting.*token/);
    expect(gh.calls()).toBe(1);
    expect(gh.delays).toEqual([]);
  });

  it("honours Retry-After on a rate-limited 403", async () => {
    const gh = fakeGitHub([json({ message: "API rate limit exceeded" }, 403, { "retry-after": "7" }), json(ok)]);
    await expect(graphql("q", gh)).resolves.toEqual(ok);
    expect(gh.delays).toEqual([7_000]);
  });

  it("does not retry an ordinary 404", async () => {
    const gh = fakeGitHub([json({ message: "Not Found" }, 404)]);
    await expect(request("/repos/a/b", {}, gh)).rejects.toThrow(/HTTP 404/);
    expect(gh.calls()).toBe(1);
  });

  it("never sends the token to a host other than the GitHub API", async () => {
    const gh = fakeGitHub([json(ok)]);
    await expect(request("https://example.com/collect", {}, gh)).rejects.toThrow(/Refusing to send the GitHub token/);
    await expect(request("https://api.github.com.example.com/x", {}, gh)).rejects.toThrow(/Refusing/);
    expect(gh.calls()).toBe(0);
    await expect(
      request("https://api.github.com/repositories/1/stargazers/history?page=2", {}, gh),
    ).resolves.toBeTruthy();
  });

  it("sends the token and a JSON body", async () => {
    const gh = fakeGitHub([json(ok)]);
    await graphql("query { viewer { login } }", gh);
    const init = gh.seen[0];
    expect(init?.method).toBe("POST");
    expect((init?.headers as Record<string, string> | undefined)?.Authorization).toBe("Bearer test-token");
    expect(init?.body).toBe(JSON.stringify({ query: "query { viewer { login } }" }));
  });
});
