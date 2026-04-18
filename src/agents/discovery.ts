import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { loadManifest } from "../categories.js";
import type { Config } from "../config.js";
import { DB } from "../db/client.js";
import { createPr } from "../github/pr.js";
import { fetchRepoSignals, type GitHubCandidate, getDefaultTopics, searchGitHub } from "../github/search.js";
import { computeScore } from "../scoring/composite.js";
import { analyzeCandidate } from "./analysis.js";

export type CandidateDecision = "auto" | "queue" | "discard";

interface ClassifyInput {
  relevant: boolean;
  relevanceScore: number;
  qualityScore: number;
  scoreThresholdAuto: number;
  scoreThresholdQueue: number;
}

export function classifyCandidate(input: ClassifyInput): CandidateDecision {
  if (!input.relevant) return "discard";
  const avg = Math.round((input.relevanceScore + input.qualityScore) / 2);
  if (avg >= input.scoreThresholdAuto) return "auto";
  if (avg >= input.scoreThresholdQueue) return "queue";
  return "discard";
}

interface RunResult {
  candidatesFound: number;
  prsCreated: number;
  queued: number;
  discarded: number;
  tokensUsed: number;
}

export async function runDiscovery(config: Config, projectsYamlPath: string): Promise<RunResult> {
  const { resolve } = await import("node:path");
  const { mkdirSync } = await import("node:fs");
  const dbDir = resolve(projectsYamlPath, "..", config.dbPath, "..");
  mkdirSync(dbDir, { recursive: true });
  const dbPath = resolve(projectsYamlPath, "..", config.dbPath);
  const db = new DB(dbPath);
  db.migrate();
  const runId = db.startAgentRun("discovery");

  let tokensUsed = 0;
  let prsCreated = 0;
  let queued = 0;
  let discarded = 0;

  try {
    const yamlContent = readFileSync(projectsYamlPath, "utf-8");
    const doc = parseYaml(yamlContent) as { categories: { name: string; entries?: { repo: string }[] }[] };
    const existingRepos = new Set<string>();
    for (const cat of doc.categories) {
      for (const entry of cat.entries ?? []) existingRepos.add(entry.repo);
    }
    const manifest = loadManifest();

    const candidates = await searchGitHub({
      token: config.githubToken,
      topics: getDefaultTopics(),
      minStars: 50,
      maxResults: config.maxCandidatesPerRun,
    });

    const newCandidates: GitHubCandidate[] = [];
    for (const c of candidates) {
      if (existingRepos.has(c.repo)) continue;
      const existing = db.findProjectByRepo(c.repo);
      if (existing) continue;
      newCandidates.push(c);
    }

    console.log(`Discovery: ${candidates.length} found, ${newCandidates.length} new`);

    const prsToday = db.countPrsToday();

    for (const candidate of newCandidates) {
      const analysis = await analyzeCandidate({
        apiKey: config.anthropicApiKey,
        candidate,
        categories: manifest.categories,
      });
      tokensUsed += analysis.tokensUsed;

      const signals = await fetchRepoSignals(config.githubToken, candidate.repo);

      // starsLastMonth and issueResponseHours left undefined: fetching either
      // requires paginated stargazer-timeline / issue-comments walks per
      // candidate. Scoring treats undefined as neutral (50).
      const scoreResult = computeScore({
        stars: candidate.stars,
        commitCount30d: signals.commitCount30d,
        contributorCount: signals.contributorCount,
        llmRelevanceScore: analysis.relevance_score,
        hasReadme: candidate.readme.length > 0,
        hasLicense: candidate.license !== null,
      });

      const project = db.insertProject({
        repo: candidate.repo,
        name: candidate.name,
        category: analysis.category,
        description: analysis.description,
        note: analysis.note ?? undefined,
        status: "candidate",
        relevance_score: analysis.relevance_score,
        quality_score: scoreResult.total,
        discovered_via: "github",
        stars: candidate.stars,
        last_commit: candidate.pushedAt,
        language: candidate.language ?? undefined,
        archived: candidate.archived,
      });

      const decision = classifyCandidate({
        relevant: analysis.relevant,
        relevanceScore: analysis.relevance_score,
        qualityScore: scoreResult.total,
        scoreThresholdAuto: config.scoreThresholdAuto,
        scoreThresholdQueue: config.scoreThresholdQueue,
      });

      if (decision === "auto" && prsToday + prsCreated < config.maxPrsPerDay) {
        if (config.dryRun) {
          console.log(`[DRY RUN] Would open PR for ${candidate.repo} (score: ${scoreResult.total})`);
        } else {
          const prNumber = await createPr({
            config,
            entry: {
              name: candidate.name,
              repo: candidate.repo,
              description: analysis.description,
              tagline: analysis.tagline,
              tags: analysis.tags,
              note: analysis.note,
            },
            category: analysis.category,
            bodyInput: {
              repo: candidate.repo,
              category: analysis.category,
              description: analysis.description,
              relevanceScore: analysis.relevance_score,
              qualityScore: scoreResult.total,
              reasoning: analysis.reasoning,
              source: "github",
            },
          });
          db.insertDecision({
            project_id: project.id,
            decision: "add",
            proposed_by: "discovery",
            pr_number: prNumber,
            pr_status: "open",
            reasoning: analysis.reasoning,
          });
        }
        prsCreated++;
      } else if (decision === "queue") {
        db.insertDecision({
          project_id: project.id,
          decision: "add",
          proposed_by: "discovery",
          reasoning: `Queued: score ${scoreResult.total}. ${analysis.reasoning}`,
        });
        queued++;
      } else {
        db.updateProject(project.id, { status: "rejected" });
        db.insertDecision({
          project_id: project.id,
          decision: "reject",
          proposed_by: "discovery",
          reasoning: analysis.reasoning,
        });
        discarded++;
      }
    }

    db.finishAgentRun(runId, "completed", {
      candidates_found: newCandidates.length,
      actions_taken: prsCreated,
      claude_tokens_used: tokensUsed,
    });
    db.close();
    return { candidatesFound: newCandidates.length, prsCreated, queued, discarded, tokensUsed };
  } catch (error) {
    db.finishAgentRun(runId, "failed", {
      error_log: error instanceof Error ? error.message : String(error),
      claude_tokens_used: tokensUsed,
    });
    db.close();
    throw error;
  }
}
