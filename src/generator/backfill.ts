import type { DB } from "../db/client.js";
import { fetchRecentStargazersBatch } from "../github/stargazers-graphql.js";
import { fetchRecentStargazersRest } from "../github/stargazers-rest.js";
import type { BackfillInput, BackfillSummary, RepoStargazersPage, StargazerEntry } from "../github/types.js";

export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  stars: number;
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function endOfDayUtc(dateKey: string): Date {
  return new Date(`${dateKey}T23:59:59.999Z`);
}

/**
 * Reconstructs historical star counts for each of the 30 days ending yesterday (UTC).
 *
 * Given the current star count and a list of stargazers within the last 30 days,
 * subtracts stargazers added after the end of each day to infer that day's count.
 *
 * Semantics:
 * - `today` is interpreted via its UTC components (`getUTCFullYear/Month/Date`).
 *   Callers on non-UTC clocks passing `new Date()` may see a window shifted by ±1 day
 *   near local midnight. Pass a UTC-midnight Date if calendar-aligned output is needed.
 * - Output rows cover `today - 30 days` (inclusive) through `today - 1 day` (inclusive).
 * - A stargazer with `starredAt` exactly equal to `endOfDay(D)` is treated as same-day
 *   (strict `>` comparator): counted as present by end of D, not "after" D.
 * - Output is sorted by `date` ascending.
 * - Pure function: does not mutate inputs, performs no I/O.
 */
export function computeDailySnapshots(
  stargazers: StargazerEntry[],
  currentStars: number,
  today: Date,
): DailySnapshot[] {
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const rows: DailySnapshot[] = [];
  const starredDates = stargazers.map((s) => new Date(s.starredAt));

  for (let daysAgo = 30; daysAgo >= 1; daysAgo--) {
    const day = new Date(todayUtc);
    day.setUTCDate(day.getUTCDate() - daysAgo);
    const dateKey = toDateKey(day);
    const end = endOfDayUtc(dateKey);
    const starsAfter = starredDates.reduce((n, s) => (s > end ? n + 1 : n), 0);
    rows.push({ date: dateKey, stars: currentStars - starsAfter });
  }
  return rows;
}

export interface BackfillOptions {
  today?: Date;
  batchSize?: number;
  resumeRunId?: number;
}

function bumpReason(reasons: Record<string, number>, key: string): void {
  reasons[key] = (reasons[key] ?? 0) + 1;
}

function persistSnapshots(
  db: DB,
  projectId: number,
  page: RepoStargazersPage,
  currentStars: number,
  today: Date,
): void {
  const rows = computeDailySnapshots(page.stargazers, currentStars, today);
  const raw = db as unknown as {
    sqlite: { prepare: (s: string) => { run: (...args: unknown[]) => void } };
  };
  const stmt = raw.sqlite.prepare(
    "INSERT OR IGNORE INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, NULL)",
  );
  for (const row of rows) {
    stmt.run(projectId, row.date, row.stars);
  }
}

export async function backfillBatch(
  inputs: BackfillInput[],
  db: DB,
  options: BackfillOptions = {},
): Promise<BackfillSummary> {
  const today = options.today ?? new Date();
  const since = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  since.setUTCDate(since.getUTCDate() - 30);

  const batchSize = options.batchSize ?? 20;
  const reasons: Record<string, number> = {};
  let ok = 0;
  let skipped = 0;
  let pointsUsed = 0;

  let runId: number;
  let toProcess: BackfillInput[];
  if (options.resumeRunId) {
    runId = options.resumeRunId;
    const pendingIds = new Set(db.getBackfillPending(runId));
    toProcess = inputs.filter((i) => pendingIds.has(i.projectId));
  } else {
    runId = db.startBackfillRun(inputs.map((i) => i.projectId));
    toProcess = inputs;
  }

  try {
    for (let start = 0; start < toProcess.length; start += batchSize) {
      const chunk = toProcess.slice(start, start + batchSize);
      const repos = chunk.map((c) => c.repo);
      const result = await fetchRecentStargazersBatch(repos, since);
      pointsUsed += result.pointsUsed;

      if (result.rateLimit.remaining < 100) {
        const resetMs = new Date(result.rateLimit.resetAt).getTime() - Date.now();
        if (resetMs > 15 * 60 * 1000) {
          const abortNotes = `aborted: rate limit ${result.rateLimit.remaining}/5000, reset ${Math.round(resetMs / 1000)}s away`;
          db.finishBackfillRun(runId, {
            ok,
            skipped,
            pointsUsed,
            notes: abortNotes,
            status: "aborted",
          });
          return { runId, ok, skipped, pointsUsed, reasons };
        }
        await new Promise((r) => setTimeout(r, Math.max(0, resetMs) + 5000));
      }

      for (const input of chunk) {
        let page = result.pages.get(input.repo);
        if (!page || page.error) {
          const originalError = page?.error ?? "missing_page";
          const rest = await fetchRecentStargazersRest(input.repo, since);
          if (rest.error) {
            db.setBackfillRepoState(runId, input.projectId, "skipped", rest.error);
            bumpReason(reasons, rest.error);
            skipped += 1;
            continue;
          }
          if (originalError !== "not_found") {
            bumpReason(reasons, "graphql_recovered");
          }
          page = rest;
        }
        persistSnapshots(db, input.projectId, page, input.currentStars, today);
        db.setBackfillRepoState(runId, input.projectId, "done");
        ok += 1;
      }
    }

    const notes = `OK=${ok} skipped=${skipped} points=${pointsUsed} reasons=${JSON.stringify(reasons)}`;
    db.finishBackfillRun(runId, { ok, skipped, pointsUsed, notes });
  } catch (err) {
    const errNotes = `failed: ${err instanceof Error ? err.message : String(err)}`;
    db.finishBackfillRun(runId, { ok, skipped, pointsUsed, notes: errNotes, status: "failed" });
    throw err;
  }

  return { runId, ok, skipped, pointsUsed, reasons };
}
