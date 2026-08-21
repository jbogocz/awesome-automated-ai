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

describe("DB.getSnapshotSeries", () => {
  function seed(rows: [string, number][]): { db: DB; id: number } {
    const path = join(tmpDir, `series-${rows.length}-${rows[0]?.[0] ?? "empty"}.db`);
    const db = new DB(path);
    db.migrate();
    const id = db.upsertProject("a/series", "series");
    const raw = new Database(path);
    // A composite_score is what marks a row as measured; the publication
    // readers filter on it, so a fixture without one is invisible to them.
    const stmt = raw.prepare(
      "INSERT OR REPLACE INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, 50)",
    );
    for (const [date, stars] of rows) stmt.run(id, date, stars);
    raw.close();
    return { db, id };
  }

  function daysAgo(n: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - n);
    return d.toISOString().split("T")[0];
  }

  it("returns measured points oldest first, inside the window", () => {
    const { db, id } = seed([
      [daysAgo(21), 100],
      [daysAgo(14), 120],
      [daysAgo(7), 150],
    ]);
    const series = db.getSnapshotSeries(id, 90);
    expect(series.map((p) => p.stars)).toEqual([100, 120, 150]);
    expect(series[0].date < series[2].date).toBe(true);
    db.close();
  });

  it("excludes points older than the window", () => {
    const { db, id } = seed([
      [daysAgo(200), 10],
      [daysAgo(5), 300],
      [daysAgo(3), 310],
    ]);
    expect(db.getSnapshotSeries(id, 90).map((p) => p.stars)).toEqual([300, 310]);
    db.close();
  });

  // The sparkline plots these verbatim, so a corrupt zero/negative row would
  // render as a real measured collapse to nothing.
  it("drops non-positive star rows", () => {
    const { db, id } = seed([
      [daysAgo(30), 0],
      [daysAgo(20), -2],
      [daysAgo(10), 500],
    ]);
    expect(db.getSnapshotSeries(id, 90)).toEqual([{ date: daysAgo(10), stars: 500 }]);
    db.close();
  });

  it("returns an empty series for a project with no snapshots", () => {
    const db = new DB(":memory:");
    db.migrate();
    expect(db.getSnapshotSeries(db.upsertProject("x/y", "xy"), 90)).toEqual([]);
    expect(db.getMaxSnapshotDate()).toBeNull();
    db.close();
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

describe("DB.pruneSnapshotHistory", () => {
  function seeded(rows: [string, number][]): { db: DB; id: number; path: string } {
    const path = join(tmpDir, `prune-${rows.length}-${rows[0]?.[0] ?? "e"}.db`);
    const db = new DB(path);
    db.migrate();
    const id = db.upsertProject("a/prune", "prune");
    const raw = new Database(path);
    // A composite_score is what marks a row as measured; the publication
    // readers filter on it, so a fixture without one is invisible to them.
    const stmt = raw.prepare(
      "INSERT OR REPLACE INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, 50)",
    );
    for (const [date, stars] of rows) stmt.run(id, date, stars);
    raw.close();
    return { db, id, path };
  }

  function daysAgo(n: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - n);
    return d.toISOString().split("T")[0];
  }

  it("leaves recent history at full resolution", () => {
    const { db, id } = seeded([
      [daysAgo(30), 10],
      [daysAgo(21), 11],
      [daysAgo(14), 12],
      [daysAgo(7), 13],
    ]);
    expect(db.pruneSnapshotHistory(180)).toBe(0);
    expect(db.getSnapshotSeries(id, 400)).toHaveLength(4);
    db.close();
  });

  it("thins older history to one row per month, keeping the newest", () => {
    const { db, id } = seeded([
      ["2020-01-05", 1],
      ["2020-01-12", 2],
      ["2020-01-26", 3],
      ["2020-02-09", 4],
      ["2020-02-23", 5],
      [daysAgo(3), 99],
    ]);
    expect(db.pruneSnapshotHistory(180)).toBe(3);
    const kept = db.getSnapshotSeries(id, 100_000).map((p) => p.date);
    expect(kept).toEqual(["2020-01-26", "2020-02-23", daysAgo(3)]);
    db.close();
  });

  it("is idempotent", () => {
    const { db } = seeded([
      ["2020-01-05", 1],
      ["2020-01-12", 2],
      [daysAgo(3), 9],
    ]);
    expect(db.pruneSnapshotHistory(180)).toBe(1);
    expect(db.pruneSnapshotHistory(180)).toBe(0);
    db.close();
  });
});

describe("published readers serve measured snapshots only", () => {
  /**
   * The failure this guards: GitHub restricted stargazer listings, the
   * retired reconstruction path read that silence as "gained nothing", and
   * wrote today's star count across 30 past days. Those rows carried no
   * composite score, so filtering on one is what keeps a reconstructed or
   * otherwise unscored row out of the sparkline, the trend and the README.
   */
  function withRows(tag: string): { db: DB; id: number } {
    const path = join(tmpDir, `measured-only-${tag}.db`);
    const db = new DB(path);
    db.migrate();
    const id = db.upsertProject("a/measured", "measured");
    const raw = new Database(path);
    const today = new Date();
    const day = (n: number): string => {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - n);
      return d.toISOString().split("T")[0];
    };
    raw
      .prepare("INSERT INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, 60)")
      .run(id, day(1), 500);
    // Same shape a reconstruction wrote: a star count and no score.
    for (const n of [28, 29, 30, 31, 32]) {
      raw
        .prepare("INSERT INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, NULL)")
        .run(id, day(n), 490);
    }
    raw.close();
    return { db, id };
  }

  it("getSnapshotSeries omits unscored rows", () => {
    const { db, id } = withRows("series");
    const series = db.getSnapshotSeries(id, 90);
    expect(series).toHaveLength(1);
    expect(series[0]?.stars).toBe(500);
    db.close();
  });

  it("getStarsNDaysAgo will not anchor a trend on an unscored row", () => {
    const { db, id } = withRows("ndays");
    expect(db.getStarsNDaysAgo(id, 30)).toBeNull();
    db.close();
  });

  it("getPreviousStars skips a newer unscored row for an older measured one", () => {
    const path = join(tmpDir, "measured-only-prev.db");
    const db = new DB(path);
    db.migrate();
    const id = db.upsertProject("a/prev", "prev");
    const raw = new Database(path);
    const day = (n: number): string => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - n);
      return d.toISOString().split("T")[0];
    };
    raw
      .prepare("INSERT INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, 60)")
      .run(id, day(9), 400);
    // Newer, but unscored: taking it would report growth that was never measured.
    raw
      .prepare("INSERT INTO snapshots (project_id, snapshot_date, stars, composite_score) VALUES (?, ?, ?, NULL)")
      .run(id, day(2), 490);
    raw.close();
    expect(db.getPreviousStars(id)).toBe(400);
    db.close();
  });
});

describe("DB.upsertProject identity", () => {
  it("re-points an existing row when the repo is renamed under the same GitHub id", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("sst/opencode", "OpenCode", 975734319);
    db.insertSnapshot(id, 185248, 80);

    // Same repository, new address — must be the same row, history intact.
    const after = db.upsertProject("anomalyco/opencode", "OpenCode", 975734319);
    expect(after).toBe(id);
    expect(db.findProjectByRepo("anomalyco/opencode")?.id).toBe(id);
    expect(db.findProjectByRepo("sst/opencode")).toBeNull();
    expect(db.getSnapshotSeries(id, 90)).toHaveLength(1);
    db.close();
  });

  it("treats a case-only slug change as the same repo", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("e2b-dev/e2b", "E2B");
    expect(db.upsertProject("e2b-dev/E2B", "E2B")).toBe(id);
    db.close();
  });

  it("keeps genuinely different repos apart even when the name matches", () => {
    const db = new DB(":memory:");
    db.migrate();
    const a = db.upsertProject("visenger/awesome-mlops", "awesome-mlops", 244620269);
    const b = db.upsertProject("kelvins/awesome-mlops", "awesome-mlops", 266895706);
    expect(b).not.toBe(a);
    db.close();
  });

  it("backfills github_id onto a row first seen without one", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    expect(db.upsertProject("a/b", "ab", 4242)).toBe(id);
    // Now resolvable by id alone, so a later rename cannot orphan it.
    expect(db.upsertProject("c/d", "ab", 4242)).toBe(id);
    db.close();
  });
});
