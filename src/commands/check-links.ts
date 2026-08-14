import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { logger } from "../utils/logger.js";

/**
 * Probes the URLs the pipeline never touches.
 *
 * fetchRepoData only visits entries that have a `repo:`, so the ~30 `url:`
 * fields and the ~45 links hand-written into templates/ were never checked by
 * anything. That is exactly why mle-bench.github.io returned 404 in the
 * published README for months, and why Papers With Code stayed listed with a
 * description of features its successor does not have.
 *
 * GitHub repo URLs are deliberately skipped: the weekly metadata fetch already
 * covers them, and it now reports renames too.
 */

const TIMEOUT_MS = 25_000;
const CONCURRENCY = 8;

/** Hosts that answer 403 to any non-browser client. A 403 from these is not rot. */
const BOT_WALLED = [
  /(^|\.)academic\.oup\.com$/,
  /(^|\.)dl\.acm\.org$/,
  /(^|\.)sciencedirect\.com$/,
  /(^|\.)ieee\.org$/,
];

/**
 * URLs whose status says nothing about rot. GitHub answers 404 on
 * /stargazers to unauthenticated clients for every repository, including
 * sindresorhus/awesome, and /releases/latest is a redirect by design.
 */
const NOT_JUDGEABLE = [/github\.com\/[^/]+\/[^/]+\/stargazers\/?$/, /github\.com\/[^/]+\/[^/]+\/releases\/latest\/?$/];

/**
 * Redirect destinations that are a login wall or an interstitial, not a move:
 * the content is still at the original address for a browser.
 */
const INTERSTITIAL = [/(^|\.)idp\.nature\.com$/, /openreview\.net\/challenge/];

const USER_AGENT = "Mozilla/5.0 (compatible; awesome-automated-ai link check)";

export interface LinkResult {
  url: string;
  where: string;
  status: number | null;
  finalUrl: string | null;
  error?: string;
}

export interface CheckLinksOptions {
  projectsYamlPath: string;
  templatePaths: string[];
  /** Report redirects that land on a different path, not just a different host. */
  reportRedirects?: boolean;
}

/** Every http(s) URL in a markdown file, with duplicates collapsed. */
export function extractUrls(text: string): string[] {
  const found = text.match(/https?:\/\/[^\s)"'<>\]]+/g) ?? [];
  // Trailing punctuation belongs to the prose, not the URL.
  return [...new Set(found.map((u) => u.replace(/[.,;:]+$/, "")))];
}

function isBotWalled(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return BOT_WALLED.some((re) => re.test(host));
  } catch {
    return false;
  }
}

/** True when a redirect changed more than the trailing slash or the scheme. */
export function isMeaningfulRedirect(from: string, to: string): boolean {
  try {
    const a = new URL(from);
    const b = new URL(to);
    if (INTERSTITIAL.some((re) => re.test(b.hostname) || re.test(to))) return false;
    if (a.hostname.replace(/^www\./, "") !== b.hostname.replace(/^www\./, "")) return true;
    return a.pathname.replace(/\/$/, "") !== b.pathname.replace(/\/$/, "");
  } catch {
    return false;
  }
}

async function probe(url: string, where: string): Promise<LinkResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // HEAD first; many hosts reject it, so fall back to a ranged GET rather
    // than pulling whole pages.
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": USER_AGENT },
    });
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": USER_AGENT, range: "bytes=0-2048" },
      });
    }
    return { url, where, status: res.status, finalUrl: res.url };
  } catch (err) {
    return { url, where, status: null, finalUrl: null, error: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

/** Runs `worker` over `items` with a fixed number of workers in flight. */
async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (true) {
        const i = next++;
        const item = items[i];
        if (i >= items.length || item === undefined) return;
        out[i] = await worker(item);
      }
    }),
  );
  return out;
}

export function collectTargets(opts: CheckLinksOptions): { url: string; where: string }[] {
  const targets = new Map<string, string>();

  const doc = parseYaml(readFileSync(opts.projectsYamlPath, "utf-8")) as {
    categories: { name: string; entries?: { name: string; url?: string; repo?: string }[] }[];
  };
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      // Repo-backed entries are covered by the weekly metadata fetch.
      if (!entry.url || entry.repo) continue;
      if (!targets.has(entry.url)) targets.set(entry.url, `projects.yaml: ${cat.name} / ${entry.name}`);
    }
  }

  for (const path of opts.templatePaths) {
    let text: string;
    try {
      text = readFileSync(path, "utf-8");
    } catch {
      continue;
    }
    for (const url of extractUrls(text)) {
      // Badge and shield endpoints are infrastructure, not curated links.
      if (/img\.shields\.io|hits\.sh|awesome\.re\/badge/.test(url)) continue;
      if (!targets.has(url)) targets.set(url, path.split("/").slice(-2).join("/"));
    }
  }

  return [...targets].map(([url, where]) => ({ url, where }));
}

export async function runCheckLinksCommand(opts: CheckLinksOptions): Promise<number> {
  const targets = collectTargets(opts);
  logger.info(`Probing ${targets.length} URLs the metadata fetch never touches...`);

  const results = await mapLimit(targets, CONCURRENCY, (t) => probe(t.url, t.where));

  const judgeable = results.filter((r) => !NOT_JUDGEABLE.some((re) => re.test(r.url)));
  const broken = judgeable.filter((r) => r.status === null || r.status >= 400).filter((r) => !isBotWalled(r.url));
  const walled = judgeable.filter((r) => (r.status === null || r.status >= 400) && isBotWalled(r.url));
  const moved = opts.reportRedirects
    ? judgeable.filter(
        (r) => r.status !== null && r.status < 400 && r.finalUrl && isMeaningfulRedirect(r.url, r.finalUrl),
      )
    : [];

  for (const r of moved) {
    logger.warn(`moved: ${r.url} -> ${r.finalUrl} (${r.where})`);
  }
  if (walled.length > 0) {
    logger.info(
      `${walled.length} URL(s) on known bot-walled publishers were not judged: ${walled.map((r) => r.url).join(", ")}`,
    );
  }

  if (broken.length === 0) {
    logger.info(`All ${targets.length} URLs resolved.`);
    return 0;
  }
  for (const r of broken) {
    logger.error(`dead: ${r.url} -> ${r.error ?? `HTTP ${r.status}`} (${r.where})`);
  }
  logger.error(`${broken.length} of ${targets.length} URLs are unreachable.`);
  return broken.length;
}

export function defaultCheckLinksOptions(root: string): CheckLinksOptions {
  return {
    projectsYamlPath: resolve(root, "projects.yaml"),
    templatePaths: [resolve(root, "templates/header.md"), resolve(root, "templates/footer.md")],
  };
}
