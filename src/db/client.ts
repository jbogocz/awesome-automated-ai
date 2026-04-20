import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import type {
  AgentName,
  BackfillRepoState,
  BackfillRunRow,
  DecisionInsert,
  ProjectInsert,
  ProjectRow,
  RunStatus,
} from "./types.js";

export class DB {
  private sqlite: Database.Database;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") {
      mkdirSync(dirname(dbPath), { recursive: true });
    }
    this.sqlite = new Database(dbPath);
    this.sqlite.pragma("journal_mode = WAL");
    this.sqlite.pragma("foreign_keys = ON");
  }

  migrate(): void {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'candidate' CHECK (status IN ('listed', 'candidate', 'rejected', 'dead')),
        relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
        quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
        discovered_at TEXT NOT NULL DEFAULT (datetime('now')),
        listed_at TEXT,
        discovered_via TEXT NOT NULL DEFAULT 'github' CHECK (discovered_via IN ('github', 'arxiv', 'hn', 'reddit', 'pwc', 'awesome-list', 'conference')),
        stars INTEGER DEFAULT 0,
        last_commit TEXT,
        language TEXT,
        archived INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_repo ON projects(repo);

      -- Add tagline column if missing (idempotent)
      CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY);
      INSERT OR IGNORE INTO _migrations (name) VALUES ('add_tagline');
    `);

    const needsTagline = this.sqlite.prepare("SELECT 1 FROM _migrations WHERE name = 'add_tagline'").get();
    if (needsTagline) {
      try {
        this.sqlite.exec("ALTER TABLE projects ADD COLUMN tagline TEXT");
      } catch {
        // Column already exists
      }
    }

    this.sqlite.exec(`

      CREATE TABLE IF NOT EXISTS snapshots (
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

      CREATE INDEX IF NOT EXISTS idx_snapshots_project_date ON snapshots(project_id, snapshot_date);

      CREATE TABLE IF NOT EXISTS agent_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent TEXT NOT NULL CHECK (agent IN ('discovery', 'analysis', 'watchdog', 'evolution')),
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        finished_at TEXT,
        status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'aborted')),
        candidates_found INTEGER DEFAULT 0,
        actions_taken INTEGER DEFAULT 0,
        claude_tokens_used INTEGER DEFAULT 0,
        cost_usd REAL DEFAULT 0,
        error_log TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        decision TEXT NOT NULL CHECK (decision IN ('add', 'reject', 'update', 'remove')),
        proposed_by TEXT NOT NULL,
        decided_by TEXT NOT NULL DEFAULT 'auto',
        pr_number INTEGER,
        pr_status TEXT,
        reasoning TEXT,
        feedback TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_type TEXT NOT NULL UNIQUE CHECK (source_type IN ('github', 'arxiv', 'hn', 'reddit', 'pwc', 'awesome-list', 'conference')),
        last_scanned_at TEXT,
        cursor_state TEXT,
        entries_found_total INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

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
  }

  findProjectByRepo(repo: string): ProjectRow | null {
    const row = this.sqlite.prepare("SELECT * FROM projects WHERE repo = ?").get(repo) as ProjectRow | undefined;
    return row ?? null;
  }

  insertProject(project: ProjectInsert): ProjectRow {
    const stmt = this.sqlite.prepare(`
      INSERT INTO projects (repo, name, category, description, note, status, relevance_score, quality_score, discovered_via, stars, last_commit, language, archived)
      VALUES (@repo, @name, @category, @description, @note, @status, @relevance_score, @quality_score, @discovered_via, @stars, @last_commit, @language, @archived)
    `);
    const info = stmt.run({
      repo: project.repo,
      name: project.name,
      category: project.category ?? null,
      description: project.description ?? null,
      note: project.note ?? null,
      status: project.status ?? "candidate",
      relevance_score: project.relevance_score ?? null,
      quality_score: project.quality_score ?? null,
      discovered_via: project.discovered_via,
      stars: project.stars ?? 0,
      last_commit: project.last_commit ?? null,
      language: project.language ?? null,
      archived: project.archived ? 1 : 0,
    });
    return this.sqlite.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid) as ProjectRow;
  }

  updateProject(id: number, updates: Partial<ProjectInsert>): void {
    const setClauses: string[] = [];
    const values: Record<string, unknown> = { id };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClauses.push(`${key} = @${key}`);
        values[key] = key === "archived" ? (value ? 1 : 0) : value;
      }
    }
    if (setClauses.length === 0) return;
    this.sqlite.prepare(`UPDATE projects SET ${setClauses.join(", ")} WHERE id = @id`).run(values);
  }

  startAgentRun(agent: AgentName): number {
    const info = this.sqlite.prepare("INSERT INTO agent_runs (agent, status) VALUES (?, 'running')").run(agent);
    return Number(info.lastInsertRowid);
  }

  finishAgentRun(
    runId: number,
    status: RunStatus,
    stats: {
      candidates_found?: number;
      actions_taken?: number;
      claude_tokens_used?: number;
      cost_usd?: number;
      error_log?: string;
    },
  ): void {
    this.sqlite
      .prepare(`
      UPDATE agent_runs SET status = ?, finished_at = datetime('now'),
        candidates_found = COALESCE(?, candidates_found),
        actions_taken = COALESCE(?, actions_taken),
        claude_tokens_used = COALESCE(?, claude_tokens_used),
        cost_usd = COALESCE(?, cost_usd),
        error_log = COALESCE(?, error_log)
      WHERE id = ?
    `)
      .run(
        status,
        stats.candidates_found ?? null,
        stats.actions_taken ?? null,
        stats.claude_tokens_used ?? null,
        stats.cost_usd ?? null,
        stats.error_log ?? null,
        runId,
      );
  }

  insertDecision(decision: DecisionInsert): void {
    this.sqlite
      .prepare(`
      INSERT INTO decisions (project_id, decision, proposed_by, decided_by, pr_number, pr_status, reasoning)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .run(
        decision.project_id,
        decision.decision,
        decision.proposed_by,
        decision.decided_by ?? "auto",
        decision.pr_number ?? null,
        decision.pr_status ?? null,
        decision.reasoning ?? null,
      );
  }

  countPrsToday(): number {
    const today = new Date().toISOString().split("T")[0];
    const row = this.sqlite
      .prepare("SELECT COUNT(*) as count FROM decisions WHERE created_at >= ? AND pr_number IS NOT NULL")
      .get(`${today}T00:00:00`) as { count: number };
    return row.count;
  }

  upsertProject(repo: string, name: string): number {
    const existing = this.sqlite.prepare("SELECT id FROM projects WHERE repo = ?").get(repo) as
      | { id: number }
      | undefined;
    if (existing) return existing.id;
    const info = this.sqlite
      .prepare("INSERT INTO projects (repo, name, status, discovered_via) VALUES (?, ?, 'listed', 'github')")
      .run(repo, name);
    return Number(info.lastInsertRowid);
  }

  getTagline(projectId: number): string | null {
    const row = this.sqlite
      .prepare("SELECT tagline FROM projects WHERE id = ? AND tagline IS NOT NULL")
      .get(projectId) as { tagline: string } | undefined;
    return row?.tagline ?? null;
  }

  setTagline(projectId: number, tagline: string): void {
    this.sqlite.prepare("UPDATE projects SET tagline = ? WHERE id = ?").run(tagline, projectId);
  }

  insertSnapshot(projectId: number, stars: number, score: number): void {
    const today = new Date().toISOString().split("T")[0];
    this.sqlite
      .prepare(
        `INSERT OR REPLACE INTO snapshots (project_id, snapshot_date, stars, composite_score)
         VALUES (?, ?, ?, ?)`,
      )
      .run(projectId, today, stars, score);
  }

  getPreviousStars(projectId: number): number | null {
    const today = new Date().toISOString().split("T")[0];
    const row = this.sqlite
      .prepare(
        `SELECT stars FROM snapshots
         WHERE project_id = ? AND snapshot_date < ?
         ORDER BY snapshot_date DESC LIMIT 1`,
      )
      .get(projectId, today) as { stars: number } | undefined;
    return row?.stars ?? null;
  }

  getStarsNDaysAgo(projectId: number, days: number): number | null {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const row = this.sqlite
      .prepare(
        `SELECT stars FROM snapshots
         WHERE project_id = ? AND snapshot_date <= ?
         ORDER BY snapshot_date DESC LIMIT 1`,
      )
      .get(projectId, cutoffStr) as { stars: number } | undefined;
    return row?.stars ?? null;
  }

  startBackfillRun(projectIds: number[]): number {
    const info = this.sqlite.prepare("INSERT INTO backfill_runs (total_repos) VALUES (?)").run(projectIds.length);
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

  /** Returns project ids in 'pending' or 'in_progress' state — both still need processing on resume. */
  getBackfillPending(runId: number): number[] {
    const rows = this.sqlite
      .prepare(
        "SELECT project_id FROM backfill_repo_status WHERE run_id = ? AND state IN ('pending', 'in_progress') ORDER BY project_id",
      )
      .all(runId) as { project_id: number }[];
    return rows.map((r) => r.project_id);
  }

  setBackfillRepoState(runId: number, projectId: number, state: BackfillRepoState, reason: string | null = null): void {
    this.sqlite
      .prepare("UPDATE backfill_repo_status SET state = ?, skip_reason = ? WHERE run_id = ? AND project_id = ?")
      .run(state, reason, runId, projectId);
  }

  finishBackfillRun(
    runId: number,
    stats: {
      ok: number;
      skipped: number;
      pointsUsed: number;
      notes: string;
      status?: "completed" | "aborted" | "failed";
    },
  ): void {
    this.sqlite
      .prepare(
        `UPDATE backfill_runs
           SET status = ?,
               finished_at = datetime('now'),
               completed_repos = ?,
               skipped_repos = ?,
               points_used = ?,
               notes = ?
         WHERE id = ?`,
      )
      .run(stats.status ?? "completed", stats.ok, stats.skipped, stats.pointsUsed, stats.notes, runId);
  }

  getBackfillRun(runId: number): BackfillRunRow | null {
    const row = this.sqlite.prepare("SELECT * FROM backfill_runs WHERE id = ?").get(runId);
    return (row ?? null) as BackfillRunRow | null;
  }

  getResumableBackfillRun(): number | null {
    const row = this.sqlite
      .prepare("SELECT id FROM backfill_runs WHERE status = 'running' ORDER BY id DESC LIMIT 1")
      .get() as { id: number } | undefined;
    return row?.id ?? null;
  }

  close(): void {
    this.sqlite.close();
  }
}
