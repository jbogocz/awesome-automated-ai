export interface StargazerEntry {
  starredAt: string;
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
  resetAt: string;
  cost: number;
}

export interface BackfillInput {
  repo: string;
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
