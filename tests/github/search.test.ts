import { describe, expect, it, vi } from "vitest";
import { GitHubError, request } from "../../src/github/client.ts";
import { searchGitHub } from "../../src/github/search.ts";

vi.mock("../../src/github/client.ts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/github/client.ts")>()),
  request: vi.fn(),
}));

const item = {
  full_name: "torvalds/linux",
  name: "linux",
  description: "Linux kernel",
  stargazers_count: 200_000,
  pushed_at: "2026-11-01T00:00:00Z",
  language: "C",
  license: { spdx_id: "GPL-2.0" },
  topics: ["automl"],
};

describe("searchGitHub README", () => {
  // The contents API is case- and extension-sensitive: torvalds/linux ships a
  // bare README, so .../contents/README.md answers 404 for it. /readme is the
  // endpoint that finds whichever README a repository has.
  it("reads the README through the endpoint that finds any README file", async () => {
    vi.mocked(request).mockImplementation((async (path: string) => {
      if (path.startsWith("/search/repositories")) return { data: { items: [item] }, headers: new Headers() };
      if (path === "/repos/torvalds/linux/readme") {
        return { data: { content: Buffer.from("# Linux").toString("base64") }, headers: new Headers() };
      }
      throw new GitHubError(`GitHub GET ${path} failed: HTTP 404`, 404);
    }) as typeof request);

    const [candidate] = await searchGitHub({ topics: ["automl"], minStars: 50, maxResults: 1 });

    expect(candidate?.readme).toBe("# Linux");
  });

  it("treats a repository without a README as empty and any other failure as an error", async () => {
    const respond = (readmeStatus: number) =>
      vi.mocked(request).mockImplementation((async (path: string) => {
        if (path.startsWith("/search/repositories")) return { data: { items: [item] }, headers: new Headers() };
        throw new GitHubError(`GitHub GET ${path} failed: HTTP ${readmeStatus}`, readmeStatus);
      }) as typeof request);
    const search = () => searchGitHub({ topics: ["automl"], minStars: 50, maxResults: 1 });

    respond(404);
    expect((await search())[0]?.readme).toBe("");

    respond(502);
    await expect(search()).rejects.toThrow(/HTTP 502/);
  });
});
