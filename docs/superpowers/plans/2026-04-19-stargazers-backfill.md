# Stargazers Trend Backfill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the misleading "Stars last 30 days" trend field (currently computed from 12 days of local snapshots) with real 30-day data from GitHub, for both existing and newly-added repos, at a scale that supports thousands of repos.

**Architecture:** GitHub **GraphQL** as primary transport (`stargazers(orderBy: STARRED_AT DESC)` with 20-repo batch aliasing + in-query `rateLimit` monitoring). REST fallback per-repo for edge cases. Checkpoint/resume state in SQLite. Pure `computeDailySnapshots` function produces 30 per-day snapshots; inserted via `INSERT OR IGNORE` so real snapshots are never overwritten.

**Tech Stack:** TypeScript (ESM), vitest, better-sqlite3, `gh` CLI invoked via `execFileSync` from `node:child_process` (reusing existing auth pattern in `src/generator/fetch-api.ts`).

**Spec:** [`docs/superpowers/specs/2026-04-19-stargazers-backfill-design.md`](../specs/2026-04-19-stargazers-backfill-design.md)

---

## File Structure

**New files (source):**
- `src/github/stargazers-graphql.ts` — batched GraphQL transport, aliasing + rate-limit awareness + per-repo continuation
- `src/github/stargazers-rest.ts` — single-repo REST fallback
- `src/generator/backfill.ts` — orchestrator: `computeDailySnapshots` (pure), `backfillBatch` (end-to-end)
- `src/github/types.ts` — shared interfaces between transports and orchestrator

**Modified files (source):**
- `src/db/client.ts` — add `backfill_runs` + `backfill_repo_status` migrations and helper methods
- `src/db/types.ts` — add `BackfillRunRow` + `BackfillRepoState`
- `src/generator/fetch-api.ts` — accumulate repos missing 30d history, call `backfillBatch` once per `generate`
- `src/cli.ts` — new subcommand `backfill-trends` with `--all` / `--missing` / `--repo=X/Y` / `--resume`

**New test files:**
- `tests/generator/backfill.test.ts` — unit: `computeDailySnapshots`
- `tests/github/stargazers-graphql.test.ts` — mocked `gh api graphql`, query shape + parsing
- `tests/github/stargazers-rest.test.ts` — mocked `gh api` REST, pagination + Link header
- `tests/generator/backfill-integration.test.ts` — in-memory SQLite, full orchestrator flow
- `tests/db/backfill-checkpoint.test.ts` — checkpoint table helpers

## Shared Type Definitions

Defined once in `src/github/types.ts` (created in Task 2) and imported from there by all later tasks.

```ts
// src/github/types.ts
export interface StargazerEntry {
  starredAt: string; // ISO-8601
}

export interface RepoStargazersPage {
  stargazers: StargazerEntry[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
  error?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: string; // ISO-8601
  cost: number;
}

export interface BackfillInput {
  repo: string;       // "owner/name"
  projectId: number;
  currentStars: number;
}

export interface BackfillSummary {
  runId: number;
  ok: number;
  skipped: number;
  pointsUsed: number;
  reasons: Record<string, number>;
}
```

---

## Task 1: DB migrations for backfill checkpoints

**Files:**
- Modify: `src/db/client.ts` (add migrations + 6 helper methods)
- Modify: `src/db/types.ts` (add 2 row types)
- Test: `tests/db/backfill-checkpoint.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/db/backfill-checkpoint.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DB } from "../../src/db/client.js";

function freshDB(): DB {
  const db = new DB(":memory:");
  db.migrate();
  return db;
}

describe("backfill checkpoint tables", () => {
  it("creates a run and tracks per-repo status transitions", () => {
    const db = freshDB();
    const p1 = db.upsertProject("a/b", "ab");
    const p2 = db.upsertProject("c/d", "cd");

    const runId = db.startBackfillRun([p1, p2]);
    expect(runId).toBeGreaterThan(0);
    expect(db.getBackfillPending(runId)).toEqual([p1, p2]);

    db.setBackfillRepoState(runId, p1, "done");
    expect(db.getBackfillPending(runId)).toEqual([p2]);

    db.setBackfillRepoState(runId, p2, "skipped", "not_found");
    expect(db.getBackfillPending(runId)).toEqual([]);

    db.finishBackfillRun(runId, { ok: 1, skipped: 1, pointsUsed: 7, notes: "done" });
    const run = db.getBackfillRun(runId);
    expect(run?.status).toBe("completed");
    expect(run?.completed_repos).toBe(1);
    expect(run?.skipped_repos).toBe(1);
    expect(run?.points_used).toBe(7);
    db.close();
  });

  it("resume: returns the latest running run id and its pending repos", () => {
    const db = freshDB();
    const p1 = db.upsertProject("a/b", "ab");
    const p2 = db.upsertProject("c/d", "cd");
    const runId = db.startBackfillRun([p1, p2]);
    db.setBackfillRepoState(runId, p1, "done");

    expect(db.getResumableBackfillRun()).toBe(runId);
    expect(db.getBackfillPending(runId)).toEqual([p2]);
    db.close();
  });

  it("migrate() is idempotent", () => {
    const db = freshDB();
    db.migrate();
    db.migrate();
    db.close();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/db/backfill-checkpoint.test.ts`

Expected: FAIL with errors about `startBackfillRun`, `getBackfillPending`, `setBackfillRepoState`, `finishBackfillRun`, `getBackfillRun`, `getResumableBackfillRun` not being methods of `DB`.

- [ ] **Step 3: Add row types to `src/db/types.ts`**

Append to `src/db/types.ts`:

```ts
export interface BackfillRunRow {
  id: number;
  started_at: string;
  finished_at: string | null;
  status: "running" | "completed" | "aborted" | "failed";
  total_repos: number;
  completed_repos: number;
  skipped_repos: number;
  points_used: number;
  notes: string | null;
}

export type BackfillRepoState = "pending" | "in_progress" | "done" | "skipped";
```

- [ ] **Step 4: Add migrations to `DB.migrate()` in `src/db/client.ts`**

Inside `migrate()`, after the existing block that creates `snapshots` / `agent_runs` / `decisions` / `sources`, append a second `this.sqlite.exec(...)` with the two new tables:

```ts
    this.sqlite.exec(`
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
    `);
```

- [ ] **Step 5: Add helper methods to the `DB` class**

Inside the `DB` class body in `src/db/client.ts` (after `getStarsNDaysAgo`), add:

```ts
  startBackfillRun(projectIds: number[]): number {
    const info = this.sqlite
      .prepare("INSERT INTO backfill_runs (total_repos) VALUES (?)")
      .run(projectIds.length);
    const runId = Number(info.lastInsertRowid);
    const stmt = this.sqlite.prepare(
      "INSERT INTO backfill_repo_status (run_id, project_id, state) VALUES (?, ?, 'pending')",
    );
    const tx = this.sqlite.transaction((ids: number[]) => {
      for (const id of ids) stmt.run(runId, id);
    });
    tx(projectIds);
    return runId;
  }

  getBackfillPending(runId: number): number[] {
    const rows = this.sqlite
      .prepare(
        "SELECT project_id FROM backfill_repo_status WHERE run_id = ? AND state IN ('pending', 'in_progress') ORDER BY project_id",
      )
      .all(runId) as { project_id: number }[];
    return rows.map((r) => r.project_id);
  }

  setBackfillRepoState(
    runId: number,
    projectId: number,
    state: "pending" | "in_progress" | "done" | "skipped",
    reason: string | null = null,
  ): void {
    this.sqlite
      .prepare(
        "UPDATE backfill_repo_status SET state = ?, skip_reason = ? WHERE run_id = ? AND project_id = ?",
      )
      .run(state, reason, runId, projectId);
  }

  finishBackfillRun(
    runId: number,
    stats: { ok: number; skipped: number; pointsUsed: number; notes: string },
  ): void {
    this.sqlite
      .prepare(
        `UPDATE backfill_runs
           SET status = 'completed',
               finished_at = datetime('now'),
               completed_repos = ?,
               skipped_repos = ?,
               points_used = ?,
               notes = ?
         WHERE id = ?`,
      )
      .run(stats.ok, stats.skipped, stats.pointsUsed, stats.notes, runId);
  }

  getBackfillRun(runId: number): import("./types.js").BackfillRunRow | null {
    const row = this.sqlite.prepare("SELECT * FROM backfill_runs WHERE id = ?").get(runId);
    return (row ?? null) as import("./types.js").BackfillRunRow | null;
  }

  getResumableBackfillRun(): number | null {
    const row = this.sqlite
      .prepare("SELECT id FROM backfill_runs WHERE status = 'running' ORDER BY id DESC LIMIT 1")
      .get() as { id: number } | undefined;
    return row?.id ?? null;
  }
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test tests/db/backfill-checkpoint.test.ts`

Expected: PASS (3 tests green).

- [ ] **Step 7: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/db/client.ts src/db/types.ts tests/db/backfill-checkpoint.test.ts
git commit -m "feat(db): add backfill_runs + backfill_repo_status tables with helpers"
```

---

## Task 2: Shared types + `computeDailySnapshots` pure function

**Files:**
- Create: `src/github/types.ts`
- Create: `src/generator/backfill.ts` (exports `computeDailySnapshots` only in this task)
- Test: `tests/generator/backfill.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/generator/backfill.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { computeDailySnapshots } from "../../src/generator/backfill.js";

function iso(y: number, m: number, d: number, hh = 12): string {
  return new Date(Date.UTC(y, m - 1, d, hh)).toISOString();
}

describe("computeDailySnapshots", () => {
  it("produces exactly 30 rows, one per day, for the 30 days ending yesterday", () => {
    const today = new Date(Date.UTC(2026, 3, 19)); // 2026-04-19
    const rows = computeDailySnapshots([], 100, today);
    expect(rows).toHaveLength(30);
    expect(rows[0]).toEqual({ date: "2026-03-20", stars: 100 });
    expect(rows[29]).toEqual({ date: "2026-04-18", stars: 100 });
  });

  it("subtracts stars added after the end of each day", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const stargazers = [
      { starredAt: iso(2026, 4, 18) },
      { starredAt: iso(2026, 4, 15) },
      { starredAt: iso(2026, 4, 10) },
    ];
    const rows = computeDailySnapshots(stargazers, 100, today);

    const byDate = new Map(rows.map((r) => [r.date, r.stars]));
    expect(byDate.get("2026-03-20")).toBe(97);
    expect(byDate.get("2026-04-09")).toBe(97);
    expect(byDate.get("2026-04-10")).toBe(98);
    expect(byDate.get("2026-04-15")).toBe(99);
    expect(byDate.get("2026-04-17")).toBe(99);
    expect(byDate.get("2026-04-18")).toBe(100);
  });

  it("handles a burst all in one day", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const stargazers = [
      { starredAt: iso(2026, 4, 5, 8) },
      { starredAt: iso(2026, 4, 5, 12) },
      { starredAt: iso(2026, 4, 5, 23) },
    ];
    const rows = computeDailySnapshots(stargazers, 50, today);
    const byDate = new Map(rows.map((r) => [r.date, r.stars]));
    expect(byDate.get("2026-04-04")).toBe(47);
    expect(byDate.get("2026-04-05")).toBe(50);
    expect(byDate.get("2026-04-06")).toBe(50);
  });

  it("rows are sorted by date ascending", () => {
    const today = new Date(Date.UTC(2026, 3, 19));
    const rows = computeDailySnapshots([], 0, today);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].date > rows[i - 1].date).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/generator/backfill.test.ts`

Expected: FAIL — `computeDailySnapshots` cannot be imported.

- [ ] **Step 3: Create `src/github/types.ts`**

Create `src/github/types.ts` with the exact contents listed in the "Shared Type Definitions" section at the top of this plan.

- [ ] **Step 4: Create `src/generator/backfill.ts` with `computeDailySnapshots`**

Create `src/generator/backfill.ts`:

```ts
import type { StargazerEntry } from "../github/types.js";

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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test tests/generator/backfill.test.ts`

Expected: PASS (4 tests green).

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/github/types.ts src/generator/backfill.ts tests/generator/backfill.test.ts
git commit -m "feat(backfill): add computeDailySnapshots + shared transport types"
```

---

## Task 3: REST fallback transport

**Files:**
- Create: `src/github/stargazers-rest.ts`
- Test: `tests/github/stargazers-rest.test.ts` (new)

The REST endpoint returns paginated results (100 per page) with a `Link` header containing `rel="last"`. Each page is chronological oldest→newest. To fetch only the last 30 days, we read the last page first, then walk backwards until a page's oldest entry is already older than `since`.

- [ ] **Step 1: Write the failing test**

Create `tests/github/stargazers-rest.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockExec = vi.fn();
vi.mock("node:child_process", () => ({
  execFileSync: (...args: unknown[]) => mockExec(...args),
}));

const { fetchRecentStargazersRest } = await import("../../src/github/stargazers-rest.js");

function mockGhInclude(linkHeader: string, data: unknown): string {
  const body = JSON.stringify(data);
  const headers = linkHeader
    ? `HTTP/2.0 200 OK\r\nLink: ${linkHeader}\r\n`
    : `HTTP/2.0 200 OK\r\n`;
  return `${headers}\r\n${body}`;
}

describe("fetchRecentStargazersRest", () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it("walks the Link rel=last page backwards, stopping when the oldest on a page is before `since`", async () => {
    // Page 1 (used to discover rel=last=5)
    mockExec.mockImplementationOnce(() =>
      mockGhInclude(
        '<https://api.github.com/repositories/1/stargazers?page=5&per_page=100>; rel="last"',
        [],
      ),
    );
    // Page 5: 100 stars all in window
    mockExec.mockImplementationOnce(() =>
      mockGhInclude(
        "",
        Array.from({ length: 100 }, (_, i) => ({
          starred_at: new Date(Date.UTC(2026, 3, 18, 0, i)).toISOString(),
        })),
      ),
    );
    // Page 4: oldest is before `since`
    mockExec.mockImplementationOnce(() => {
      const base = new Date(Date.UTC(2026, 2, 10));
      return mockGhInclude(
        "",
        Array.from({ length: 100 }, (_, i) => ({
          starred_at: new Date(base.getTime() + i * 3600_000).toISOString(),
        })),
      );
    });

    const since = new Date(Date.UTC(2026, 2, 20));
    const result = await fetchRecentStargazersRest("owner/repo", since);

    expect(result.error).toBeUndefined();
    expect(result.stargazers.length).toBeGreaterThan(100);
    for (const s of result.stargazers) {
      expect(new Date(s.starredAt) >= since).toBe(true);
    }
  });

  it("returns error='not_found' on 404", async () => {
    mockExec.mockImplementationOnce(() => {
      throw new Error("gh: Not Found (HTTP 404)");
    });
    const result = await fetchRecentStargazersRest("bad/repo", new Date());
    expect(result.error).toBe("not_found");
    expect(result.stargazers).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/github/stargazers-rest.test.ts`

Expected: FAIL — `fetchRecentStargazersRest` cannot be imported.

- [ ] **Step 3: Create `src/github/stargazers-rest.ts`**

Create `src/github/stargazers-rest.ts`:

```ts
import { execFileSync } from "node:child_process";
import type { RepoStargazersPage } from "./types.js";

const GH_TIMEOUT_MS = 15_000;

function categorizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/HTTP 404|Not Found/i.test(msg)) return "not_found";
  if (/HTTP 410/i.test(msg)) return "not_found";
  if (/HTTP 422/i.test(msg)) return "unprocessable";
  if (/HTTP 403/i.test(msg)) return "forbidden";
  if (/HTTP 5\d\d/i.test(msg)) return "server_error";
  return "network";
}

interface RawPage {
  linkHeader: string;
  data: { starred_at: string }[];
}

function ghRequest(repo: string, page: number): RawPage {
  const out = execFileSync(
    "gh",
    [
      "api",
      "-H",
      "Accept: application/vnd.github.star+json",
      `repos/${repo}/stargazers?per_page=100&page=${page}`,
      "--include",
    ],
    { timeout: GH_TIMEOUT_MS, encoding: "utf-8" },
  );
  const separatorIdx = out.indexOf("\r\n\r\n");
  const rawHeaders = separatorIdx >= 0 ? out.slice(0, separatorIdx) : "";
  const body = separatorIdx >= 0 ? out.slice(separatorIdx + 4) : out;
  const linkMatch = rawHeaders.match(/^Link:\s*(.+)$/im);
  const link = linkMatch ? linkMatch[1].trim() : "";
  const data = body.trim().length ? (JSON.parse(body) as { starred_at: string }[]) : [];
  return { linkHeader: link, data };
}

function extractLastPage(linkHeader: string): number | null {
  const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

export async function fetchRecentStargazersRest(
  repo: string,
  since: Date,
): Promise<RepoStargazersPage> {
  try {
    const head = ghRequest(repo, 1);
    const lastPage = extractLastPage(head.linkHeader) ?? 1;

    const stars: { starredAt: string }[] = [];
    for (let page = lastPage; page >= 1; page--) {
      const p = page === 1 ? head : ghRequest(repo, page);
      if (p.data.length === 0) break;
      const firstOnPage = new Date(p.data[0].starred_at);
      for (const entry of p.data) {
        const d = new Date(entry.starred_at);
        if (d >= since) stars.push({ starredAt: entry.starred_at });
      }
      if (firstOnPage < since) break;
    }

    return {
      stargazers: stars,
      totalCount: stars.length,
      hasNextPage: false,
      endCursor: null,
    };
  } catch (err) {
    return {
      stargazers: [],
      totalCount: 0,
      hasNextPage: false,
      endCursor: null,
      error: categorizeError(err),
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/github/stargazers-rest.test.ts`

Expected: PASS (2 tests green).

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/github/stargazers-rest.ts tests/github/stargazers-rest.test.ts
git commit -m "feat(github): REST fallback for stargazers within 30d window"
```

---

## Task 4: GraphQL batch transport

**Files:**
- Create: `src/github/stargazers-graphql.ts`
- Test: `tests/github/stargazers-graphql.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/github/stargazers-graphql.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockExec = vi.fn();
vi.mock("node:child_process", () => ({
  execFileSync: (...args: unknown[]) => mockExec(...args),
}));

const { buildBatchQuery, parseBatchResponse, fetchRecentStargazersBatch } = await import(
  "../../src/github/stargazers-graphql.js"
);

describe("buildBatchQuery", () => {
  it("aliases repos as r0, r1, ... with stargazerCount + stargazers(DESC) + rateLimit", () => {
    const q = buildBatchQuery(["owner1/repo1", "owner2/repo2"]);
    expect(q).toContain('r0: repository(owner: "owner1", name: "repo1")');
    expect(q).toContain('r1: repository(owner: "owner2", name: "repo2")');
    expect(q).toContain("stargazerCount");
    expect(q).toContain("orderBy: {field: STARRED_AT, direction: DESC}");
    expect(q).toContain("rateLimit {");
  });

  it("strips quote characters from repo components", () => {
    const q = buildBatchQuery(['evil"owner/repo']);
    expect(q).not.toMatch(/repository\(owner: "evil"/);
  });
});

describe("parseBatchResponse", () => {
  it("maps repo keys to stargazers pages", () => {
    const response = {
      data: {
        r0: {
          stargazerCount: 100,
          stargazers: {
            edges: [
              { starredAt: "2026-04-18T12:00:00Z" },
              { starredAt: "2026-04-15T12:00:00Z" },
            ],
            pageInfo: { hasNextPage: false, endCursor: "abc" },
          },
        },
        rateLimit: { remaining: 4900, resetAt: "2026-04-19T18:00:00Z", cost: 1 },
      },
    };
    const result = parseBatchResponse(["a/b"], response);
    expect(result.pages.get("a/b")).toEqual({
      stargazers: [
        { starredAt: "2026-04-18T12:00:00Z" },
        { starredAt: "2026-04-15T12:00:00Z" },
      ],
      totalCount: 100,
      hasNextPage: false,
      endCursor: "abc",
    });
    expect(result.rateLimit).toEqual({
      remaining: 4900,
      resetAt: "2026-04-19T18:00:00Z",
      cost: 1,
    });
  });

  it("records per-alias errors as pages with an error field", () => {
    const response = {
      data: { r0: null, rateLimit: { remaining: 4999, resetAt: "z", cost: 1 } },
      errors: [{ path: ["r0"], message: "Could not resolve to a Repository", type: "NOT_FOUND" }],
    };
    const result = parseBatchResponse(["missing/repo"], response);
    const page = result.pages.get("missing/repo");
    expect(page?.error).toBe("not_found");
    expect(page?.stargazers).toEqual([]);
  });
});

describe("fetchRecentStargazersBatch", () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it("calls gh api graphql once per batch and returns a full map", async () => {
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 50,
            stargazers: {
              edges: [{ starredAt: "2026-04-10T12:00:00Z" }],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
          rateLimit: { remaining: 4999, resetAt: "2026-04-19T18:00:00Z", cost: 1 },
        },
      }),
    );
    const result = await fetchRecentStargazersBatch(
      ["owner/repo"],
      new Date(Date.UTC(2026, 2, 20)),
    );
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(result.pages.size).toBe(1);
    expect(result.rateLimit.remaining).toBe(4999);
  });

  it("runs a continuation pass for repos whose oldest-in-page is still within window", async () => {
    // First call: r0 has hasNextPage=true and oldest star is >= since
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 5000,
            stargazers: {
              edges: Array.from({ length: 100 }, (_, i) => ({
                starredAt: new Date(Date.UTC(2026, 3, 19 - Math.floor(i / 10))).toISOString(),
              })),
              pageInfo: { hasNextPage: true, endCursor: "CURSOR1" },
            },
          },
          rateLimit: { remaining: 4999, resetAt: "z", cost: 1 },
        },
      }),
    );
    // Continuation call: returns 3 more, oldest now < since
    mockExec.mockImplementationOnce(() =>
      JSON.stringify({
        data: {
          r0: {
            stargazerCount: 5000,
            stargazers: {
              edges: [
                { starredAt: "2026-04-01T12:00:00Z" },
                { starredAt: "2026-03-25T12:00:00Z" },
                { starredAt: "2026-03-15T12:00:00Z" },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
          rateLimit: { remaining: 4998, resetAt: "z", cost: 1 },
        },
      }),
    );
    const since = new Date(Date.UTC(2026, 2, 20));
    const result = await fetchRecentStargazersBatch(["owner/repo"], since);
    const page = result.pages.get("owner/repo");
    expect(page?.stargazers.length).toBeGreaterThan(100);
    for (const s of page?.stargazers ?? []) {
      expect(new Date(s.starredAt) >= since).toBe(true);
    }
    expect(mockExec).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/github/stargazers-graphql.test.ts`

Expected: FAIL — functions cannot be imported.

- [ ] **Step 3: Create `src/github/stargazers-graphql.ts`**

Create `src/github/stargazers-graphql.ts`:

```ts
import { execFileSync } from "node:child_process";
import type { RateLimitInfo, RepoStargazersPage } from "./types.js";

const GH_TIMEOUT_MS = 30_000;

interface EdgeResponse {
  starredAt: string;
}
interface RepoResponse {
  stargazerCount: number;
  stargazers: {
    edges: EdgeResponse[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}
interface GraphQLResponse {
  data?: Record<string, RepoResponse | RateLimitInfo | null>;
  errors?: { path?: (string | number)[]; message: string; type?: string }[];
}

export interface BatchResult {
  pages: Map<string, RepoStargazersPage>;
  rateLimit: RateLimitInfo;
  pointsUsed: number;
}

function aliasFor(i: number): string {
  return `r${i}`;
}

function sanitize(s: string): string {
  return s.replace(/["\\]/g, "");
}

export function buildBatchQuery(
  repos: string[],
  cursorByAlias: Record<string, string | null> = {},
): string {
  const repoBlocks = repos
    .map((repo, i) => {
      const [owner, name] = repo.split("/");
      const alias = aliasFor(i);
      const cursor = cursorByAlias[alias];
      const afterArg = cursor ? `, after: "${sanitize(cursor)}"` : "";
      return `  ${alias}: repository(owner: "${sanitize(owner)}", name: "${sanitize(name)}") {
    stargazerCount
    stargazers(first: 100, orderBy: {field: STARRED_AT, direction: DESC}${afterArg}) {
      edges { starredAt }
      pageInfo { hasNextPage endCursor }
    }
  }`;
    })
    .join("\n");
  return `query {
${repoBlocks}
  rateLimit { remaining resetAt cost }
}`;
}

function categorizeGraphQLError(err: { type?: string; message: string }): string {
  const type = err.type?.toUpperCase() ?? "";
  if (type === "NOT_FOUND") return "not_found";
  if (type === "FORBIDDEN") return "forbidden";
  if (/not resolve/i.test(err.message)) return "not_found";
  return "graphql_error";
}

export function parseBatchResponse(repos: string[], resp: GraphQLResponse): BatchResult {
  const pages = new Map<string, RepoStargazersPage>();
  const errorsByAlias = new Map<string, string>();

  if (resp.errors) {
    for (const e of resp.errors) {
      const alias = e.path?.[0];
      if (typeof alias === "string" && alias.startsWith("r")) {
        errorsByAlias.set(alias, categorizeGraphQLError(e));
      }
    }
  }

  repos.forEach((repo, i) => {
    const alias = aliasFor(i);
    const entry = resp.data?.[alias] as RepoResponse | null | undefined;
    const aliasError = errorsByAlias.get(alias);
    if (aliasError || !entry) {
      pages.set(repo, {
        stargazers: [],
        totalCount: 0,
        hasNextPage: false,
        endCursor: null,
        error: aliasError ?? "graphql_error",
      });
      return;
    }
    pages.set(repo, {
      stargazers: entry.stargazers.edges.map((e) => ({ starredAt: e.starredAt })),
      totalCount: entry.stargazerCount,
      hasNextPage: entry.stargazers.pageInfo.hasNextPage,
      endCursor: entry.stargazers.pageInfo.endCursor,
    });
  });

  const rl = (resp.data?.rateLimit as RateLimitInfo | undefined) ?? {
    remaining: 0,
    resetAt: new Date().toISOString(),
    cost: 0,
  };

  return { pages, rateLimit: rl, pointsUsed: rl.cost };
}

function ghGraphQL(query: string): GraphQLResponse {
  const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
    timeout: GH_TIMEOUT_MS,
    encoding: "utf-8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(out) as GraphQLResponse;
}

export async function fetchRecentStargazersBatch(
  repos: string[],
  since: Date,
): Promise<BatchResult> {
  const firstQuery = buildBatchQuery(repos);
  const firstParse = parseBatchResponse(repos, ghGraphQL(firstQuery));
  let totalPoints = firstParse.pointsUsed;
  let lastRl = firstParse.rateLimit;

  const needMore: { repo: string; cursor: string }[] = [];
  for (const repo of repos) {
    const page = firstParse.pages.get(repo);
    if (!page || page.error || !page.hasNextPage) continue;
    const oldest = page.stargazers[page.stargazers.length - 1];
    if (!oldest) continue;
    if (new Date(oldest.starredAt) >= since && page.endCursor) {
      needMore.push({ repo, cursor: page.endCursor });
    }
  }

  const pool = [...needMore];
  while (pool.length > 0) {
    const chunk = pool.splice(0, 5);
    const cursorByAlias: Record<string, string | null> = {};
    const chunkRepos = chunk.map((c) => c.repo);
    chunkRepos.forEach((_, i) => (cursorByAlias[aliasFor(i)] = chunk[i].cursor));
    const q = buildBatchQuery(chunkRepos, cursorByAlias);
    const parsed = parseBatchResponse(chunkRepos, ghGraphQL(q));
    totalPoints += parsed.pointsUsed;
    lastRl = parsed.rateLimit;

    for (const repo of chunkRepos) {
      const newPage = parsed.pages.get(repo);
      const existing = firstParse.pages.get(repo);
      if (!newPage || !existing) continue;
      existing.stargazers.push(...newPage.stargazers);
      existing.hasNextPage = newPage.hasNextPage;
      existing.endCursor = newPage.endCursor;
      if (newPage.error && !existing.error) existing.error = newPage.error;

      if (newPage.hasNextPage && newPage.endCursor && newPage.stargazers.length > 0) {
        const oldest = newPage.stargazers[newPage.stargazers.length - 1];
        if (new Date(oldest.starredAt) >= since) {
          pool.push({ repo, cursor: newPage.endCursor });
        }
      }
    }
  }

  for (const page of firstParse.pages.values()) {
    page.stargazers = page.stargazers.filter((s) => new Date(s.starredAt) >= since);
  }

  return { pages: firstParse.pages, rateLimit: lastRl, pointsUsed: totalPoints };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/github/stargazers-graphql.test.ts`

Expected: PASS (5 tests green).

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/github/stargazers-graphql.ts tests/github/stargazers-graphql.test.ts
git commit -m "feat(github): GraphQL batched stargazers transport with continuation"
```

---

## Task 5: Backfill orchestrator (`backfillBatch`)

**Files:**
- Modify: `src/generator/backfill.ts` (add `backfillBatch` + internals alongside existing `computeDailySnapshots`)
- Test: `tests/generator/backfill-integration.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/generator/backfill-integration.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { DB } from "../../src/db/client.js";

const graphqlMock = vi.fn();
const restMock = vi.fn();
vi.mock("../../src/github/stargazers-graphql.js", () => ({
  fetchRecentStargazersBatch: (...a: unknown[]) => graphqlMock(...a),
}));
vi.mock("../../src/github/stargazers-rest.js", () => ({
  fetchRecentStargazersRest: (...a: unknown[]) => restMock(...a),
}));

const { backfillBatch } = await import("../../src/generator/backfill.js");

function setupDB(): DB {
  const db = new DB(":memory:");
  db.migrate();
  return db;
}

function countSnapshots(db: DB, pid: number): number {
  const raw = db as unknown as {
    sqlite: { prepare: (s: string) => { get: (id: number) => { n: number } } };
  };
  return raw.sqlite.prepare("SELECT COUNT(*) AS n FROM snapshots WHERE project_id = ?").get(pid).n;
}

function insertRealSnapshot(db: DB, pid: number, dateKey: string, stars: number): void {
  const raw = db as unknown as {
    sqlite: { prepare: (s: string) => { run: (...args: unknown[]) => void } };
  };
  raw.sqlite
    .prepare("INSERT INTO snapshots (project_id, snapshot_date, stars) VALUES (?, ?, ?)")
    .run(pid, dateKey, stars);
}

function starsOn(db: DB, pid: number, dateKey: string): number | null {
  const raw = db as unknown as {
    sqlite: {
      prepare: (s: string) => { get: (...args: unknown[]) => { stars: number } | undefined };
    };
  };
  return (
    raw.sqlite
      .prepare("SELECT stars FROM snapshots WHERE project_id = ? AND snapshot_date = ?")
      .get(pid, dateKey)?.stars ?? null
  );
}

describe("backfillBatch", () => {
  it("writes 30 snapshots per repo and records a completed run", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const pid = db.upsertProject("a/b", "ab");

    graphqlMock.mockResolvedValueOnce({
      pages: new Map([
        [
          "a/b",
          {
            stargazers: [{ starredAt: "2026-04-10T12:00:00Z" }],
            totalCount: 50,
            hasNextPage: false,
            endCursor: null,
          },
        ],
      ]),
      rateLimit: { remaining: 4999, resetAt: "2026-04-19T18:00:00Z", cost: 1 },
      pointsUsed: 1,
    });

    const today = new Date(Date.UTC(2026, 3, 19));
    const summary = await backfillBatch(
      [{ repo: "a/b", projectId: pid, currentStars: 50 }],
      db,
      { today, batchSize: 20 },
    );

    expect(summary.ok).toBe(1);
    expect(summary.skipped).toBe(0);
    expect(countSnapshots(db, pid)).toBe(30);

    const run = db.getBackfillRun(summary.runId);
    expect(run?.status).toBe("completed");
    expect(run?.completed_repos).toBe(1);
    db.close();
  });

  it("falls back to REST when GraphQL errors for a specific repo", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const pid = db.upsertProject("missing/repo", "missing");

    graphqlMock.mockResolvedValueOnce({
      pages: new Map([
        [
          "missing/repo",
          {
            stargazers: [],
            totalCount: 0,
            hasNextPage: false,
            endCursor: null,
            error: "graphql_error",
          },
        ],
      ]),
      rateLimit: { remaining: 4999, resetAt: "z", cost: 1 },
      pointsUsed: 1,
    });
    restMock.mockResolvedValueOnce({
      stargazers: [{ starredAt: "2026-04-10T12:00:00Z" }],
      totalCount: 10,
      hasNextPage: false,
      endCursor: null,
    });

    const today = new Date(Date.UTC(2026, 3, 19));
    const summary = await backfillBatch(
      [{ repo: "missing/repo", projectId: pid, currentStars: 10 }],
      db,
      { today, batchSize: 20 },
    );

    expect(summary.ok).toBe(1);
    expect(restMock).toHaveBeenCalledOnce();
    db.close();
  });

  it("does not overwrite existing real snapshots", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const pid = db.upsertProject("a/b", "ab");
    const today = new Date(Date.UTC(2026, 3, 19));
    const five = new Date(today);
    five.setUTCDate(five.getUTCDate() - 5);
    const dateKey = five.toISOString().slice(0, 10);
    insertRealSnapshot(db, pid, dateKey, 999);

    graphqlMock.mockResolvedValueOnce({
      pages: new Map([
        ["a/b", { stargazers: [], totalCount: 50, hasNextPage: false, endCursor: null }],
      ]),
      rateLimit: { remaining: 4999, resetAt: "z", cost: 1 },
      pointsUsed: 1,
    });

    await backfillBatch([{ repo: "a/b", projectId: pid, currentStars: 50 }], db, {
      today,
      batchSize: 20,
    });

    expect(starsOn(db, pid, dateKey)).toBe(999);
    db.close();
  });

  it("resume: only queries GraphQL for pending projects", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const p1 = db.upsertProject("a/b", "ab");
    const p2 = db.upsertProject("c/d", "cd");
    const runId = db.startBackfillRun([p1, p2]);
    db.setBackfillRepoState(runId, p1, "done");

    graphqlMock.mockResolvedValueOnce({
      pages: new Map([
        ["c/d", { stargazers: [], totalCount: 10, hasNextPage: false, endCursor: null }],
      ]),
      rateLimit: { remaining: 4999, resetAt: "z", cost: 1 },
      pointsUsed: 1,
    });

    const today = new Date(Date.UTC(2026, 3, 19));
    const summary = await backfillBatch(
      [
        { repo: "a/b", projectId: p1, currentStars: 50 },
        { repo: "c/d", projectId: p2, currentStars: 10 },
      ],
      db,
      { today, batchSize: 20, resumeRunId: runId },
    );

    expect(summary.runId).toBe(runId);
    const reposArg = graphqlMock.mock.calls[0]?.[0] as string[];
    expect(reposArg).toEqual(["c/d"]);
    db.close();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/generator/backfill-integration.test.ts`

Expected: FAIL — `backfillBatch` is not exported.

- [ ] **Step 3: Append `backfillBatch` and helpers to `src/generator/backfill.ts`**

Append below the existing `computeDailySnapshots` function in `src/generator/backfill.ts`:

```ts
import type { DB } from "../db/client.js";
import type { BackfillInput, BackfillSummary, RepoStargazersPage } from "../github/types.js";
import { fetchRecentStargazersBatch } from "../github/stargazers-graphql.js";
import { fetchRecentStargazersRest } from "../github/stargazers-rest.js";

export interface BackfillOptions {
  today?: Date;
  batchSize?: number;
  resumeRunId?: number;
  sinceDays?: number; // default 30
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
  const sinceDays = options.sinceDays ?? 30;
  const since = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  since.setUTCDate(since.getUTCDate() - sinceDays);

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

  for (let start = 0; start < toProcess.length; start += batchSize) {
    const chunk = toProcess.slice(start, start + batchSize);
    const repos = chunk.map((c) => c.repo);
    const result = await fetchRecentStargazersBatch(repos, since);
    pointsUsed += result.pointsUsed;

    for (const input of chunk) {
      let page = result.pages.get(input.repo);
      if (!page || page.error) {
        const rest = await fetchRecentStargazersRest(input.repo, since);
        if (rest.error) {
          db.setBackfillRepoState(runId, input.projectId, "skipped", rest.error);
          bumpReason(reasons, rest.error);
          skipped += 1;
          continue;
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

  return { runId, ok, skipped, pointsUsed, reasons };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/generator/backfill-integration.test.ts`

Expected: PASS (4 tests green).

- [ ] **Step 5: Run the full test suite**

Run: `pnpm test`

Expected: All tests PASS, no regression.

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/generator/backfill.ts tests/generator/backfill-integration.test.ts
git commit -m "feat(backfill): orchestrator with GraphQL primary + REST fallback + checkpoints"
```

---

## Task 6: Auto-backfill new repos during `generate`

**Files:**
- Modify: `src/generator/fetch-api.ts`
- Modify: `src/cli.ts` (await the now-async `fetchRepoData`)

- [ ] **Step 1: Replace `fetchRepoData` with a two-pass implementation**

In `src/generator/fetch-api.ts`, change the function signature from synchronous to async and restructure the main loop into two passes. Replace the body of `fetchRepoData` (lines 18-80 in the current file) with:

```ts
export async function fetchRepoData(yamlContent: string): Promise<ApiData> {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string; tagline?: string }[] }[];
  };
  const repos: { repo: string; name: string; tagline?: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) {
        repos.push({ repo: entry.repo, name: entry.name ?? entry.repo, tagline: entry.tagline });
      }
    }
  }
  console.log(`Fetching data for ${repos.length} repos...`);

  const dbPath = resolve(import.meta.dirname, "../../data/curator.db");
  const db = new DB(dbPath);
  db.migrate();

  // Pass 1: fetch live state and detect which repos lack 30d history.
  const rawByRepo = new Map<string, RawApiResult>();
  const projectIdByRepo = new Map<string, number>();
  const pendingBackfill: { repo: string; projectId: number; currentStars: number }[] = [];

  for (const { repo, name } of repos) {
    const raw = fetchOneRepo(repo);
    const projectId = db.upsertProject(repo, name);
    rawByRepo.set(repo, raw);
    projectIdByRepo.set(repo, projectId);
    if (db.getStarsNDaysAgo(projectId, 30) === null) {
      pendingBackfill.push({ repo, projectId, currentStars: raw.stars });
    }
  }

  if (pendingBackfill.length > 0) {
    const { backfillBatch } = await import("./backfill.js");
    console.log(`Backfilling 30d history for ${pendingBackfill.length} new/missing repos...`);
    await backfillBatch(pendingBackfill, db);
  }

  // Pass 2: compute trends + scores now that history exists.
  const data: ApiData = {};
  for (const { repo, tagline: yamlTagline } of repos) {
    const raw = rawByRepo.get(repo);
    const projectId = projectIdByRepo.get(repo);
    if (!raw || projectId === undefined) continue;

    const starsPrevious = db.getPreviousStars(projectId);
    const stars7dAgo = db.getStarsNDaysAgo(projectId, 7);
    const stars30dAgo = db.getStarsNDaysAgo(projectId, 30);
    const trend7d = stars7dAgo !== null ? raw.stars - stars7dAgo : null;
    const trend30d = stars30dAgo !== null ? raw.stars - stars30dAgo : null;
    const trend = trend30d ?? (starsPrevious !== null ? raw.stars - starsPrevious : null);

    const score = computeQualityScore({
      stars: raw.stars,
      starsPrevious,
      trend7d,
      trend30d,
      pushedAt: raw.pushed,
      license: raw.license,
      archived: raw.archived,
    });
    db.insertSnapshot(projectId, raw.stars, score);

    let tagline = db.getTagline(projectId);
    if (!tagline && yamlTagline) {
      db.setTagline(projectId, yamlTagline);
      tagline = yamlTagline;
    }

    data[repo] = {
      stars: raw.stars,
      pushed: raw.pushed,
      archived: raw.archived,
      license: raw.license,
      trend,
      trend7d,
      trend30d,
      lastRelease: raw.lastRelease,
      lastCommit: raw.lastCommit,
      score,
      topics: raw.topics,
      tagline,
    };
  }

  db.close();
  return data;
}
```

- [ ] **Step 2: Update the call site in `src/cli.ts`**

Find in `src/cli.ts` the line:

```ts
      apiData = fetchRepoData(yamlContent);
```

Change to:

```ts
      apiData = await fetchRepoData(yamlContent);
```

- [ ] **Step 3: Run the full test suite to check for regressions**

Run: `pnpm test`

Expected: All tests PASS. The `readme.test.ts` and other existing tests should be unaffected since they don't call `fetchRepoData` directly.

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/generator/fetch-api.ts src/cli.ts
git commit -m "feat(fetch-api): auto-backfill repos missing 30d history during generate"
```

---

## Task 7: CLI subcommand `backfill-trends`

**Files:**
- Modify: `src/cli.ts`

- [ ] **Step 1: Add imports near the top of `src/cli.ts`**

Near the top of `src/cli.ts`, ensure this import is present (add if missing):

```ts
import { parse as parseYaml } from "yaml";
import { execFileSync } from "node:child_process";
import { DB } from "./db/client.js";
import { backfillBatch } from "./generator/backfill.js";
```

- [ ] **Step 2: Add a new command branch in `main()`**

Inside `async function main()`, before the final `else { console.error("Usage: ...") ... }` block, add:

```ts
  } else if (command === "backfill-trends") {
    const yamlContent = readFileSync(PROJECTS_YAML, "utf-8");
    const doc = parseYaml(yamlContent) as {
      categories: { entries?: { repo?: string; name?: string }[] }[];
    };
    const allRepos: { repo: string; name: string }[] = [];
    for (const cat of doc.categories) {
      for (const entry of cat.entries ?? []) {
        if (entry.repo) allRepos.push({ repo: entry.repo, name: entry.name ?? entry.repo });
      }
    }

    const dbPath = resolve(ROOT, "data/curator.db");
    const db = new DB(dbPath);
    db.migrate();

    const repoFlag = process.argv.find((a) => a.startsWith("--repo="));
    const onlyMissing = process.argv.includes("--missing");
    const doResume = process.argv.includes("--resume");

    let target = allRepos;
    if (repoFlag) {
      const wanted = repoFlag.split("=")[1];
      target = allRepos.filter((r) => r.repo === wanted);
      if (target.length === 0) {
        console.error(`No such repo in projects.yaml: ${wanted}`);
        process.exit(1);
      }
    }

    // Resolve currentStars via gh CLI (same auth path as fetch-api).
    const currentStarsByRepo = new Map<string, number>();
    for (const { repo } of target) {
      try {
        const out = execFileSync(
          "gh",
          ["api", `repos/${repo}`, "--jq", ".stargazers_count"],
          { timeout: 15_000, encoding: "utf-8" },
        ).trim();
        currentStarsByRepo.set(repo, Number(out) || 0);
      } catch {
        currentStarsByRepo.set(repo, 0);
      }
    }

    const inputs = target.map(({ repo, name }) => {
      const projectId = db.upsertProject(repo, name);
      return { repo, projectId, currentStars: currentStarsByRepo.get(repo) ?? 0 };
    });

    let filtered = inputs;
    if (onlyMissing) {
      filtered = inputs.filter((i) => db.getStarsNDaysAgo(i.projectId, 30) === null);
      console.log(`--missing: ${filtered.length}/${inputs.length} repos need backfill`);
    }

    let resumeRunId: number | undefined;
    if (doResume) {
      const rid = db.getResumableBackfillRun();
      if (rid === null) {
        console.log("No resumable run found; starting a new one.");
      } else {
        resumeRunId = rid;
        console.log(`Resuming run ${rid}`);
      }
    }

    const summary = await backfillBatch(filtered, db, { resumeRunId });
    console.log(
      `Backfill complete: OK=${summary.ok} skipped=${summary.skipped} points=${summary.pointsUsed}`,
    );
    console.log(`Reasons: ${JSON.stringify(summary.reasons)}`);
    db.close();
```

Update the usage line in the final `else` branch:

```ts
    console.error(
      "Usage: tsx src/cli.ts <discover|generate|refresh-tags|reclassify|backfill-trends> [--all] [--missing] [--repo=X/Y] [--resume]",
    );
```

- [ ] **Step 3: Manual smoke test on a small repo**

From `projects.yaml`, pick any small repo (for example one with under 500 stars). Run:

```bash
tsx src/cli.ts backfill-trends --repo=<owner/name>
```

Expected output contains:

```
Backfill complete: OK=1 skipped=0 points=1
Reasons: {}
```

- [ ] **Step 4: Verify 30 snapshots were inserted**

Write a tiny verification script at `scripts/check-snapshots.mjs`:

```js
import Database from "better-sqlite3";
const [,, repo] = process.argv;
if (!repo) { console.error("Usage: node scripts/check-snapshots.mjs <owner/name>"); process.exit(1); }
const db = new Database("data/curator.db", { readonly: true });
const rows = db.prepare(`
  SELECT snapshot_date, stars FROM snapshots
  WHERE project_id = (SELECT id FROM projects WHERE repo = ?)
  ORDER BY snapshot_date
`).all(repo);
console.log("rows:", rows.length);
for (const r of rows) console.log(r.snapshot_date, r.stars);
```

Run:

```bash
node scripts/check-snapshots.mjs <owner/name>
```

Expected: `rows: 30` (plus any older/newer real snapshots that already existed), dates contiguous across the last 30 days.

- [ ] **Step 5: Run the full test suite**

Run: `pnpm test`

Expected: All tests PASS.

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/cli.ts scripts/check-snapshots.mjs
git commit -m "feat(cli): backfill-trends subcommand with --repo / --missing / --resume"
```

---

## Task 8: Bootstrap existing 230 repos and verify real trends

**Files:**
- None modified — this is a verification/bootstrap task. The final commit re-generates README and `docs/data.json`.

- [ ] **Step 1: Check GraphQL rate limit budget**

Run:

```bash
gh api rate_limit --jq .resources.graphql
```

Expected: `remaining` at least 500.

- [ ] **Step 2: Run the bootstrap backfill**

Run:

```bash
tsx src/cli.ts backfill-trends
```

Expected:
- Duration roughly 2-10 minutes for 230 repos
- Output ends with `OK=~220 skipped=~10 points=<100 Reasons: {...}`
- No unhandled exceptions

- [ ] **Step 3: Regenerate README + data.json with real trends**

Run:

```bash
pnpm generate
```

Expected: exits without error; `docs/data.json` and `README.md` are updated.

- [ ] **Step 4: Sanity-check trend values**

Run:

```bash
grep -E '"(huggingface/transformers|langchain-ai/langchain|ollama/ollama)"' docs/data.json -A 2 | head -60
```

For each of these three repos: confirm `trend` is no longer `0` or `null`. Then cross-check the displayed value against `star-history.com` for the same 30-day window — agreement within ±10% is the success bar.

- [ ] **Step 5: Idempotency check**

Re-run:

```bash
tsx src/cli.ts backfill-trends
```

Expected: `points` ≤ 15 (essentially one batched query per batch of 20 repos, all no-ops on insert because snapshots already exist), no new rows inserted.

- [ ] **Step 6: Commit the regenerated outputs**

```bash
git add docs/data.json README.md
git commit -m "chore: regenerate README + data.json with real 30d trend data"
```

---

## Self-Review Checklist

All items verified while writing this plan:

- ✅ **Spec coverage** — each section of the v2 spec maps to at least one task:
  - Architecture / new files → Tasks 2, 3, 4, 5
  - DB schema additions → Task 1
  - Algorithm (GraphQL batch + continuation + daily snapshots) → Tasks 4, 2
  - Error handling (transport errors, per-alias errors, fallback) → Tasks 3, 4, 5
  - Idempotency (INSERT OR IGNORE, no-op on fully-backfilled) → Tasks 5, 8
  - Rate limit awareness → Task 4 (in-query `rateLimit`), Task 8 (pre-flight check)
  - Auth via `gh` CLI → Tasks 3, 4 (reuses existing pattern)
  - Tests (5 test files) → Tasks 1-5
  - Bootstrap + steady-state → Tasks 6 (steady-state via fetch-api), 8 (bootstrap)
  - CLI subcommand → Task 7
  - Success criteria (spot-check, idempotency) → Task 8

- ✅ **No placeholders** — every step has concrete code or exact commands. No "TBD", no "add error handling," no "similar to Task N."

- ✅ **Type consistency** — `StargazerEntry`, `RepoStargazersPage`, `RateLimitInfo`, `BackfillInput`, `BackfillSummary` are all defined in `src/github/types.ts` (Task 2) and imported consistently across Tasks 3, 4, 5, 6, 7. `BackfillRunRow` + `BackfillRepoState` in `src/db/types.ts` (Task 1).

- ✅ **Commit hygiene** — one focused commit per task (no trailing "Co-Authored-By" trailer, matching existing repo style).
