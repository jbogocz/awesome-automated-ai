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
