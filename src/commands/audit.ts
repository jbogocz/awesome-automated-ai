import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { MIN_FRESH_RATIO } from "../constants.ts";
import { fetchRepoMetadataBatch, type RepoMetadata } from "../github/repo-metadata-graphql.ts";
import { fetchStarHistory, starsGivenBetween } from "../github/star-history.ts";
import { repoStatus } from "../status.ts";
import { findLatest, loadLatest } from "../store/latest.ts";
import { type DataPaths, defaultDataPaths } from "../store/paths.ts";
import { loadSnapshots, seriesById, starsNDaysAgo } from "../store/snapshots.ts";
import { logger } from "../utils/logger.ts";
import { yearsCitedIn } from "../validation/projects-yaml.ts";

/**
 * Reports catalog drift the weekly regeneration cannot fix by itself.
 *
 * `generate` refreshes metadata; it never adds, retires or re-slugs an entry.
 * So eighteen consecutive green runs sailed past nine upstream renames, three
 * wound-down projects, twenty-three dead entries with no successor note and a
 * 404 in the footer — none of which any job was looking for. This looks for
 * exactly those, and writes a report the workflow turns into one tracking
 * issue. It changes nothing and fails nothing.
 */

export interface AuditFinding {
  kind: "renamed" | "archived" | "dead-no-note" | "stale-note" | "unreachable" | "unfetchable" | "star-history";
  entry: string;
  detail: string;
}

export interface AuditOptions {
  projectsYamlPath: string;
  paths: DataPaths;
}

interface YamlEntry {
  name: string;
  repo?: string;
  note?: string;
  lifecycle?: string;
}

/**
 * Two missed weekly runs. One miss is a blip the generate fallback already
 * covers; a second means the entry has stopped refreshing and needs a look.
 */
export const UNFETCHABLE_DAYS = 14;

/**
 * Why a repo-backed entry has stopped refreshing, judged from data/latest.json:
 * never measured, or not in the last UNFETCHABLE_DAYS. Null when it is current.
 */
export function unfetchableDetail(repo: string, latestSnapshot: string | null, now: Date = new Date()): string | null {
  if (!latestSnapshot) return `${repo} has never been fetched successfully; it renders as "stats pending"`;
  const ageDays = Math.floor((now.getTime() - Date.parse(`${latestSnapshot}T00:00:00Z`)) / 86_400_000);
  if (ageDays <= UNFETCHABLE_DAYS) return null;
  return `${repo} last refreshed ${latestSnapshot} (${ageDays} days ago); every run since served that snapshot`;
}

/**
 * Slack for GitHub's day boundaries, which it does not promise to align with
 * UTC: a few stars, or 2% of a busy window.
 */
function starHistoryTolerance(given: number): number {
  return Math.max(3, Math.ceil(given * 0.02));
}

/**
 * Our measured net change over a window cannot exceed the stars GitHub
 * records as given in it: removals only ever pull the net figure down. A
 * repo above that bound means our own measurements are wrong somewhere —
 * the failure that went unnoticed for a month in July 2026, when fabricated
 * history was published as measured.
 */
export function starHistoryFinding(
  where: string,
  repo: string,
  window: { from: string; to: string; net: number },
  given: number,
): AuditFinding | null {
  if (window.net <= given + starHistoryTolerance(given)) return null;
  return {
    kind: "star-history",
    entry: where,
    detail:
      `${repo} measured +${window.net} stars from ${window.from} to ${window.to}, but GitHub records only ` +
      `${given} given in that window; our snapshots for it cannot be right`,
  };
}

/** Notes asserting a year, which the unattended regeneration cannot keep true. */
export function noteCitesYear(note: string | undefined): string | null {
  return yearsCitedIn(note)[0] ?? null;
}

/** What a repo-backed entry's live metadata says needs a curation decision. */
export function metadataFindings(
  where: string,
  repo: string,
  entry: Pick<YamlEntry, "note" | "lifecycle">,
  meta: RepoMetadata,
  now: number = Date.now(),
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (meta.nameWithOwner && meta.nameWithOwner !== repo) {
    findings.push({
      kind: "renamed",
      entry: where,
      detail: `${repo} -> ${meta.nameWithOwner} (the old slug only resolves through a redirect)`,
    });
  }

  // Only when the entry does not already say so — an archived repo whose
  // note explains it needs no decision, and reporting it every week would
  // train the reader to ignore the issue.
  if (entry.note || entry.lifecycle) return findings;

  // An archived repo is dead by definition and one note answers both, so it
  // is filed once. Listing it under both headings counted one decision twice.
  if (meta.archived) {
    findings.push({
      kind: "archived",
      entry: where,
      detail: `${repo} is archived upstream and the entry does not say so`,
    });
    return findings;
  }

  const status = repoStatus(
    {
      archived: meta.archived,
      lastCommit: meta.lastCommit,
      lastRelease: meta.lastRelease,
      lastTag: meta.lastTag,
      lastStableTag: meta.lastStableTag,
      commits90d: meta.commits90d,
    },
    now,
  );
  if (status === "dead") {
    findings.push({
      kind: "dead-no-note",
      entry: where,
      detail: `${repo} renders dead but the text still reads like a recommendation, with no successor named`,
    });
  }
  return findings;
}

export async function runAuditCommand(opts: AuditOptions): Promise<AuditFinding[]> {
  const doc = parseYaml(readFileSync(opts.projectsYamlPath, "utf-8")) as {
    categories: { name: string; entries?: YamlEntry[] }[];
  };
  const entries: { category: string; entry: YamlEntry }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) entries.push({ category: cat.name, entry });
  }
  const repoEntries = entries.filter((e) => e.entry.repo);
  logger.info(`Auditing ${entries.length} entries (${repoEntries.length} repo-backed) for drift...`);

  const findings: AuditFinding[] = [];

  // Hand-written notes that cite a year. Checked without any network access.
  for (const { category, entry } of entries) {
    const year = noteCitesYear(entry.note);
    if (year) {
      findings.push({
        kind: "stale-note",
        entry: `${category} / ${entry.name}`,
        detail: `note cites ${year}; the weekly regeneration cannot keep a hard-coded date true`,
      });
    }
  }

  const metadata = await fetchRepoMetadataBatch(repoEntries.map((e) => e.entry.repo as string));

  // fetchRepoMetadataBatch logs chunk failures and returns whatever it got, so
  // a run in which every GitHub call failed produces an empty map, zero
  // findings and an empty report — which the weekly job reads as "nothing
  // drifted". That is the same mistake that let star-history reconstruction
  // publish an empty API response as fact, so it gets the same treatment:
  // below MIN_FRESH_RATIO coverage the audit reports that it does not know.
  const coverage = repoEntries.length > 0 ? metadata.size / repoEntries.length : 1;
  if (coverage < MIN_FRESH_RATIO) {
    findings.push({
      kind: "unreachable",
      entry: "(audit)",
      detail:
        `reached only ${metadata.size}/${repoEntries.length} repos ` +
        `(${Math.round(coverage * 100)}%); drift status is UNKNOWN for this run, not clean`,
    });
    logger.error(`Audit coverage ${metadata.size}/${repoEntries.length} is below the ${MIN_FRESH_RATIO} gate`);
  }

  const latest = loadLatest(opts.paths.latestPath);
  for (const { category, entry } of repoEntries) {
    const repo = entry.repo;
    if (!repo) continue;
    const where = `${category} / ${entry.name}`;

    // Checked from the last measurement, before the live-metadata guard
    // below: an entry whose fetch fails every week has no metadata here
    // either, and used to be skipped without a word while the site served
    // its old figures.
    const unfetchable = unfetchableDetail(repo, findLatest(latest, repo)?.date ?? null);
    if (unfetchable) findings.push({ kind: "unfetchable", entry: where, detail: unfetchable });

    const meta = metadata.get(repo);
    if (meta) findings.push(...metadataFindings(where, repo, entry, meta));
  }

  findings.push(...(await crossCheckStarHistory(repoEntries, latest, opts.paths)));
  return findings;
}

const STAR_HISTORY_CONCURRENCY = 8;

/**
 * Every repo with a measured 30-day window, checked against GitHub's own star
 * history. One REST call per repo; the token in Actions allows 1,000 an hour,
 * which covers about three times today's list.
 */
async function crossCheckStarHistory(
  repoEntries: { category: string; entry: YamlEntry }[],
  latest: ReturnType<typeof loadLatest>,
  paths: DataPaths,
): Promise<AuditFinding[]> {
  const seriesByRepoId = seriesById(loadSnapshots(paths.snapshotsDir));
  const checks: { where: string; repo: string; window: { from: string; to: string; net: number } }[] = [];
  const seen = new Set<string>();
  for (const { category, entry } of repoEntries) {
    const repo = entry.repo as string;
    const last = findLatest(latest, repo);
    if (!last || seen.has(repo)) continue;
    seen.add(repo);
    const start = starsNDaysAgo(seriesByRepoId.get(last.id) ?? [], 30, last.date);
    if (!start) continue;
    checks.push({
      where: `${category} / ${entry.name}`,
      repo,
      window: { from: start.date, to: last.date, net: last.stars - start.stars },
    });
  }

  const findings: AuditFinding[] = [];
  let failures = 0;
  let next = 0;
  const worker = async () => {
    while (next < checks.length) {
      const check = checks[next++];
      if (!check) break;
      try {
        const given = starsGivenBetween(await fetchStarHistory(check.repo), check.window.from, check.window.to);
        const finding = starHistoryFinding(check.where, check.repo, check.window, given);
        if (finding) findings.push(finding);
      } catch (err) {
        failures++;
        logger.warn(`Star history for ${check.repo} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };
  await Promise.all(Array.from({ length: STAR_HISTORY_CONCURRENCY }, worker));

  // GitHub may withdraw or change the endpoint. Our trends do not depend on
  // it, but the check silently not running must not read as a clean pass.
  if (checks.length > 0 && failures / checks.length > 1 - MIN_FRESH_RATIO) {
    findings.push({
      kind: "star-history",
      entry: "(audit)",
      detail:
        `GitHub's star-history endpoint failed for ${failures}/${checks.length} repos; ` +
        "the cross-check of our measurements is UNKNOWN for this run, not clean",
    });
  }
  logger.info(`Star history cross-checked ${checks.length - failures}/${checks.length} repos`);
  return findings.sort((a, b) => a.entry.localeCompare(b.entry));
}

/**
 * The audit's sections of the drift report; empty string when nothing
 * drifted. The issue's intro and footer are added by the workflow, once
 * around every reporter's sections: rendered here, the footer landed above
 * the link-rot section and credited `pnpm run audit` with it.
 */
export function renderAuditReport(findings: AuditFinding[]): string {
  if (findings.length === 0) return "";

  const titles: Record<AuditFinding["kind"], string> = {
    // First, so a run that could not see the catalog says so before anything
    // it did manage to check is read as the whole picture.
    unreachable: "Audit could not reach GitHub - results incomplete",
    unfetchable: `Not refreshed in ${UNFETCHABLE_DAYS}+ days - fetch keeps failing`,
    renamed: "Renamed or transferred upstream",
    archived: "Archived upstream",
    "dead-no-note": "Dead with no successor named",
    "stale-note": "Note asserts a hard-coded year",
    "star-history": "Our star counts disagree with GitHub's star history",
  };

  const lines: string[] = [];
  for (const kind of Object.keys(titles) as AuditFinding["kind"][]) {
    const group = findings.filter((f) => f.kind === kind);
    if (group.length === 0) continue;
    lines.push(`### ${titles[kind]} (${group.length})`, "");
    for (const f of group) lines.push(`- **${f.entry}** — ${f.detail}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function defaultAuditOptions(root: string): AuditOptions {
  return { projectsYamlPath: resolve(root, "projects.yaml"), paths: defaultDataPaths() };
}
