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

describe("searchGitHub candidate budget", () => {
  const itemNamed = (full_name: string) => ({ ...item, full_name, name: full_name.split("/")[1] ?? "" });
  const readme = { data: { content: "" }, headers: new Headers() };

  // Measured 2026-11-06: of the 50 slots only 30 went to new repositories, and
  // the run stopped before ai-agents, llm-evaluation, mlops and three more
  // topics were ever searched. Those held 75 new repositories in their top 30.
  it("does not spend the budget on repositories already known", async () => {
    const searched: string[] = [];
    vi.mocked(request).mockImplementation((async (path: string) => {
      if (!path.startsWith("/search/repositories")) return readme;
      const topic = new URLSearchParams(path.split("?")[1]).get("q")?.match(/topic:(\S+)/)?.[1] ?? "";
      searched.push(topic);
      const items = topic === "listed" ? [itemNamed("o/known1"), itemNamed("o/known2")] : [itemNamed("o/new")];
      return { data: { items }, headers: new Headers() };
    }) as typeof request);

    const found = await searchGitHub({
      topics: ["listed", "fresh"],
      minStars: 50,
      maxResults: 2,
      isKnown: (repo) => repo.startsWith("o/known"),
    });

    expect(searched).toEqual(["listed", "fresh"]);
    expect(found.map((c) => c.repo)).toEqual(["o/new"]);
  });

  it("stops at the budget inside a topic", async () => {
    vi.mocked(request).mockImplementation((async (path: string) => {
      if (!path.startsWith("/search/repositories")) return readme;
      return { data: { items: [itemNamed("o/a"), itemNamed("o/b"), itemNamed("o/c")] }, headers: new Headers() };
    }) as typeof request);

    const found = await searchGitHub({ topics: ["t"], minStars: 50, maxResults: 2, isKnown: () => false });

    expect(found.map((c) => c.repo)).toEqual(["o/a", "o/b"]);
  });
});

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

    const [candidate] = await searchGitHub({ topics: ["automl"], minStars: 50, maxResults: 1, isKnown: () => false });

    expect(candidate?.readme).toBe("# Linux");
  });

  it("treats a repository without a README as empty", async () => {
    vi.mocked(request).mockImplementation((async (path: string) => {
      if (path.startsWith("/search/repositories")) return { data: { items: [item] }, headers: new Headers() };
      throw new GitHubError(`GitHub GET ${path} failed: HTTP 404`, 404);
    }) as typeof request);

    const found = await searchGitHub({ topics: ["automl"], minStars: 50, maxResults: 1, isKnown: () => false });

    expect(found[0]?.readme).toBe("");
  });

  // Scored as README-less it would get a final verdict; thrown, one takedown
  // (HTTP 451) or one flaky response ended the search for every other candidate.
  it.each([451, 502])("leaves out only the candidate whose README answered HTTP %i", async (status) => {
    const blocked = { ...item, full_name: "o/blocked", name: "blocked" };
    const fine = { ...item, full_name: "o/fine", name: "fine" };
    vi.mocked(request).mockImplementation((async (path: string) => {
      if (path.startsWith("/search/repositories")) return { data: { items: [blocked, fine] }, headers: new Headers() };
      if (path === "/repos/o/blocked/readme") throw new GitHubError(`GitHub GET ${path} failed`, status);
      return { data: { content: "" }, headers: new Headers() };
    }) as typeof request);

    const found = await searchGitHub({ topics: ["automl"], minStars: 50, maxResults: 5, isKnown: () => false });

    expect(found.map((c) => c.repo)).toEqual(["o/fine"]);
  });
});
