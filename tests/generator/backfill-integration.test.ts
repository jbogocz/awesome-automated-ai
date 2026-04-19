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
    raw.sqlite.prepare("SELECT stars FROM snapshots WHERE project_id = ? AND snapshot_date = ?").get(pid, dateKey)
      ?.stars ?? null
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
    const summary = await backfillBatch([{ repo: "a/b", projectId: pid, currentStars: 50 }], db, {
      today,
      batchSize: 20,
    });

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
    const summary = await backfillBatch([{ repo: "missing/repo", projectId: pid, currentStars: 10 }], db, {
      today,
      batchSize: 20,
    });

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
      pages: new Map([["a/b", { stargazers: [], totalCount: 50, hasNextPage: false, endCursor: null }]]),
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
      pages: new Map([["c/d", { stargazers: [], totalCount: 10, hasNextPage: false, endCursor: null }]]),
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

  it("aborts with status=aborted when rate limit is critically low with reset >15 min away", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const pid = db.upsertProject("a/b", "ab");

    const farFuture = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    graphqlMock.mockResolvedValueOnce({
      pages: new Map([["a/b", { stargazers: [], totalCount: 50, hasNextPage: false, endCursor: null }]]),
      rateLimit: { remaining: 50, resetAt: farFuture, cost: 1 },
      pointsUsed: 1,
    });

    const today = new Date(Date.UTC(2026, 3, 19));
    const summary = await backfillBatch([{ repo: "a/b", projectId: pid, currentStars: 50 }], db, {
      today,
      batchSize: 20,
    });

    const run = db.getBackfillRun(summary.runId);
    expect(run?.status).toBe("aborted");
    expect(run?.notes).toContain("rate limit");
    db.close();
  });

  it("marks run as failed when an exception propagates from within the batch loop", async () => {
    graphqlMock.mockReset();
    restMock.mockReset();

    const db = setupDB();
    const pid = db.upsertProject("a/b", "ab");
    graphqlMock.mockRejectedValueOnce(new Error("simulated transport crash"));

    const today = new Date(Date.UTC(2026, 3, 19));
    await expect(
      backfillBatch([{ repo: "a/b", projectId: pid, currentStars: 50 }], db, { today, batchSize: 20 }),
    ).rejects.toThrow("simulated transport crash");

    // The run should still be recorded, with status=failed
    const rid = db.getResumableBackfillRun();
    expect(rid).toBeNull(); // failed, not running → not resumable
    db.close();
  });
});
