import { execFileSync } from "node:child_process";
import { parse as parseYaml } from "yaml";
import type { ApiData } from "./readme.js";

export function fetchRepoData(yamlContent: string): ApiData {
  const doc = parseYaml(yamlContent) as { categories: { entries?: { repo?: string }[] }[] };
  const repos = new Set<string>();
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) repos.add(entry.repo);
    }
  }
  console.log(`Fetching data for ${repos.size} repos...`);
  const data: ApiData = {};
  for (const repo of repos) {
    try {
      const result = execFileSync(
        "gh",
        ["api", `repos/${repo}`, "--jq", "{stars: .stargazers_count, pushed: .pushed_at, archived: .archived}"],
        { timeout: 15_000, encoding: "utf-8" },
      );
      data[repo] = JSON.parse(result);
    } catch {
      data[repo] = { stars: 0, pushed: "", archived: false };
    }
  }
  return data;
}
