// engine/src/db/schema.ts
// Drizzle schema for type inference (used alongside raw SQL for migrations)
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  repo: text("repo").notNull().unique(),
  name: text("name").notNull(),
  category: text("category"),
  description: text("description"),
  note: text("note"),
  status: text("status", { enum: ["listed", "candidate", "rejected", "dead"] })
    .notNull()
    .default("candidate"),
  relevance_score: integer("relevance_score"),
  quality_score: integer("quality_score"),
  discovered_at: text("discovered_at").notNull().default("datetime('now')"),
  listed_at: text("listed_at"),
  discovered_via: text("discovered_via", {
    enum: ["github", "arxiv", "hn", "reddit", "pwc", "awesome-list", "conference"],
  })
    .notNull()
    .default("github"),
  stars: integer("stars").default(0),
  last_commit: text("last_commit"),
  language: text("language"),
  archived: integer("archived", { mode: "boolean" }).default(false),
});

export const agent_runs = sqliteTable("agent_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agent: text("agent", { enum: ["discovery", "analysis", "watchdog", "evolution"] }).notNull(),
  started_at: text("started_at").notNull().default("datetime('now')"),
  finished_at: text("finished_at"),
  status: text("status", { enum: ["running", "completed", "failed", "aborted"] })
    .notNull()
    .default("running"),
  candidates_found: integer("candidates_found").default(0),
  actions_taken: integer("actions_taken").default(0),
  claude_tokens_used: integer("claude_tokens_used").default(0),
  cost_usd: real("cost_usd").default(0),
  error_log: text("error_log"),
});

export const decisions = sqliteTable("decisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  project_id: integer("project_id").notNull(),
  decision: text("decision", { enum: ["add", "reject", "update", "remove"] }).notNull(),
  proposed_by: text("proposed_by").notNull(),
  decided_by: text("decided_by").notNull().default("auto"),
  pr_number: integer("pr_number"),
  pr_status: text("pr_status"),
  reasoning: text("reasoning"),
  feedback: text("feedback"),
});
