import { describe, expect, it, vi } from "vitest";
import { searchGitHub } from "../../src/sources/github.js";

vi.mock("@octokit/rest", () => ({
  Octokit: vi.fn().mockImplementation(function () {
    return {
      search: {
        repos: vi.fn().mockResolvedValue({
          data: {
            items: [
              {
                full_name: "org/new-automl-tool",
                name: "new-automl-tool",
                description: "A new AutoML framework",
                stargazers_count: 250,
                pushed_at: "2026-04-01T00:00:00Z",
                language: "Python",
                archived: false,
                license: { spdx_id: "MIT" },
              },
              {
                full_name: "user/tiny-project",
                name: "tiny-project",
                description: "Too small",
                stargazers_count: 10,
                pushed_at: "2026-03-01T00:00:00Z",
                language: "Python",
                archived: false,
                license: null,
              },
            ],
          },
        }),
      },
      repos: {
        getContent: vi.fn().mockResolvedValue({
          data: { content: btoa("# New AutoML Tool\nGreat framework.") },
        }),
      },
    };
  }),
}));

describe("searchGitHub", () => {
  it("returns candidates with stars >= minStars", async () => {
    const candidates = await searchGitHub({
      token: "ghp_test",
      topics: ["automl"],
      minStars: 50,
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0].repo).toBe("org/new-automl-tool");
    expect(candidates[0].stars).toBe(250);
    expect(candidates[0].source).toBe("github");
  });

  it("includes readme content in candidate", async () => {
    const candidates = await searchGitHub({
      token: "ghp_test",
      topics: ["automl"],
      minStars: 50,
    });
    expect(candidates[0].readme).toContain("New AutoML Tool");
  });
});
