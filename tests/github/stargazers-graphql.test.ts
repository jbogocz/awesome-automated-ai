import { beforeEach, describe, expect, it, vi } from "vitest";

const mockExec = vi.fn();
vi.mock("node:child_process", () => ({
  execFileSync: (...args: unknown[]) => mockExec(...args),
}));

const { buildBatchQuery, parseBatchResponse, fetchRecentStargazersBatch } = await import(
  "../../src/github/stargazers-graphql.js"
);

describe("buildBatchQuery", () => {
  it("aliases repos as r0, r1, ... with stargazerCount + stargazers(DESC) + rateLimit", () => {
    const q = buildBatchQuery(["owner1/repo1", "owner2/repo2"]);
    expect(q).toContain('r0: repository(owner: "owner1", name: "repo1")');
    expect(q).toContain('r1: repository(owner: "owner2", name: "repo2")');
    expect(q).toContain("stargazerCount");
    expect(q).toContain("orderBy: {field: STARRED_AT, direction: DESC}");
    expect(q).toContain("rateLimit {");
  });

  it("strips quote characters from repo components", () => {
    const q = buildBatchQuery(['evil"owner/repo']);
    expect(q).not.toMatch(/repository\(owner: "evil"/);
  });
});

describe("parseBatchResponse", () => {
  it("maps repo keys to stargazers pages", () => {
    const response = {
      data: {
        r0: {
          stargazerCount: 100,
          stargazers: {
            edges: [{ starredAt: "2026-04-18T12:00:00Z" }, { starredAt: "2026-04-15T12:00:00Z" }],
            pageInfo: { hasNextPage: false, endCursor: "abc" },
          },
        },
        rateLimit: { remaining: 4900, resetAt: "2026-04-19T18:00:00Z", cost: 1 },
      },
    };
    const result = parseBatchResponse(["a/b"], response);
    expect(result.pages.get("a/b")).toEqual({
      stargazers: [{ starredAt: "2026-04-18T12:00:00Z" }, { starredAt: "2026-04-15T12:00:00Z" }],
      totalCount: 100,
      hasNextPage: false,
      endCursor: "abc",
    });
    expect(result.rateLimit).toEqual({
      remaining: 4900,
      resetAt: "2026-04-19T18:00:00Z",
      cost: 1,
    });
  });

  it("records per-alias errors as pages with an error field", () => {
    const response = {
      data: { r0: null, rateLimit: { remaining: 4999, resetAt: "z", cost: 1 } },
      errors: [{ path: ["r0"], message: "Could not resolve to a Repository", type: "NOT_FOUND" }],
    };
    const result = parseBatchResponse(["missing/repo"], response);
    const page = result.pages.get("missing/repo");
    expect(page?.error).toBe("not_found");
    expect(page?.stargazers).toEqual([]);
  });
});

describe("fetchRecentStargazersBatch", () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it("calls gh api graphql once per batch and returns a full map", async () => {
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 50,
            stargazers: {
              edges: [{ starredAt: "2026-04-10T12:00:00Z" }],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
          rateLimit: { remaining: 4999, resetAt: "2026-04-19T18:00:00Z", cost: 1 },
        },
      }),
    );
    const result = await fetchRecentStargazersBatch(["owner/repo"], new Date(Date.UTC(2026, 2, 20)));
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(result.pages.size).toBe(1);
    expect(result.rateLimit.remaining).toBe(4999);
  });

  it("runs a continuation pass for repos whose oldest-in-page is still within window", async () => {
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 5000,
            stargazers: {
              edges: Array.from({ length: 100 }, (_, i) => ({
                starredAt: new Date(Date.UTC(2026, 3, 19 - Math.floor(i / 10))).toISOString(),
              })),
              pageInfo: { hasNextPage: true, endCursor: "CURSOR1" },
            },
          },
          rateLimit: { remaining: 4999, resetAt: "z", cost: 1 },
        },
      }),
    );
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 5000,
            stargazers: {
              edges: [
                { starredAt: "2026-04-01T12:00:00Z" },
                { starredAt: "2026-03-25T12:00:00Z" },
                { starredAt: "2026-03-15T12:00:00Z" },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
          rateLimit: { remaining: 4998, resetAt: "z", cost: 1 },
        },
      }),
    );
    const since = new Date(Date.UTC(2026, 2, 20));
    const result = await fetchRecentStargazersBatch(["owner/repo"], since);
    const page = result.pages.get("owner/repo");
    expect(page?.stargazers.length).toBeGreaterThan(100);
    for (const s of page?.stargazers ?? []) {
      expect(new Date(s.starredAt) >= since).toBe(true);
    }
    expect(mockExec).toHaveBeenCalledTimes(2);
  });
});
