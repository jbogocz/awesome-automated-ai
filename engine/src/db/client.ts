// engine/src/db/client.ts
import Database from "better-sqlite3";
import type { AgentName, DecisionInsert, ProjectInsert, ProjectRow, RunStatus } from "./types.js";

export class DB {
  private sqlite: Database.Database;

  constructor(dbPath: string) {
    this.sqlite = new Database(dbPath);
    this.sqlite.pragma("journal_mode = WAL");
    this.sqlite.pragma("foreign_keys = ON");
  }

  /** Initialize tables if they don't exist */
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
  }

  async findProjectByRepo(repo: string): Promise<ProjectRow | null> {
    const row = this.sqlite.prepare("SELECT * FROM projects WHERE repo = ?").get(repo) as ProjectRow | undefined;
    return row ?? null;
  }

  async insertProject(project: ProjectInsert): Promise<ProjectRow> {
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

  async updateProject(id: number, updates: Partial<ProjectInsert>): Promise<void> {
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

  async startAgentRun(agent: AgentName): Promise<number> {
    const info = this.sqlite.prepare("INSERT INTO agent_runs (agent, status) VALUES (?, 'running')").run(agent);
    return Number(info.lastInsertRowid);
  }

  async finishAgentRun(
    runId: number,
    status: RunStatus,
    stats: {
      candidates_found?: number;
      actions_taken?: number;
      claude_tokens_used?: number;
      cost_usd?: number;
      error_log?: string;
    },
  ): Promise<void> {
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

  async insertDecision(decision: DecisionInsert): Promise<void> {
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

  async countPrsToday(): Promise<number> {
    const today = new Date().toISOString().split("T")[0];
    const row = this.sqlite
      .prepare("SELECT COUNT(*) as count FROM decisions WHERE created_at >= ? AND pr_number IS NOT NULL")
      .get(`${today}T00:00:00`) as { count: number };
    return row.count;
  }

  close(): void {
    this.sqlite.close();
  }
}
