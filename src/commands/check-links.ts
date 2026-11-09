import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { logger } from "../utils/logger.ts";
import { emitReport } from "../utils/report.ts";

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
  /** First run that found this link unreachable, when an outage file is kept. */
  downSince?: string;
}

export interface CheckLinksOptions {
  projectsYamlPath: string;
  templatePaths: string[];
  /** Report redirects that land on a different path, not just a different host. */
  reportRedirects?: boolean;
  /** Append findings here instead of stdout. See src/utils/report.ts. */
  reportPath?: string;
  /**
   * Outages carried between runs (url -> first day seen down). With it, an
   * outage is reported only once it has lasted into the next weekly run;
   * without it, every unreachable link is reported at once.
   */
  outagesPath?: string;
  /** YYYY-MM-DD; defaults to the current UTC date. */
  today?: string;
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

/**
 * 429 means "you asked too often", not "this page is gone". devin.ai answers
 * 429 to every datacenter client including a browser user agent, and was
 * reported as dead in the weekly run for weeks while the site was up.
 */
export function isThrottled(status: number | null): boolean {
  return status === 429;
}

/**
 * A failure that says the host is down rather than that the page is gone: no
 * answer at all, or a server error. On 2026-11-09 the one server behind
 * proceedings.neurips.cc and proceedings.iclr.cc refused every connection for
 * hours, and four correct paper links were filed as dead. A 4xx is the host
 * answering about the page, so that stays a finding on the first run.
 */
export function isOutage(r: LinkResult): boolean {
  return r.status === null || r.status >= 500;
}

/**
 * Days an outage must have lasted before it is reported. The weekly runs are 7
 * days apart, so the second run that finds a host down reports it, and a
 * dispatch or a hand run mid-week never promotes a fresh outage.
 */
export const OUTAGE_GRACE_DAYS = 6;

export type Outages = Record<string, string>;

/**
 * Splits this run's outages into the ones that have lasted long enough to
 * report and the record to carry to the next run. A link that answers again is
 * dropped from the record, so a later outage starts its own clock.
 */
export function carryOutages(
  outages: LinkResult[],
  previous: Outages,
  today: string,
): { report: LinkResult[]; next: Outages } {
  const next: Outages = {};
  const report: LinkResult[] = [];
  for (const r of [...outages].sort((a, b) => a.url.localeCompare(b.url))) {
    const since = previous[r.url] ?? today;
    next[r.url] = since;
    const days = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${since}T00:00:00Z`)) / 86_400_000;
    if (days >= OUTAGE_GRACE_DAYS) report.push({ ...r, downSince: since });
  }
  return { report, next };
}

function readOutages(path: string): Outages {
  let text: string;
  try {
    text = readFileSync(path, "utf-8");
  } catch (err) {
    // First run with an outage file: nothing has been seen down yet.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
  return JSON.parse(text) as Outages;
}

/** undici reports every network failure as "fetch failed"; the cause says which. */
function describeError(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const code = (err.cause as { code?: unknown } | undefined)?.code;
  return typeof code === "string" ? `${err.message} (${code})` : err.message;
}

/** True when a redirect changed more than the trailing slash or the scheme. */
export function isMeaningfulRedirect(from: string, to: string): boolean {
  try {
    const a = new URL(from);
    const b = new URL(to);
    if (INTERSTITIAL.some((re) => re.test(b.hostname) || re.test(to))) return false;
    const hostA = a.hostname.replace(/^www\./, "");
    const hostB = b.hostname.replace(/^www\./, "");
    const pathA = a.pathname.replace(/\/$/, "");
    const pathB = b.pathname.replace(/\/$/, "");
    // A bare domain redirecting into one of its own subdomains, same path, is
    // a site-internal rollover, not a link to update: automl.cc sends you to
    // the current year's edition and will do so again next year. Reporting it
    // weekly would pin the drift issue open forever over nothing.
    if (hostB.endsWith(`.${hostA}`) && pathA === pathB) return false;
    if (hostA !== hostB) return true;
    // Same rollover one level down: huggingface.co/papers lands on
    // /papers/date/<today>. A page forwarding into its own subtree is still
    // the address to link, and the destination changes every day.
    if (pathA !== "" && pathB.startsWith(`${pathA}/`)) return false;
    return pathA !== pathB;
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
    return { url, where, status: null, finalUrl: null, error: describeError(err) };
  } finally {
    clearTimeout(timer);
    // Only the status is wanted. A body left unread holds its connection, and
    // the process with it, until undici's 300s body timeout.
    controller.abort();
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
      // Without a url the entry links to its repo, which the weekly metadata
      // fetch covers. A url is what the entry renders, so it is probed either way.
      if (!entry.url) continue;
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
  const isRot = (r: LinkResult): boolean => (r.status === null || r.status >= 400) && !isThrottled(r.status);
  const unwalled = judgeable.filter(isRot).filter((r) => !isBotWalled(r.url));
  let broken = unwalled;
  if (opts.outagesPath) {
    const today = opts.today ?? new Date().toISOString().slice(0, 10);
    const { report, next } = carryOutages(unwalled.filter(isOutage), readOutages(opts.outagesPath), today);
    const held = Object.keys(next).filter((url) => !report.some((r) => r.url === url));
    if (held.length > 0) {
      logger.warn(
        `${held.length} URL(s) unreachable for less than a week, reported if still down next run: ${held.map((u) => `${u} (since ${next[u]})`).join(", ")}`,
      );
    }
    writeFileSync(opts.outagesPath, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
    broken = [...unwalled.filter((r) => !isOutage(r)), ...report];
  }
  const walled = judgeable.filter((r) => isRot(r) && isBotWalled(r.url));
  const throttled = judgeable.filter((r) => isThrottled(r.status));
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
  if (throttled.length > 0) {
    logger.info(
      `${throttled.length} URL(s) rate-limited us, which says nothing: ${throttled.map((r) => r.url).join(", ")}`,
    );
  }
  for (const r of broken) {
    logger.error(`${label(r)}: ${r.url} -> ${r.error ?? `HTTP ${r.status}`} (${r.where})`);
  }
  if (unwalled.length === 0) {
    logger.info(`All ${targets.length} URLs resolved.`);
  } else if (broken.length === 0) {
    logger.info(`No URL has been down long enough to report.`);
  } else {
    logger.error(`${broken.length} of ${targets.length} URLs are unreachable.`);
  }

  emitReport(renderLinkReport(broken, moved), opts.reportPath);

  return broken.length;
}

function label(r: LinkResult): string {
  return r.downSince ? `unreachable since ${r.downSince}` : "dead";
}

/** The link check's section of the weekly drift issue. Empty when every link is healthy. */
export function renderLinkReport(broken: LinkResult[], moved: LinkResult[]): string {
  if (broken.length === 0 && moved.length === 0) return "";
  const lines: string[] = [`### Link rot (${broken.length + moved.length})`, ""];
  for (const r of broken) {
    lines.push(`- **${label(r)}** \`${r.url}\` -> ${r.error ?? `HTTP ${r.status}`} (${r.where})`);
  }
  for (const r of moved) {
    lines.push(`- **moved** \`${r.url}\` -> \`${r.finalUrl}\` (${r.where})`);
  }
  lines.push("");
  return lines.join("\n");
}

export function defaultCheckLinksOptions(root: string): CheckLinksOptions {
  return {
    projectsYamlPath: resolve(root, "projects.yaml"),
    templatePaths: [resolve(root, "templates/header.md"), resolve(root, "templates/footer.md")],
  };
}
