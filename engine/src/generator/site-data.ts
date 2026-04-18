// Generates docs/data.json from projects.yaml + API cache for the GitHub Pages site
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import type { ApiData } from "./readme.js";

const ROOT = resolve(import.meta.dirname, "../../..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const CACHE_FILE = resolve(ROOT, "data/api_cache.json");
const OUTPUT = resolve(ROOT, "docs/data.json");

interface Entry {
  name: string;
  repo?: string;
  url?: string;
  description?: string;
  tagline?: string;
  note?: string;
  tags?: string[];
  vendor?: string;
  pricing?: string;
  authors?: string;
  venue?: string;
  year?: number | string;
}

interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

const EMPTY_API = {
  stars: 0,
  pushed: "",
  archived: false,
  license: null,
  trend: null,
  score: 0,
  topics: [],
  tagline: null,
} as const;

function main() {
  const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
  const doc = parseYaml(yamlContent) as { categories: Category[] };

  let apiData: ApiData = {};
  try {
    apiData = JSON.parse(readFileSync(CACHE_FILE, "utf-8")) as ApiData;
  } catch {
    console.log(`No API cache at ${CACHE_FILE}, using empty data`);
  }

  const output = {
    generated: new Date().toISOString(),
    categories: doc.categories.map((cat) => ({
      name: cat.name,
      description: cat.description ?? "",
      entries: (cat.entries ?? []).map((entry) => {
        const api = apiData[entry.repo ?? ""] ?? EMPTY_API;
        const tags = entry.tags && entry.tags.length > 0 ? entry.tags : (api.topics ?? []);
        const isExternal = !entry.repo;
        return {
          name: entry.name,
          repo: entry.repo ?? "",
          url: entry.url ?? (entry.repo ? `https://github.com/${entry.repo}` : ""),
          description: entry.description ?? "",
          tagline: api.tagline ?? entry.tagline ?? "",
          note: entry.note ?? "",
          stars: api.stars,
          trend: api.trend,
          score: api.score,
          license: api.license,
          lastCommit: api.pushed,
          archived: api.archived,
          tags: tags.slice(0, 5),
          external: isExternal,
          ...(entry.vendor ? { vendor: entry.vendor } : {}),
          ...(entry.pricing ? { pricing: entry.pricing } : {}),
          ...(entry.authors ? { authors: entry.authors } : {}),
          ...(entry.venue ? { venue: entry.venue } : {}),
          ...(entry.year !== undefined ? { year: entry.year } : {}),
        };
      }),
    })),
  };

  mkdirSync(resolve(ROOT, "docs"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Generated docs/data.json: ${doc.categories.length} categories`);
}

main();
