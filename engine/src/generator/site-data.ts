// Generates docs/data.json from projects.yaml + API cache for the GitHub Pages site
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(import.meta.dirname, "../../..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const CACHE_FILE = resolve(ROOT, ".github/api_cache.json");
const OUTPUT = resolve(ROOT, "docs/data.json");

interface Entry {
  name: string;
  repo?: string;
  url?: string;
  description?: string;
  note?: string;
}

interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

function main() {
  const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
  const doc = parseYaml(yamlContent) as { categories: Category[] };

  let apiData: Record<string, { stars: number; pushed: string; archived: boolean }> = {};
  try {
    apiData = JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    console.log("No API cache found, using empty data");
  }

  const output = {
    generated: new Date().toISOString(),
    categories: doc.categories.map((cat) => ({
      name: cat.name,
      description: cat.description ?? "",
      entries: (cat.entries ?? []).map((entry) => {
        const api = apiData[entry.repo ?? ""] ?? { stars: 0, pushed: "", archived: false };
        return {
          name: entry.name,
          repo: entry.repo ?? "",
          url: entry.url ?? (entry.repo ? `https://github.com/${entry.repo}` : ""),
          description: entry.description ?? "",
          note: entry.note ?? "",
          stars: api.stars,
          lastCommit: api.pushed,
          archived: api.archived,
          language: "",
        };
      }),
    })),
  };

  mkdirSync(resolve(ROOT, "docs"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Generated docs/data.json: ${doc.categories.length} categories`);
}

main();
