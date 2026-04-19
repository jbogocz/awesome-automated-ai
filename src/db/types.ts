import { z } from "zod";

export const ProjectStatus = z.enum(["listed", "candidate", "rejected", "dead"]);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const DiscoverySource = z.enum(["github", "arxiv", "hn", "reddit", "pwc", "awesome-list", "conference"]);
export type DiscoverySource = z.infer<typeof DiscoverySource>;

export const AgentName = z.enum(["discovery", "analysis", "watchdog", "evolution"]);
export type AgentName = z.infer<typeof AgentName>;

export const RunStatus = z.enum(["running", "completed", "failed", "aborted"]);
export type RunStatus = z.infer<typeof RunStatus>;

export const DecisionType = z.enum(["add", "reject", "update", "remove"]);
export type DecisionType = z.infer<typeof DecisionType>;

export interface ProjectRow {
  id: number;
  repo: string;
  name: string;
  category: string | null;
  description: string | null;
  note: string | null;
  status: ProjectStatus;
  relevance_score: number | null;
  quality_score: number | null;
  discovered_at: string;
  listed_at: string | null;
  discovered_via: DiscoverySource;
  stars: number;
  last_commit: string | null;
  language: string | null;
  archived: boolean;
}

export interface ProjectInsert {
  repo: string;
  name: string;
  category?: string;
  description?: string;
  note?: string;
  status?: ProjectStatus;
  relevance_score?: number;
  quality_score?: number;
  discovered_via: DiscoverySource;
  stars?: number;
  last_commit?: string;
  language?: string;
  archived?: boolean;
}

export interface AgentRunRow {
  id: number;
  agent: AgentName;
  started_at: string;
  finished_at: string | null;
  status: RunStatus;
  candidates_found: number;
  actions_taken: number;
  claude_tokens_used: number;
  cost_usd: number;
  error_log: string | null;
}

export interface DecisionInsert {
  project_id: number;
  decision: DecisionType;
  proposed_by: string;
  decided_by?: string;
  pr_number?: number;
  pr_status?: string;
  reasoning?: string;
}

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
