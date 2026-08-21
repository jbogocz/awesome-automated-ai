import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { MIN_FRESH_RATIO } from "../constants.js";
import { DB } from "../db/client.js";
import { fetchRepoMetadataBatch } from "../github/repo-metadata-graphql.js";
import { repoStatus } from "../status.js";
import { logger } from "../utils/logger.js";

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
  kind: "renamed" | "archived" | "dead-no-note" | "stale-note" | "unreachable";
  entry: string;
  detail: string;
}

export interface AuditOptions {
  projectsYamlPath: string;
  dbPath: string;
}

interface YamlEntry {
  name: string;
  repo?: string;
  note?: string;
  lifecycle?: string;
}

/** Notes asserting a year, which the unattended regeneration cannot keep true. */
export function noteCitesYear(note: string | undefined): string | null {
  const m = note?.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : null;
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

  const db = new DB(opts.dbPath);
  try {
    db.migrate();
    for (const { category, entry } of repoEntries) {
      const repo = entry.repo;
      const meta = repo ? metadata.get(repo) : undefined;
      if (!repo || !meta) continue;
      const where = `${category} / ${entry.name}`;

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
      if (meta.archived && !entry.note && !entry.lifecycle) {
        findings.push({
          kind: "archived",
          entry: where,
          detail: `${repo} is archived upstream and the entry does not say so`,
        });
      }

      const status = repoStatus({
        archived: meta.archived,
        lastCommit: meta.lastCommit,
        lastRelease: meta.lastRelease,
        lastTag: meta.lastTag,
        lastStableTag: meta.lastStableTag,
        commits90d: meta.commits90d,
      });
      if (status === "dead" && !entry.note && !entry.lifecycle) {
        findings.push({
          kind: "dead-no-note",
          entry: where,
          detail: `${repo} renders dead but the text still reads like a recommendation, with no successor named`,
        });
      }
    }
  } finally {
    db.close();
  }

  return findings;
}

/** Markdown body for the tracking issue; empty string when nothing drifted. */
export function renderAuditReport(findings: AuditFinding[]): string {
  if (findings.length === 0) return "";

  const titles: Record<AuditFinding["kind"], string> = {
    // First, so a run that could not see the catalog says so before anything
    // it did manage to check is read as the whole picture.
    unreachable: "Audit could not reach GitHub - results incomplete",
    renamed: "Renamed or transferred upstream",
    archived: "Archived upstream",
    "dead-no-note": "Dead with no successor named",
    "stale-note": "Note asserts a hard-coded year",
  };

  const lines = [
    "The weekly regeneration refreshes metadata but never adds, retires or re-slugs an entry.",
    "These need a curation decision:",
    "",
  ];
  for (const kind of Object.keys(titles) as AuditFinding["kind"][]) {
    const group = findings.filter((f) => f.kind === kind);
    if (group.length === 0) continue;
    lines.push(`### ${titles[kind]} (${group.length})`, "");
    for (const f of group) lines.push(`- **${f.entry}** — ${f.detail}`);
    lines.push("");
  }
  lines.push(
    "<sub>Generated by `pnpm run audit`. Closing this issue is safe; the next run reopens it if the drift remains.</sub>",
  );
  return lines.join("\n");
}

export function defaultAuditOptions(root: string): AuditOptions {
  return { projectsYamlPath: resolve(root, "projects.yaml"), dbPath: resolve(root, "data/curator.db") };
}
