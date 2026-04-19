import { beforeEach, describe, expect, it, vi } from "vitest";

const mockExec = vi.fn();
vi.mock("node:child_process", () => ({
  execFileSync: (...args: unknown[]) => mockExec(...args),
}));

const { fetchRecentStargazersRest } = await import("../../src/github/stargazers-rest.js");

function mockGhInclude(linkHeader: string, data: unknown): string {
  const body = JSON.stringify(data);
  const headers = linkHeader ? `HTTP/2.0 200 OK\r\nLink: ${linkHeader}\r\n` : `HTTP/2.0 200 OK\r\n`;
  return `${headers}\r\n${body}`;
}

describe("fetchRecentStargazersRest", () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it("walks the Link rel=last page backwards, stopping when the oldest on a page is before `since`", async () => {
    mockExec.mockImplementationOnce(() =>
      mockGhInclude('<https://api.github.com/repositories/1/stargazers?page=5&per_page=100>; rel="last"', []),
    );
    mockExec.mockImplementationOnce(() =>
      mockGhInclude(
        "",
        Array.from({ length: 100 }, (_, i) => ({
          starred_at: new Date(Date.UTC(2026, 3, 18, 0, i)).toISOString(),
        })),
      ),
    );
    mockExec.mockImplementationOnce(() => {
      const base = new Date(Date.UTC(2026, 2, 18));
      return mockGhInclude(
        "",
        Array.from({ length: 100 }, (_, i) => ({
          starred_at: new Date(base.getTime() + i * 3600_000).toISOString(),
        })),
      );
    });

    const since = new Date(Date.UTC(2026, 2, 20));
    const result = await fetchRecentStargazersRest("owner/repo", since);

    expect(result.error).toBeUndefined();
    expect(result.stargazers.length).toBeGreaterThan(100);
    for (const s of result.stargazers) {
      expect(new Date(s.starredAt) >= since).toBe(true);
    }
  });

  it("returns error='not_found' on 404", async () => {
    mockExec.mockImplementationOnce(() => {
      throw new Error("gh: Not Found (HTTP 404)");
    });
    const result = await fetchRecentStargazersRest("bad/repo", new Date());
    expect(result.error).toBe("not_found");
    expect(result.stargazers).toEqual([]);
  });
});
