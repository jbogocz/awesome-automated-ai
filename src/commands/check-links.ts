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

/** Per request, so a slow HEAD does not eat the GET fallback's time. */
const TIMEOUT_MS = 25_000;
const CONCURRENCY = 8;
/** Pause before asking a failing link once more within the same run. */
const RETRY_DELAY_MS = 30_000;

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
  /** Pause before the in-run retry of links that got no answer or a 5xx. */
  retryDelayMs?: number;
}

/** Every http(s) URL in a markdown file, with duplicates collapsed. */
export function extractUrls(text: string): string[] {
  const found = text.match(/https?:\/\/[^\s)"'<>\]]+/g) ?? [];
  // Trailing punctuation belongs to the prose, not the URL.
  return [...new Set(found.map((u) => u.replace(/[.,;:]+$/, "")))];
}

/**
 * A refusal says the host will not serve this client, not that the page is
 * gone; a page that is gone answers 404 or 410. devin.ai answered 429 to every
 * datacenter client and was reported dead for weeks while the site was up;
 * OUP, ACM, ScienceDirect and IEEE answer 403 to any non-browser client; and
 * www.ibm.com answers 403 to curl but 200 to Node's fetch for the same URL,
 * so a host list can never keep up with which client a wall lets through.
 */
export function isRefused(status: number | null): boolean {
  return status === 401 || status === 403 || status === 429 || status === 451;
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

/** One request with its own deadline. The body is never read, only the status. */
async function request(url: string, method: "HEAD" | "GET"): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { "user-agent": USER_AGENT };
    if (method === "GET") headers.range = "bytes=0-2048";
    return await fetch(url, { method, redirect: "follow", signal: controller.signal, headers });
  } finally {
    clearTimeout(timer);
    // Only the status is wanted. A body left unread holds its connection, and
    // the process with it, until undici's 300s body timeout.
    controller.abort();
  }
}

async function probe(url: string, where: string): Promise<LinkResult> {
  try {
    // HEAD first; hosts that reject it or answer it differently from a page
    // view get a ranged GET rather than a whole page pulled.
    let res = await request(url, "HEAD");
    if (res.status >= 400) res = await request(url, "GET");
    return { url, where, status: res.status, finalUrl: res.url };
  } catch (err) {
    return { url, where, status: null, finalUrl: null, error: describeError(err) };
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

  const first = await mapLimit(targets, CONCURRENCY, (t) => probe(t.url, t.where));
  // A healthy host misses a request now and then (www.openml.org timed out
  // once in three runs and answered in 185 ms otherwise), so anything that got
  // no answer or a 5xx is asked once more before it counts as down.
  const failing = first.filter(isOutage);
  let results = first;
  if (failing.length > 0) {
    await new Promise((done) => setTimeout(done, opts.retryDelayMs ?? RETRY_DELAY_MS));
    const again = new Map((await mapLimit(failing, CONCURRENCY, (r) => probe(r.url, r.where))).map((r) => [r.url, r]));
    results = first.map((r) => again.get(r.url) ?? r);
  }

  const judgeable = results.filter((r) => !NOT_JUDGEABLE.some((re) => re.test(r.url)));
  const isRot = (r: LinkResult): boolean => (r.status === null || r.status >= 400) && !isRefused(r.status);
  const rot = judgeable.filter(isRot);
  let broken = rot;
  if (opts.outagesPath) {
    const today = opts.today ?? new Date().toISOString().slice(0, 10);
    const { report, next } = carryOutages(rot.filter(isOutage), readOutages(opts.outagesPath), today);
    const held = Object.keys(next).filter((url) => !report.some((r) => r.url === url));
    if (held.length > 0) {
      logger.warn(
        `${held.length} URL(s) unreachable for less than a week, reported if still down next run: ${held.map((u) => `${u} (since ${next[u]})`).join(", ")}`,
      );
    }
    writeFileSync(opts.outagesPath, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
    broken = [...rot.filter((r) => !isOutage(r)), ...report];
  }
  const refused = judgeable.filter((r) => isRefused(r.status));
  const moved = opts.reportRedirects
    ? judgeable.filter(
        (r) => r.status !== null && r.status < 400 && r.finalUrl && isMeaningfulRedirect(r.url, r.finalUrl),
      )
    : [];

  for (const r of moved) {
    logger.warn(`moved: ${r.url} -> ${r.finalUrl} (${r.where})`);
  }
  if (refused.length > 0) {
    logger.info(
      `${refused.length} URL(s) refused this client, which says nothing about the page: ${refused.map((r) => `${r.url} (HTTP ${r.status})`).join(", ")}`,
    );
  }
  for (const r of broken) {
    logger.error(`${label(r)}: ${r.url} -> ${r.error ?? `HTTP ${r.status}`} (${r.where})`);
  }
  if (rot.length === 0) {
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
