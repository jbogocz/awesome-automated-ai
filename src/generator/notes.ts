import { RELEASE_STALE_MONTHS, STALE_MONTHS } from "../constants.ts";
import { assessRepo, displayBucket, type StatusReason, type StatusSignals } from "../status.ts";
import type { Entry } from "../validation/projects-yaml.ts";
import type { ApiData, ApiRepoData } from "./readme.ts";
import type { TagCorpus } from "./tags.ts";

/**
 * The note an entry renders with, shared by the README and the dashboard so
 * both say the same thing.
 *
 * A curator's note is kept as written. Without one, the note states what the
 * status dot shows, and an entry that went dead also names the closest
 * maintained options in its own section. That is the resolution every dead
 * entry got by hand (TPOT, EvoPrompt, AI-Researcher, Synthetic Data Kit, ...),
 * so it is written from the data instead of filing a weekly curation finding
 * for each repo that crosses the twelve-month line.
 */

/** How many maintained alternatives a dead entry names. */
const ALTERNATIVES = 2;

function signals(rd: ApiRepoData): StatusSignals {
  return {
    archived: rd.archived,
    lastCommit: rd.lastCommit,
    lastRelease: rd.lastRelease,
    lastTag: rd.lastTag,
    lastStableTag: rd.lastStableTag,
    commits90d: rd.commits90d,
  };
}

/** The tags an entry is described by: the curator's, else the repo's topics. */
export function entryTags(entry: Entry, apiData: ApiData): string[] {
  return entry.tags && entry.tags.length > 0 ? entry.tags : (apiData[entry.repo ?? ""]?.topics ?? []);
}

/**
 * The active entries of a section closest to `self`, closest first. A section
 * is broader than one tool's job (Aim's best-scored neighbours were Apache
 * Airflow and Ray), so closeness is the shared tags, each weighted by how rare
 * it is across the catalog, so "python" counts for little and
 * "experiment-tracking" for a lot. Score breaks ties. An entry that shares no
 * tag is never named: no alternative beats a wrong one.
 */
export function maintainedAlternatives(
  self: Entry,
  entries: Entry[],
  apiData: ApiData,
  corpus: TagCorpus,
  now: number = Date.now(),
): string[] {
  const mine = new Set(entryTags(self, apiData));
  const weight = (tag: string): number => Math.log(corpus.entryCount / (corpus.count.get(tag) ?? 1));
  return entries
    .filter((e) => e.name !== self.name && e.repo && apiData[e.repo])
    .map((e) => ({ e, rd: apiData[e.repo ?? ""] as ApiRepoData }))
    .filter(({ e, rd }) => {
      const { status } = assessRepo(signals(rd), now);
      return status === "active" && displayBucket(status, e.lifecycle) === "live";
    })
    .map(({ e, rd }) => ({
      e,
      score: rd.score,
      closeness: entryTags(e, apiData)
        .filter((t) => mine.has(t))
        .reduce((sum, t) => sum + weight(t), 0),
    }))
    .filter((c) => c.closeness > 0)
    .sort((a, b) => b.closeness - a.closeness || b.score - a.score)
    .slice(0, ALTERNATIVES)
    .map(({ e }) => e.name);
}

/** What the status dot shows, in words; one line per rule leg. */
function statusNote(reason: StatusReason | null): string {
  switch (reason) {
    case "stale":
    case "no-signals":
      return `Unmaintained - no commit on the default branch, release or tag for ${STALE_MONTHS}+ months.`;
    case "shipping-stalled":
      return `No stable release for ${RELEASE_STALE_MONTHS}+ months.`;
    case "aging":
      return "Quiet - no commits for 6+ months.";
    case "coasting":
      return "Quiet - minimal recent development.";
    default:
      return "";
  }
}

function joinNames(names: string[]): string {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** `rd` is undefined for an entry the last fetch has no data for. */
export function entryNote(
  entry: Entry,
  rd: ApiRepoData | undefined,
  alternatives: string[],
  now: number = Date.now(),
): string {
  const note = entry.note ?? "";
  if (rd?.archived && !note.includes("Archived")) return `Archived. ${note}`.trim();
  if (note || !rd) return note;
  const { reason } = assessRepo(signals(rd), now);
  const base = statusNote(reason);
  const dead = reason === "stale" || reason === "no-signals";
  if (!dead || alternatives.length === 0) return base;
  return `${base} Maintained in this section: ${joinNames(alternatives)}.`;
}
