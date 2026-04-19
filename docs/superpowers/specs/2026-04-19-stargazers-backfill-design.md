# Stargazers Backfill — Real 7d/30d Trend Data

**Date:** 2026-04-19
**Status:** Design v2 — revised for scalability after MCP verification of GitHub API capabilities. Awaiting final review + implementation plan.

## Problem

The `trend` field rendered on `docs/index.html` (and in `docs/data.json`) is labeled "Stars last 30 days," but it is computed from our local SQLite database (`data/curator.db`), whose earliest snapshot is 2026-04-07 — only 12 days of history. For most repos the trend silently falls back to the previous snapshot (often yesterday), producing values of `0` or `1` that do not reflect the real 30-day delta. The field is effectively misleading.

## Goal

Replace the current trend values with **real 30-day data** derived directly from GitHub, and ensure that:

1. Every repo currently in `projects.yaml` gets accurate `trend7d` and `trend30d` values after a single bootstrap run.
2. Every repo added to `projects.yaml` in the future automatically gets a real trend on the first `generate` run — no 30-day wait.
3. **The design scales from today's 230 repos toward thousands** without structural change. Serial per-repo REST pagination, considered in v1, does not meet this bar.

Explicitly out of scope (to be handled in a separate spec): historical backfill deeper than 30 days (per-day snapshots going back 90d/1y for charts or longer-term analysis).

## Verified facts about the GitHub API (2026-04-19, via MCP)

These shaped the transport choice and the algorithm. Sources listed at the end of this document.

- **GraphQL supports `stargazers(orderBy: {field: STARRED_AT, direction: DESC})`** on the Repository object. Each edge exposes `starredAt`. This lets us pull the **newest** stargazers directly — no "iterate from the last page" trick needed.
- **GraphQL aliasing lets us batch many repos per request.** A single query can alias N `repository(owner:..., name:...)` fields and fetch each one's first 100 stargazers in one round trip.
- **GraphQL rate limit**: 5000 points/hour for a PAT (authenticated user), 10000/h for Enterprise Cloud, 5000–12500/h for GitHub Apps depending on scale. Cost = `ceil(sum(connection first/last args) / 100)`, minimum 1 point per query. A batched query that aliases 20 repos × `first: 100` costs ~1 point.
- **GraphQL has no `Link: rel=last` equivalent**; pagination uses `pageInfo.endCursor` + `after`. Cursors are per-connection (per repo), so continuation for one repo does not help another.
- **REST stargazers API has a hard cap of ~40k results** (400 pages × 100). Sufficient for almost any 30-day window but a structural limit when we consider deeper backfills later.
- **Secondary rate limits**: max 100 concurrent requests total, 900 points/min on REST, 80 content-generating requests/min. For this workload we stay well below all of these.

## Architecture

### New files

- **`src/github/stargazers-graphql.ts`** — primary transport. Exports:
  - `fetchRecentStargazersBatch(repos: string[], since: Date): Promise<Map<string, { starredAt: string }[]>>` — takes up to N repos, issues batched GraphQL query with aliases, handles cursor-based continuation per-repo for any repo whose 30-day stargazer count overflows the initial `first: 100`.
  - Internally uses `gh api graphql -f query=...` (matching existing `gh`-based auth, no new dependencies).
- **`src/github/stargazers-rest.ts`** — REST fallback. Exports `fetchRecentStargazersRest(repo, since)` for the rare cases where GraphQL returns an error for a specific repo (e.g., node lookup failure). Uses `Accept: application/vnd.github.star+json` and the `rel="last"` pagination trick.
- **`src/generator/backfill.ts`** — domain logic, transport-agnostic. Exports:
  - `computeDailySnapshots(stargazers, currentStars, today): { date, stars }[]` — pure function, 30 per-day rows.
  - `backfillBatch(repos, db)` — orchestrator: resolves current stars, calls GraphQL transport, falls back to REST per-repo on error, computes snapshots, inserts via `INSERT OR IGNORE`, writes checkpoint to DB.
- **`src/db/backfill-checkpoint.ts`** — thin helper over `sqlite` for `backfill_runs` and `backfill_repo_status` tables (see Schema). Lets a run resume from where it was interrupted.

### Existing files changed

- **`src/generator/fetch-api.ts`** — after `upsertProject`, before computing trend:
  ```ts
  if (db.getStarsNDaysAgo(projectId, 30) === null) {
    pendingBackfill.push({ repo, projectId, currentStars: raw.stars });
  }
  ```
  Accumulate into a batch, then `await backfillBatch(pendingBackfill, db)` once — so even during an interactive `generate` run the per-repo backfill pays for itself in a few batched requests.
- **`src/cli.ts`** — new subcommand `backfill-trends`:
  - `--all` (default) — every repo in `projects.yaml`
  - `--repo=owner/name` — single repo, for debugging
  - `--missing` — only repos whose `getStarsNDaysAgo(30) === null`
  - `--resume` — resume from checkpoint in `backfill_runs`

### Database schema (additive)

Two new tables. Zero changes to `projects` or `snapshots`.

```sql
CREATE TABLE IF NOT EXISTS backfill_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'aborted', 'failed')),
  total_repos INTEGER NOT NULL,
  completed_repos INTEGER NOT NULL DEFAULT 0,
  skipped_repos INTEGER NOT NULL DEFAULT 0,
  points_used INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS backfill_repo_status (
  run_id INTEGER NOT NULL REFERENCES backfill_runs(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  state TEXT NOT NULL CHECK (state IN ('pending', 'in_progress', 'done', 'skipped')),
  skip_reason TEXT,
  PRIMARY KEY (run_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_backfill_repo_status_state ON backfill_repo_status(run_id, state);
```

`snapshots` continues to be populated via `INSERT OR IGNORE` — backfilled rows never overwrite real snapshots (the 12-day window from 2026-04-07 onward is preserved).

## Algorithm

### Per batch (up to N repos at once; default N=20)

Construct one GraphQL query with aliased repository fields:

```graphql
query Backfill($since: DateTime!) {
  r0: repository(owner: "huggingface", name: "transformers") {
    stargazerCount
    stargazers(first: 100, orderBy: {field: STARRED_AT, direction: DESC}) {
      edges { starredAt cursor }
      pageInfo { hasNextPage endCursor }
    }
  }
  r1: repository(owner: "langchain-ai", name: "langchain") { ...same shape }
  # ...up to r19
  rateLimit { remaining resetAt cost }
}
```

Execute via `gh api graphql -f query=... -F since=...`. Parse the response:

- For each repo, collect `starredAt` values from edges.
- If the **oldest** `starredAt` on the page is `>= since` AND `pageInfo.hasNextPage` is true, this repo needs continuation. Schedule a follow-up query just for that repo with `after: endCursor`.
- Otherwise this repo is done for the batch — discard any edges where `starredAt < since`.

### Continuation pass

For the (typically few) repos that overflowed 100 stars within the 30-day window: issue either a single-repo query or a smaller batch (e.g., 5 aliased continuations at once), repeat until every repo's oldest collected `starredAt < since`.

### Deriving daily snapshots

Identical to v1 (`computeDailySnapshots`) — pure function over `{stargazers, currentStars, today}`. Produces 30 rows per repo. Insert via `INSERT OR IGNORE`.

### Why this scales

- 230 repos / 20 per batch = **12 base queries** ≈ 12 points, plus ~5–30 continuations for the handful of fast-growing repos. Total budget ≈ 30–50 points out of 5000.
- 5000 repos / 20 per batch = **250 base queries** ≈ 250 points, plus continuations. Still fits in a single hour's budget.
- 50000 repos → we'd need sharding across multiple hours or GitHub App authentication for the 12500/h bonus. Documented ceiling but not a near-term concern.

### Concurrency

Dispatch 3–5 GraphQL queries in parallel. With 20 repos per batch that's 60–100 repos in flight — well below the 100-concurrent secondary limit. `Promise.all` over a bounded pool (we'll use a tiny inline semaphore, no new dependency).

### Rate limit awareness

Include `rateLimit { remaining resetAt cost }` in every query. Before each new batch:

- If `remaining < 100` → pause until `resetAt`, log `[backfill] rate limit low (23/5000), sleeping 412s`.
- If `resetAt - now > 15 min` → abort the remaining queue, mark status `aborted`, record checkpoint. User re-runs with `--resume`.

## Error handling

### Query-level

- **Transient 5xx / network** → 3 retries, exponential backoff 1s, 2s, 4s. Then skip batch (rare — GraphQL endpoint is a single host).
- **Rate limit exceeded mid-batch** → pause to `resetAt + 5s`, retry once.
- **Query validation error** (malformed query, deprecated field) → hard fail, not a per-repo issue; surface to user.

### Per-repo within a batch

The GraphQL response can return `errors` alongside `data` with specific aliases nulled out (e.g., `r7` is null because repo was renamed). For any such repo:

- **NOT_FOUND / not accessible** → mark `skipped`, reason `not_found`, fall back to REST once as a sanity check (handles the rare case where GraphQL lookup differs from REST ownership resolution).
- **Other per-repo error** → mark `skipped`, reason from error body.

On REST fallback failure → skip + log. Existing `fetch-api.ts` trend logic still falls back on `starsPrevious` across our 12-day window. Not perfect, but no regression vs. today.

### Run-level

A run always ends with a summary written to `backfill_runs.notes`:

```
OK=220 skipped=8 points_used=47 duration=4m23s
Reasons: not_found=2, rate_limit=0, rest_fallback_failed=3, graphql_error=3
```

## Idempotency

- `INSERT OR IGNORE` on `snapshots` — safe to rerun; real snapshots from our own 12-day history are never overwritten.
- `fetch-api.ts` trigger (`getStarsNDaysAgo(30) === null`) → no-op once a repo has a ≥30-day snapshot. Normal `generate` runs don't hit the backfill path anymore after bootstrap.
- `backfill-trends --all` on fully-backfilled data: 1 query (to confirm `rateLimit` and detect any repos where we want to refresh) → near-zero cost.
- `--resume` reads the last `running` row in `backfill_runs`, picks up the `pending`/`in_progress` rows in `backfill_repo_status`.

## Auth — PAT first, GitHub App path documented

Reuse `gh` CLI (already used in `src/generator/fetch-api.ts`). `gh` provides auth and rate-limit budget for whoever is running the command.

For scale beyond ~3000–5000 repos, the project should migrate to a **GitHub App installation** (or generate a short-lived token via app credentials) — the installation budget scales to 12500 pts/h for non-Enterprise and 15000/h for Enterprise. We do not implement this now, but we will:

- Keep all API calls behind a single `ghApiGraphQL(query, variables)` helper so auth can switch centrally.
- Document the migration path in this spec (below) so future-you knows the escape hatch exists.

## Tests

- **`tests/generator/backfill.test.ts`** — unit on `computeDailySnapshots`. Synthetic stargazer fixture with known distribution, assert all 30 daily values.
- **`tests/github/stargazers-graphql.test.ts`** — mock `execFileSync` on `gh api graphql`:
  - Happy path: 20-alias response, all within window.
  - Mixed: 3 of 20 need continuation (`hasNextPage: true` + oldest `>= since`).
  - Per-alias error: one aliased repo returns null in data + entry in errors.
  - Rate limit low: `remaining: 50` in response → helper signals caller to pause.
- **`tests/github/stargazers-rest.test.ts`** — mock `execFileSync` on REST `gh api`. Verify `Link` header parsing and `rel="last"` iteration.
- **`tests/generator/backfill-integration.test.ts`** — `backfillBatch` against in-memory SQLite. Mock both transports. Verify:
  - 30 snapshots per repo.
  - Real (pre-existing) snapshots NOT overwritten.
  - `backfill_runs` / `backfill_repo_status` correctly populated and updated.
  - Resume path: start, abort mid-batch, restart, verify completion without re-processing done repos.
- **No live GitHub API tests** in CI (rate limit + non-determinism). One optional smoke test behind `RUN_LIVE_API=1` env flag, for manual use.

## Bootstrap and steady-state

**Bootstrap (first-time, for the 230 existing repos):** run `tsx src/cli.ts backfill-trends --all`. Expected ~5 minutes, ~50 rate-limit points.

**Steady-state:** `npm run generate` in its normal schedule picks up any new repo and backfills it automatically (batched with other new-in-this-run repos if applicable). For repos that already have ≥30d history, the trigger is a no-op.

## YAGNI — explicitly deferred

- Historical backfill deeper than 30 days (option "B" from the original brainstorm). Separate spec.
- Recomputing `composite_score` on backfilled rows — score is a current-state metric.
- Caching raw GraphQL responses to disk — each repo is fetched once per backfill, cache adds no value.
- Backfilling `forks`, `open_issues`, `contributors` — not consumed by trend.
- GitHub App implementation — PAT sufficient for current and near-term scale. Documented migration path in Auth section.
- Parallel continuation passes above 5 concurrent — secondary rate limit (100 concurrent) gives headroom but we don't need it until we're at 50k+ repos.

## Success criteria

After running `backfill-trends --all`:

1. `docs/data.json` trend values are no longer dominated by `0` and `null` — the distribution reflects real 30-day deltas.
2. For a spot-check of 3 popular repos (e.g., `huggingface/transformers`, `langchain-ai/langchain`, `ollama/ollama`), computed trend is within ±10% of `star-history.com` for the same window.
3. `npm run generate` on a fresh `projects.yaml` addition produces a real trend on the first run, not after 30 days.
4. Rerunning `backfill-trends --all` on fully-backfilled data uses <5 rate-limit points and inserts 0 rows.
5. Total rate-limit cost of initial bootstrap: **under 100 points** (measured from `rateLimit.cost` in responses).

## Known approximation: unstars

The stargazers API returns only users who currently have the repo starred, not historical stars that were later removed. Our reconstructed historical star count is therefore a slight overestimate for past days (we "forget" users who starred and then unstarred within the 30-day window). For typical repos this is <1% and well below the noise floor of the trend metric. Reconstructing unstar events would require GH Archive `WatchEvent` data via BigQuery — out of scope.

## Sources (verified via MCP on 2026-04-19)

- [GitHub GraphQL rate limits + node limits](https://docs.github.com/en/graphql/overview/rate-limits-and-node-limits-for-the-graphql-api) — point cost calculation, 5000/h PAT
- [GitHub REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) — PAT vs GitHub App, secondary limits
- [GitHub REST starring endpoints](https://docs.github.com/en/rest/activity/starring) — `application/vnd.github.star+json` media type
- [Gist: Get Early Stargazers (nil0x42)](https://gist.github.com/nil0x42/656ccf98c00c99277ca7826bf1c43022) — confirms `stargazers(first, orderBy: {field: STARRED_AT, direction: ASC|DESC}) { edges { node { login } starredAt } }` works
- [Community discussion #35677](https://github.com/orgs/community/discussions/35677) — confirms `starredAt` on stargazer edge, confirms `stargazerCount` on repository
- [SO 51047292 / 59393869](https://stackoverflow.com/questions/51047292) — GraphQL aliasing for multiple repositories in one request
- [SO 25265465](https://stackoverflow.com/questions/25265465) — REST 40k / 400-page hard cap on stargazers (relevant only for the REST fallback path)
- [GitHub CLI blog on GraphQL](https://github.blog/developer-skills/github/exploring-github-cli-how-to-interact-with-githubs-graphql-api-endpoint/) — `rateLimit` field usage for in-query budget monitoring
