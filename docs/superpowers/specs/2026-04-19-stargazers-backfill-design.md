# Stargazers Backfill — Real 7d/30d Trend Data

**Date:** 2026-04-19
**Status:** Design approved, awaiting implementation plan

## Problem

The `trend` field shown on `docs/index.html` (and in `docs/data.json`) is labeled "Stars last 30 days," but it is computed from our local SQLite database (`data/curator.db`), whose earliest snapshot is 2026-04-07 — only 12 days of history. For most repos the trend silently falls back to the previous snapshot (often yesterday), producing values of `0` or `1` that do not reflect the real 30-day delta. The field is effectively misleading.

## Goal

Replace the current trend values with **real 30-day data** derived from GitHub's stargazers API, and ensure that any new repo added to `projects.yaml` in the future automatically gets real trend data on the first `generate` run — without the 30-day wait.

Explicitly out of scope (to be handled in a separate spec): historical backfill deeper than 30 days (per-day snapshots going back 90d/1y for charts or longer-term analysis).

## Architecture

### New files

- **`src/github/stargazers.ts`** — low-level HTTP. Exports `fetchRecentStargazers(repo, since: Date): Promise<{ starredAt: string }[]>`. Uses `gh api` (matching existing auth pattern in `src/generator/fetch-api.ts`). All pagination, `Link` header parsing, and retry logic live here.
- **`src/generator/backfill.ts`** — domain logic. Exports:
  - `computeDailySnapshots(stargazers, currentStars, today): { date: string, stars: number }[]` — pure function, the core of the feature, easy to test.
  - `backfillTrendHistory(repo, projectId, currentStars, db)` — orchestration: calls `fetchRecentStargazers`, runs `computeDailySnapshots`, inserts into `snapshots` via `INSERT OR IGNORE`.

### Existing files changed

- **`src/generator/fetch-api.ts`** — after `upsertProject`, before computing trend:
  ```ts
  if (db.getStarsNDaysAgo(projectId, 30) === null) {
    await backfillTrendHistory(repo, projectId, raw.stars, db);
  }
  ```
  This handles new repos automatically. Once a repo has a snapshot ≥30 days old, the check short-circuits and no API calls happen.
- **`src/cli.ts`** — new subcommand `backfill-trends` with flags:
  - `--all` (default) — all repos in `projects.yaml`
  - `--repo=owner/name` — single repo, for debugging
  - `--missing` — only repos whose `getStarsNDaysAgo(projectId, 30)` is null

### Database

No schema changes. Reuses existing `snapshots(project_id, snapshot_date, stars, composite_score)` with its `UNIQUE(project_id, snapshot_date)` constraint. Critical switch: use `INSERT OR IGNORE` for backfilled rows so we never overwrite the 12 days of real snapshots we already have (2026-04-07 → today). `composite_score` is left `NULL` for backfilled rows — we do not recompute score retroactively.

## Algorithm (per repo)

1. **Cutoff:** `since = startOfDay(today - 30 days)` in UTC.
2. **Fetch stargazers backwards.** Request `page=1&per_page=100` with header `Accept: application/vnd.github.star+json`. Parse the `Link` header's `rel="last"` URL to learn `last_page`. Then iterate `page = last_page, last_page-1, ...`:
   - For each page, inspect the **first** stargazer's `starred_at`. If it is `< since`, filter the page to only stargazers `>= since` and stop.
   - Otherwise collect the whole page and continue to the previous page.
   - Aggregate stargazers in a single array.
3. **Compute daily snapshots.** Sort collected stargazers ascending by `starred_at`. For each day `d` in `[today-30d, today-1d]`:
   - `starsAtEndOfDay(d) = currentStars - count(stargazers where starred_at > endOfDay(d))`
   - Emit `{ date: d.toISOString().split('T')[0], stars: starsAtEndOfDay(d) }`.
   - Produces 30 rows.
4. **Insert via `INSERT OR IGNORE`.** Existing real snapshots (from the 12-day window we already collected) are preserved; backfilled rows fill the rest.

### Why iterate from the last page backwards

For a repo with 100k stars, paginating from page 1 requires ~1000 requests. Iterating from the last page requires only as many requests as there are stargazers within the 30-day window (typically 10–300 per repo). This is the difference between a feasible backfill and blowing the rate limit on the first few repos.

### Edge case: repos >40k stars

GitHub's stargazers API paginates up to ~40k stargazers (the oldest get truncated). Because we read from the newest side (last page backwards), this limit does not affect us — our window is always in the most recent stars.

### Known approximation: unstars

The stargazers API returns only users who currently have the repo starred, not historical stars that were later removed. Our reconstructed historical stars count is therefore a slight overestimate in the past (we "forget" anyone who starred and then unstarred within the 30-day window). For typical repos this is <1% of the count and well below the noise floor of the trend metric. We accept this approximation rather than trying to reconstruct unstar events (which would require `WatchEvent` from GH Archive / BigQuery — out of scope).

## Error handling

### Rate limit

- Before starting a `backfill-trends --all` run, check `gh api rate_limit --jq .resources.core.remaining`. If < 500, log a warning and exit without backfilling, to leave budget for the rest of `generate`.
- During a run, if a `gh api` call returns 403 with `X-RateLimit-Remaining: 0`:
  - Read `X-RateLimit-Reset`. If reset is ≤15 min away, sleep `reset + 5s`, retry once.
  - If reset is >15 min away, abort this repo (skip + log), move on to the next. Reset expected within an hour anyway — user can rerun.

### Other failures

- **404 / 410** (repo renamed, deleted, or made private) → skip + log `warn: ${repo} not found`.
- **422** (paginator edge case) → skip + log.
- **Network / 5xx** → 3 retries with exponential backoff 1s, 2s, 4s; if all fail, skip + log.
- **Parse error / empty response** → skip + log.

On repo-level failure, trend for that repo falls back to the existing logic in `fetch-api.ts` (diff from `starsPrevious` across our 12-day window). Not perfect, but no worse than today.

### Summary log

End of `backfill-trends --all` prints:
```
Backfill complete: OK=220, skipped=8
Skipped reasons: rate_limit=3, not_found=2, network=3
```

## Idempotency

Guaranteed by:
- `INSERT OR IGNORE` on snapshot writes — safe to rerun.
- The `fetch-api.ts` trigger (`getStarsNDaysAgo === null`) becomes a no-op once a repo has a ≥30-day snapshot.
- `backfill-trends --all` on fully-backfilled data: still issues 1 API call per repo to check `Link` header, but writes 0 rows. Acceptable. `--missing` flag avoids even that.

## Auth

Reuse `gh` CLI (already used in `src/generator/fetch-api.ts`). No new env vars, no new config, no new dependency.

## Tests

- **`tests/generator/backfill.test.ts`** — unit on `computeDailySnapshots`. Fixture: ~50 synthetic stargazers with known timestamps, a known `currentStars`, fixed `today`. Assert all 30 daily snapshots have the expected star counts, including edge cases (no stargazers in some days, many in others).
- **`tests/generator/backfill.integration.test.ts`** — `backfillTrendHistory` against an in-memory SQLite (`better-sqlite3` with `:memory:`), mocking `fetchRecentStargazers`. Verify:
  - 30 rows written.
  - Existing rows for dates in the backfill window are NOT overwritten.
  - `composite_score` is NULL for backfilled rows.
- **`tests/github/stargazers.test.ts`** — mock `execFileSync`. Verify:
  - `Link` header parsing (regex for `rel="last"`).
  - Iteration stops when first stargazer on a page is `< since`.
  - Error paths return/throw the expected kinds.
- **No live GitHub API tests.** Rate limit and non-determinism in CI — mocks are sufficient.

## Bootstrap

Two equivalent paths; user picks at execution time:

1. **Run `npm run cli backfill-trends`** manually once — backfills all 230 repos, takes 15–30 minutes, completes independently of the README generation pipeline.
2. **Run `npm run generate`** — the `fetch-api.ts` trigger detects missing 30-day history for every repo and backfills inline. Same end state, takes longer because it is interleaved with the rest of `generate`.

Either works. Recommend option 1 for the first run (cleaner logs, isolated failure mode), option 2 for steady-state (new repos added later to `projects.yaml` just work without manual intervention).

## YAGNI — explicitly deferred

- **Per-day backfill deeper than 30 days** — covered by the "option B" spec in the future.
- **Recomputing `composite_score` on backfilled rows** — score is only used as a current-state value, not per-snapshot. Leave NULL.
- **Caching raw stargazers API responses to disk** — each repo is fetched at most once (subsequent runs are no-ops), so a cache adds complexity without value.
- **Parallel requests across repos** — complicates rate-limit bookkeeping. Sequential is fast enough for a one-time backfill and steady-state trigger.
- **Backfilling `forks`, `open_issues`, `contributors`** into historical snapshots — none of these are consumed by current code. Leave NULL in backfilled rows.

## Success criteria

After running `backfill-trends --all`:

1. `docs/data.json` trend values are no longer dominated by `0` and `null` — the distribution should reflect real 30-day deltas.
2. For a spot-check of 3 popular repos (e.g., `huggingface/transformers`, `langchain-ai/langchain`, `ollama/ollama`), the computed trend is within ±10% of what `star-history.com` shows for the same window.
3. `npm run generate` (with no flags) on a fresh `projects.yaml` addition produces a real trend on the first run, not after 30 days.
4. Rerunning `backfill-trends --all` is a no-op for already-backfilled repos (0 new rows inserted).
