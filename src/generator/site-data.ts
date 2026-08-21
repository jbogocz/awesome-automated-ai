// Generates docs/data.json from projects.yaml + the SQLite DB (source of truth).
// Falls back to data/api_cache.json only if the DB is empty (fresh clone without generate run).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { MIN_SITE_COVERAGE } from "../constants.js";
import { DB } from "../db/client.js";
import { displayBucket, type Lifecycle, repoStatus } from "../status.js";
import { logger } from "../utils/logger.js";
import { loadApiDataFromDB } from "./fetch-api.js";
import type { ApiData, ApiRepoData } from "./readme.js";
import { buildTagCorpus, selectTags } from "./tags.js";

const ROOT = resolve(import.meta.dirname, "../..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const MANIFEST_YAML = resolve(ROOT, "src/categories.yaml");
const CACHE_FILE = resolve(ROOT, "data/api_cache.json");
const OUTPUT = resolve(ROOT, "docs/data.json");

interface Entry {
  name: string;
  repo?: string;
  url?: string;
  description?: string;
  tagline?: string;
  note?: string;
  lifecycle?: Lifecycle;
  tags?: string[];
  vendor?: string;
  pricing?: string;
  authors?: string;
  venue?: string;
  year?: number | string;
  commercial?: boolean;
}

interface ManifestCategory {
  id: string;
  name: string;
  section: string;
  description?: string;
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
  trend30dDays: null,
  score: 0,
  topics: [],
  tagline: null,
  lastCommit: null,
  lastRelease: null,
  lastTag: null,
  lastStableTag: null,
  commits90d: null,
  history: [] as { date: string; stars: number }[],
  stale: undefined,
} as const satisfies Partial<ApiRepoData> & Record<string, unknown>;

/**
 * The date the underlying measurements were actually taken, read from the
 * newest snapshot in the DB. `generated` only says when this file was
 * written — on a degraded run the two diverge, and the dashboard must show
 * the measured date rather than assert a currency nothing verified.
 */
function readDataAsOf(): string | null {
  try {
    const db = new DB(resolve(ROOT, "data/curator.db"));
    try {
      db.migrate();
      return db.getMaxSnapshotDate();
    } finally {
      db.close();
    }
  } catch (err) {
    logger.warn(`Could not read snapshot date: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function main() {
  const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
  const doc = parseYaml(yamlContent) as { categories: Category[] };

  let sectionByCategory = new Map<string, string>();
  if (existsSync(MANIFEST_YAML)) {
    const manifest = parseYaml(readFileSync(MANIFEST_YAML, "utf-8")) as {
      categories: ManifestCategory[];
    };
    sectionByCategory = new Map(manifest.categories.map((c) => [c.name, c.section]));
  }

  let apiData: ApiData = {};
  try {
    apiData = loadApiDataFromDB(yamlContent);
    logger.info(`Loaded ${Object.keys(apiData).length} repos from DB`);
  } catch (err) {
    logger.warn(`DB read failed (${err instanceof Error ? err.message : String(err)}), falling back to cache`);
    try {
      apiData = JSON.parse(readFileSync(CACHE_FILE, "utf-8")) as ApiData;
    } catch {
      logger.info(`No API cache at ${CACHE_FILE}, using empty data`);
    }
  }

  // Same corpus-derived ranking the README uses, so both surfaces show the
  // same tags for an entry.
  const tagCorpus = buildTagCorpus(
    doc.categories.flatMap((cat) =>
      (cat.entries ?? []).map((e) => (e.tags && e.tags.length > 0 ? e.tags : (apiData[e.repo ?? ""]?.topics ?? []))),
    ),
  );

  const output = {
    generated: new Date().toISOString(),
    dataAsOf: readDataAsOf(),
    categories: doc.categories.map((cat) => ({
      name: cat.name,
      section: sectionByCategory.get(cat.name) ?? "",
      description: cat.description ?? "",
      entries: (cat.entries ?? []).map((entry) => {
        const hasApi = Boolean(entry.repo && apiData[entry.repo]);
        const api = apiData[entry.repo ?? ""] ?? EMPTY_API;
        const tags = entry.tags && entry.tags.length > 0 ? entry.tags : (api.topics ?? []);
        const isExternal = !entry.repo;
        // Precomputed health status (src/status.ts) — docs/lib.js reads
        // this field and must never re-derive it from dates.
        const status = hasApi
          ? repoStatus({
              archived: api.archived,
              lastCommit: api.lastCommit ?? null,
              lastRelease: api.lastRelease ?? null,
              lastTag: api.lastTag ?? null,
              lastStableTag: api.lastStableTag ?? null,
              commits90d: api.commits90d ?? null,
            })
          : null;
        return {
          name: entry.name,
          repo: entry.repo ?? "",
          url: entry.url ?? (entry.repo ? `https://github.com/${entry.repo}` : ""),
          description: entry.description ?? "",
          // Per-entry YAML first — the cached tagline is repo-keyed, so
          // cross-listed entries would otherwise share one line.
          tagline: entry.tagline ?? api.tagline ?? "",
          note: entry.note ?? "",
          // Null, not zero, when nothing resolved. EMPTY_API's zeros exist so
          // the shape is stable, but publishing them made an unresolved entry
          // render "0 stars, score 0" — a measurement nobody took, and a
          // verdict the README avoids by printing a "stats pending" card.
          stars: hasApi ? api.stars : null,
          trend: api.trend,
          // The window the trend actually spans. Snapshots are weekly, so the
          // point nearest t-30 is usually t-28 or t-31; the dashboard used to
          // hard-code "(30d)" and overstate or understate every figure.
          trendDays: api.trend30dDays ?? null,
          score: hasApi ? api.score : null,
          license: api.license,
          lastCommit: api.lastCommit ?? null,
          lastRelease: api.lastRelease ?? null,
          archived: api.archived,
          status,
          // Same rule the README uses (src/status.ts), baked in so the site
          // never re-derives presentation from free text.
          bucket: status ? displayBucket(status, entry.lifecycle) : null,
          ...(entry.lifecycle ? { lifecycle: entry.lifecycle } : {}),
          // True when this entry's live fetch failed and it is being served
          // from an older snapshot; the row renders an age marker.
          ...(api.stale ? { stale: api.stale } : {}),
          tags: selectTags(tags, tagCorpus),
          external: isExternal,
          // Measured weekly star history, oldest first, as compact
          // [date, stars] tuples — the sparkline plots these verbatim.
          // Tuples rather than objects keep this affordable as the list grows.
          ...(api.history && api.history.length > 0
            ? { history: api.history.map((p) => [p.date, p.stars] as [string, number]) }
            : {}),
          ...(entry.commercial ? { commercial: true } : {}),
          ...(entry.vendor ? { vendor: entry.vendor } : {}),
          ...(entry.pricing ? { pricing: entry.pricing } : {}),
          ...(entry.authors ? { authors: entry.authors } : {}),
          ...(entry.venue ? { venue: entry.venue } : {}),
          ...(entry.year !== undefined ? { year: entry.year } : {}),
        };
      }),
    })),
  };

  // Coverage gate. loadApiDataFromDB returns {} on an empty DB without
  // throwing, which produced an all-zero-stars dashboard with no error at
  // all — the feed must refuse to publish rather than assert nothing.
  const all = output.categories.flatMap((c) => c.entries);
  const repoBacked = all.filter((e) => e.repo);
  const resolved = repoBacked.filter((e) => e.status !== null);
  const coverage = repoBacked.length === 0 ? 1 : resolved.length / repoBacked.length;
  if (coverage < MIN_SITE_COVERAGE) {
    logger.error(
      `Only ${resolved.length}/${repoBacked.length} repo-backed entries resolved to real stats ` +
        `(${(coverage * 100).toFixed(1)}%); refusing to write docs/data.json below ` +
        `${(MIN_SITE_COVERAGE * 100).toFixed(0)}%. Run generate to refresh the DB first.`,
    );
    process.exit(1);
  }

  mkdirSync(resolve(ROOT, "docs"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  logger.info(
    `Generated docs/data.json: ${doc.categories.length} categories, ` +
      `${resolved.length}/${repoBacked.length} repos with stats, data as of ${output.dataAsOf ?? "unknown"}`,
  );
}

main();
