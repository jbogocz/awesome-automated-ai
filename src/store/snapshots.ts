import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Measured star history: one JSON line per repository per run, in one file
 * per year (data/snapshots/2026.jsonl).
 *
 * This replaced a committed SQLite database. Text keeps every weekly change
 * reviewable in a diff — including the one change the publish job copies out
 * of the job that runs third-party code — and needs no native module. The
 * volume does not call for a database: 269 repos add about 16 KB a week.
 *
 * Rows are keyed by GitHub's immutable repository id, not the slug, so a
 * rename or transfer keeps its history. Only live measurements are written
 * here; nothing is reconstructed, interpolated or imputed, because the
 * sparkline plots these points verbatim.
 */

export interface StarSnapshot {
  date: string;
  id: number;
  repo: string;
  stars: number;
}

export interface StarPoint {
  date: string;
  stars: number;
}

const yearOf = (date: string) => date.slice(0, 4);

export function loadSnapshots(dir: string): StarSnapshot[] {
  if (!existsSync(dir)) return [];
  const rows: StarSnapshot[] = [];
  for (const file of readdirSync(dir).filter((f) => /^\d{4}\.jsonl$/.test(f))) {
    for (const line of readFileSync(resolve(dir, file), "utf-8").split("\n")) {
      if (line.trim() !== "") rows.push(JSON.parse(line) as StarSnapshot);
    }
  }
  return rows;
}

/** `existing` plus `incoming`, where an incoming row replaces any row for the same repository and day. */
export function mergeSnapshots(existing: StarSnapshot[], incoming: StarSnapshot[]): StarSnapshot[] {
  const key = (r: StarSnapshot) => `${r.date}|${r.id}`;
  const replaced = new Set(incoming.map(key));
  return [...existing.filter((r) => !replaced.has(key(r))), ...incoming];
}

/** Rewrites the year files `rows` covers, sorted by date then slug so every diff is append-shaped. */
export function writeSnapshots(dir: string, rows: StarSnapshot[], years: Iterable<string>): void {
  mkdirSync(dir, { recursive: true });
  for (const year of new Set(years)) {
    const lines = rows
      .filter((r) => yearOf(r.date) === year)
      .sort((a, b) => a.date.localeCompare(b.date) || a.repo.localeCompare(b.repo) || a.id - b.id)
      .map((r) => JSON.stringify({ date: r.date, id: r.id, repo: r.repo, stars: r.stars }));
    writeFileSync(resolve(dir, `${year}.jsonl`), lines.length > 0 ? `${lines.join("\n")}\n` : "");
  }
}

/** Ascending star series per repository id. Zero counts are dropped: a 0 is a failed read, never a measurement. */
export function seriesById(rows: StarSnapshot[]): Map<number, StarPoint[]> {
  const out = new Map<number, StarPoint[]>();
  for (const r of rows) {
    if (r.stars <= 0) continue;
    const series = out.get(r.id) ?? [];
    series.push({ date: r.date, stars: r.stars });
    out.set(r.id, series);
  }
  for (const series of out.values()) series.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const dayNumber = (date: string) => Date.parse(`${date}T00:00:00Z`) / 86_400_000;

/** Newest measured stars strictly before `before` (YYYY-MM-DD). */
export function previousStars(series: StarPoint[], before: string = todayUtc()): number | null {
  for (let i = series.length - 1; i >= 0; i--) {
    const point = series[i];
    if (point && point.date < before) return point.stars;
  }
  return null;
}

/**
 * Stars at the measurement closest to `asOf - days`, with that measurement's
 * actual date. The date matters: on a weekly cadence the chosen point is
 * typically t-28, not t-30, and the published window must say so.
 *
 * Bounded to ±max(2, ceil(days/4)) days so a 14-day delta is never labelled
 * the 30-day trend; ties go to the later point.
 *
 * `asOf` is the date the current figure was measured. An entry served from an
 * older snapshot must look back from that snapshot, not from today, or its
 * "last 7d" compares a week-old count with itself.
 */
export function starsNDaysAgo(series: StarPoint[], days: number, asOf: string = todayUtc()): StarPoint | null {
  const target = shiftDays(asOf, -days);
  const tolerance = Math.max(2, Math.ceil(days / 4));
  const lo = shiftDays(target, -tolerance);
  const hi = shiftDays(target, tolerance);
  let best: StarPoint | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const point of series) {
    if (point.date < lo || point.date > hi) continue;
    const distance = Math.abs(dayNumber(point.date) - dayNumber(target));
    if (distance < bestDistance || (distance === bestDistance && best !== null && point.date > best.date)) {
      best = point;
      bestDistance = distance;
    }
  }
  return best;
}

/** Points measured within the last `days` days, oldest first. */
export function seriesSince(series: StarPoint[], days: number, today: string = todayUtc()): StarPoint[] {
  const cutoff = shiftDays(today, -days);
  return series.filter((p) => p.date >= cutoff);
}
