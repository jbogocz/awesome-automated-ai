import { describe, expect, it } from "vitest";
import { isRateLimited, retryAfterMs } from "../../src/github/graphql.js";

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
