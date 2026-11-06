import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * The last live measurement of every listed repository (data/latest.json),
 * keyed by slug. It is what a run serves when a repo's fetch fails, what
 * `generate --no-fetch` renders from, and what validate and the audit judge
 * health and staleness by.
 *
 * `date` is the day the figures were measured. A repo whose fetch failed
 * keeps its previous entry, date included, so its age stays visible.
 */
export interface LatestRepo {
  date: string;
  id: number;
  stars: number;
  score: number;
  archived: boolean;
  pushed: string;
  license: string | null;
  topics: string[];
  lastRelease: string | null;
  lastCommit: string | null;
  lastTag: string | null;
  lastStableTag: string | null;
  commits90d: number | null;
}

export type LatestState = Record<string, LatestRepo>;

export function loadLatest(path: string): LatestState {
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf-8")) as LatestState) : {};
}

/** Sorted by slug, so a week's diff shows only the repositories that changed. */
export function saveLatest(path: string, state: LatestState): void {
  const sorted = Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`);
}

/** Slug lookup ignoring case, because GitHub slugs do: e2b-dev/e2b and e2b-dev/E2B are one repository. */
export function findLatest(state: LatestState, repo: string): LatestRepo | undefined {
  const exact = state[repo];
  if (exact) return exact;
  const lower = repo.toLowerCase();
  for (const [slug, entry] of Object.entries(state)) {
    if (slug.toLowerCase() === lower) return entry;
  }
  return undefined;
}

/**
 * The last full run's date: the day most entries were measured, the newer day
 * on a tie. Not simply the newest date, because a repo listed between weekly
 * runs is measured on its own, and that day would make every other entry look
 * like a failed refresh. A run publishes only with most of the list fresh
 * (MIN_FRESH_RATIO), so its date holds the majority.
 */
export function lastRunDate(state: LatestState): string | null {
  const counts = new Map<string, number>();
  for (const { date } of Object.values(state)) counts.set(date, (counts.get(date) ?? 0) + 1);
  let best: string | null = null;
  let bestCount = 0;
  for (const [date, count] of counts) {
    if (count > bestCount || (count === bestCount && best !== null && date > best)) {
      best = date;
      bestCount = count;
    }
  }
  return best;
}
