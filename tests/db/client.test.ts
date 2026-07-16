import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { DB } from "../../src/db/client.js";

const tmpDir = mkdtempSync(join(tmpdir(), "curator-db-test-"));
afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("DB.migrate on a fresh database", () => {
  it("supports insertSnapshot with full metadata after a single migrate()", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertSnapshot(id, 100, 80, {
      archived: false,
      pushedAt: "2026-07-01T00:00:00Z",
      license: "MIT",
      topics: ["automl"],
      lastRelease: "2026-06-01T00:00:00Z",
      lastCommit: "2026-07-10T00:00:00Z",
    });
    const snap = db.getLatestSnapshot(id);
    expect(snap?.stars).toBe(100);
    expect(snap?.compositeScore).toBe(80);
    expect(snap?.license).toBe("MIT");
    expect(snap?.topics).toEqual(["automl"]);
    expect(snap?.archived).toBe(false);
    expect(snap?.lastRelease).toBe("2026-06-01T00:00:00Z");
    expect(snap?.lastCommit).toBe("2026-07-10T00:00:00Z");
    db.close();
  });

  it("supports tagline on a fresh database", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.setTagline(id, "one-liner");
    expect(db.getTagline(id)).toBe("one-liner");
    db.close();
  });

  it("is idempotent across multiple migrate() calls", () => {
    const db = new DB(":memory:");
    db.migrate();
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertSnapshot(id, 1, 1, { license: "MIT" });
    expect(db.getLatestSnapshot(id)?.license).toBe("MIT");
    db.close();
  });
});

describe("DB.migrate on a legacy database", () => {
  it("drops never-populated metric columns and the retired _migrations table, keeping data", () => {
    const path = join(tmpDir, "legacy.db");
    const raw = new Database(path);
    raw.exec(`
      CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'candidate',
        discovered_at TEXT NOT NULL DEFAULT (datetime('now')),
        listed_at TEXT,
        discovered_via TEXT NOT NULL DEFAULT 'github',
        stars INTEGER DEFAULT 0,
        last_commit TEXT,
        language TEXT,
        archived INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        snapshot_date TEXT NOT NULL DEFAULT (date('now')),
        stars INTEGER,
        forks INTEGER,
        open_issues INTEGER,
        contributors INTEGER,
        commit_count_30d INTEGER,
        avg_issue_response_hours REAL,
        composite_score INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(project_id, snapshot_date)
      );
      CREATE TABLE _migrations (name TEXT PRIMARY KEY);
      INSERT INTO projects (repo, name, status) VALUES ('a/b', 'ab', 'listed');
      INSERT INTO snapshots (project_id, snapshot_date, stars, forks, composite_score)
        VALUES (1, '2026-01-05', 123, 9, 70);
    `);
    raw.close();

    const db = new DB(path);
    db.migrate();
    db.migrate(); // idempotent
    const project = db.findProjectByRepo("a/b");
    expect(project?.id).toBe(1);
    const snap = db.getLatestSnapshot(1);
    expect(snap?.stars).toBe(123);
    expect(snap?.compositeScore).toBe(70);
    db.close();

    const check = new Database(path, { readonly: true });
    const cols = check.prepare("SELECT name FROM pragma_table_info('snapshots')").all() as { name: string }[];
    const names = cols.map((c) => c.name);
    for (const legacy of ["forks", "open_issues", "contributors", "commit_count_30d", "avg_issue_response_hours"]) {
      expect(names).not.toContain(legacy);
    }
    const migrationsTable = check.prepare("SELECT name FROM sqlite_master WHERE name = '_migrations'").get();
    expect(migrationsTable).toBeUndefined();
    check.close();
  });
});

describe("DB.syncListedStatus", () => {
  it("marks listed projects removed from the list as rejected with a 'remove' decision", () => {
    const path = join(tmpDir, "sync-delist.db");
    const db = new DB(path);
    db.migrate();
    db.upsertProject("keep/me", "keep");
    const goneId = db.upsertProject("gone/repo", "gone");

    const { delisted, relisted } = db.syncListedStatus(["keep/me"]);
    expect(delisted).toEqual(["gone/repo"]);
    expect(relisted).toEqual([]);
    expect(db.findProjectByRepo("gone/repo")?.status).toBe("rejected");
    expect(db.findProjectByRepo("keep/me")?.status).toBe("listed");
    db.close();

    const check = new Database(path, { readonly: true });
    const decision = check.prepare("SELECT decision, proposed_by FROM decisions WHERE project_id = ?").get(goneId) as {
      decision: string;
      proposed_by: string;
    };
    expect(decision).toEqual({ decision: "remove", proposed_by: "generate" });
    check.close();
  });

  it("flips non-listed projects that appear on the list to listed with an 'add' decision", () => {
    const path = join(tmpDir, "sync-relist.db");
    const db = new DB(path);
    db.migrate();
    const project = db.insertProject({
      repo: "back/again",
      name: "back",
      status: "rejected",
      discovered_via: "github",
    });

    const { delisted, relisted } = db.syncListedStatus(["back/again"]);
    expect(delisted).toEqual([]);
    expect(relisted).toEqual(["back/again"]);
    const row = db.findProjectByRepo("back/again");
    expect(row?.status).toBe("listed");
    expect(row?.listed_at).not.toBeNull();
    db.close();

    const check = new Database(path, { readonly: true });
    const decision = check
      .prepare("SELECT decision, proposed_by FROM decisions WHERE project_id = ?")
      .get(project.id) as { decision: string; proposed_by: string };
    expect(decision).toEqual({ decision: "add", proposed_by: "generate" });
    check.close();
  });

  it("is a no-op when statuses already match the list", () => {
    const path = join(tmpDir, "sync-noop.db");
    const db = new DB(path);
    db.migrate();
    db.upsertProject("a/b", "ab");
    const result = db.syncListedStatus(["a/b"]);
    expect(result).toEqual({ delisted: [], relisted: [] });
    db.close();

    const check = new Database(path, { readonly: true });
    expect((check.prepare("SELECT COUNT(*) n FROM decisions").get() as { n: number }).n).toBe(0);
    check.close();
  });
});

describe("DB.countPrsToday", () => {
  it("counts today's decisions that carry a PR number", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertDecision({
      project_id: id,
      decision: "add",
      proposed_by: "discovery",
      pr_number: 42,
      pr_status: "open",
      reasoning: "auto",
    });
    db.insertDecision({
      project_id: id,
      decision: "add",
      proposed_by: "discovery",
      reasoning: "queued - no PR",
    });
    expect(db.countPrsToday()).toBe(1);
    db.close();
  });
});
