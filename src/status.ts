import { MAINTAINED_DAYS, PULSE_MIN_COMMITS, RELEASE_STALE_DAYS, SHIPPED_FRESH_DAYS, STALE_DAYS } from "./constants.js";

/**
 * Single source of truth for repository health status.
 *
 * Consumed by the README generator (dot colour + notes) and baked into
 * docs/data.json as a precomputed `status` field that docs/lib.js reads
 * verbatim. Nothing else may reimplement this rule — the July 2026
 * README/site drift came from two hand-synced copies of it.
 *
 * The rule (commit window modelled on OpenSSF Scorecard's 90-day
 * "Maintained" check):
 *   dead   — archived, or newest life sign (mainline commit, release or
 *            tag) is 12+ months old
 *   quiet  — life sign 6-12 months old; OR ships releases/tags but the
 *            newest is 2+ years old; OR coasting: under 3 mainline
 *            commits in 90 days with nothing shipped in 6 months
 *   active — recent mainline work AND healthy shipping
 *
 * Why not pushedAt: it updates on pushes to ANY branch (bots, PR heads) —
 * in the July 2026 audit 8 of 249 listed repos looked alive on pushes
 * alone while their mainline had been dormant for 200-1200 days.
 * Why tags count as shipping: GitHub Releases alone is unreliable — e.g.
 * PyCaret cut v4.0.0a2 tags and PyPI uploads in 2026 while its Releases
 * feed sat at Apr 2024.
 */

export type RepoStatus = "active" | "quiet" | "dead";

export type StatusReason =
  | "archived" // repo is archived on GitHub
  | "no-signals" // no commit, release or tag date available
  | "stale" // newest life sign 12+ months old
  | "aging" // newest life sign 6-12 months old
  | "shipping-stalled" // ships releases/tags, but newest is 2+ years old
  | "coasting"; // fresh-ish mainline but <3 commits/90d and no recent ship

export interface StatusSignals {
  archived: boolean;
  /** Default-branch HEAD commit date (ISO). */
  lastCommit: string | null | undefined;
  /** Latest GitHub release publishedAt (ISO). */
  lastRelease: string | null | undefined;
  /** Newest tag's commit/tagger date (ISO). */
  lastTag: string | null | undefined;
  /** Commits on the default branch in the last 90 days; null = unknown
   * (pre-migration snapshot) — the pulse check is skipped, never guessed. */
  commits90d: number | null | undefined;
}

const DAY_MS = 86_400_000;

function isDate(d: string | null | undefined): d is string {
  return typeof d === "string" && d.length > 0 && !Number.isNaN(new Date(d).getTime());
}

/** ISO-8601 sorts lexicographically, so max string = newest timestamp. */
function newest(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter(isDate);
  return valid.length > 0 ? valid.reduce((a, b) => (a > b ? a : b)) : null;
}

/** Newest shipping signal — release or tag. Null when the repo ships neither. */
export function shippedAt(s: StatusSignals): string | null {
  return newest([s.lastRelease, s.lastTag]);
}

/** Newest life sign of any kind — mainline commit, release or tag. */
export function lastLifeSign(s: StatusSignals): string | null {
  return newest([s.lastCommit, shippedAt(s)]);
}

export function assessRepo(
  s: StatusSignals,
  now: number = Date.now(),
): { status: RepoStatus; reason: StatusReason | null } {
  if (s.archived) return { status: "dead", reason: "archived" };

  const life = lastLifeSign(s);
  if (!life) return { status: "dead", reason: "no-signals" };
  const lifeDays = (now - new Date(life).getTime()) / DAY_MS;
  if (lifeDays >= STALE_DAYS) return { status: "dead", reason: "stale" };
  if (lifeDays >= MAINTAINED_DAYS) return { status: "quiet", reason: "aging" };

  const shipped = shippedAt(s);
  const shippedDays = shipped ? (now - new Date(shipped).getTime()) / DAY_MS : null;
  if (shippedDays !== null && shippedDays >= RELEASE_STALE_DAYS) {
    return { status: "quiet", reason: "shipping-stalled" };
  }

  const shippedRecently = shippedDays !== null && shippedDays < SHIPPED_FRESH_DAYS;
  if (typeof s.commits90d === "number" && s.commits90d < PULSE_MIN_COMMITS && !shippedRecently) {
    return { status: "quiet", reason: "coasting" };
  }

  return { status: "active", reason: null };
}

export function repoStatus(s: StatusSignals, now: number = Date.now()): RepoStatus {
  return assessRepo(s, now).status;
}

export const STATUS_DOT: Record<RepoStatus, string> = {
  active: "\u{1F7E2}", // green
  quiet: "\u{1F7E1}", // yellow
  dead: "\u{1F534}", // red
};

export function statusDot(s: StatusSignals, now?: number): string {
  return STATUS_DOT[repoStatus(s, now ?? Date.now())];
}
