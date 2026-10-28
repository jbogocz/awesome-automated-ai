import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { loadManifest } from "../categories.ts";
import type { Config } from "../config.ts";
import { createPr } from "../github/pr.ts";
import { fetchRepoSignals, type GitHubCandidate, getDefaultTopics, searchGitHub } from "../github/search.ts";
import { computeScore } from "../scoring/composite.ts";
import { appendDecision, type Decision, loadDecisions } from "../store/decisions.ts";
import { todayUtc } from "../store/snapshots.ts";
import { logger } from "../utils/logger.ts";
import { analyzeCandidate } from "./analysis.ts";

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
  const decisionsPath = resolve(projectsYamlPath, "..", config.decisionsPath);
  const decided = loadDecisions(decisionsPath);
  const today = todayUtc();
  const record = (repo: string, decision: Decision["decision"], reasoning: string, prNumber?: number) =>
    appendDecision(decisionsPath, {
      date: today,
      repo,
      decision,
      reasoning,
      ...(prNumber === undefined ? {} : { prNumber }),
    });

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
    // Where a PR can file an entry. The model is told to pick an exact name
    // but nothing enforced it, and insertEntry has nowhere sensible to put
    // a name that matches no heading.
    const knownCategories = new Set(doc.categories.map((c) => c.name));
    const manifest = loadManifest();

    const candidates = await searchGitHub({
      topics: getDefaultTopics(),
      minStars: 50,
      maxResults: config.maxCandidatesPerRun,
    });

    const newCandidates: GitHubCandidate[] = [];
    for (const c of candidates) {
      if (existingRepos.has(c.repo)) continue;
      // Any earlier verdict, including a queued one, is final for discovery.
      if (decided.some((d) => d.repo === c.repo)) continue;
      newCandidates.push(c);
    }

    logger.info(`Discovery: ${candidates.length} found, ${newCandidates.length} new`);

    const prsToday = decided.filter((d) => d.prNumber !== undefined && d.date === today).length;

    for (const candidate of newCandidates) {
      const analysis = await analyzeCandidate({
        apiKey: config.anthropicApiKey,
        candidate,
        categories: manifest.categories,
      });
      tokensUsed += analysis.tokensUsed;

      const signals = await fetchRepoSignals(candidate.repo);

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

      const decision = classifyCandidate({
        relevant: analysis.relevant,
        relevanceScore: analysis.relevance_score,
        qualityScore: scoreResult.total,
        scoreThresholdAuto: config.scoreThresholdAuto,
        scoreThresholdQueue: config.scoreThresholdQueue,
      });

      if (decision === "auto" && !knownCategories.has(analysis.category)) {
        // Park it for a human rather than drop it: a rejection here would
        // hide it from every future run.
        logger.warn(`Not opening a PR for ${candidate.repo}: unknown category "${analysis.category}"; queued instead`);
        record(
          candidate.repo,
          "add",
          `Queued: auto (score ${scoreResult.total}) but category "${analysis.category}" matches no category in projects.yaml. ${analysis.reasoning}`,
        );
        queued++;
      } else if (decision === "auto" && prsToday + prsCreated >= config.maxPrsPerDay) {
        // Daily PR budget exhausted — throttle, don't discard. Park the
        // candidate in the review queue so it stays visible for promotion;
        // rejecting here would permanently drop it.
        record(
          candidate.repo,
          "add",
          `Queued: auto (score ${scoreResult.total}) but daily PR cap of ${config.maxPrsPerDay} reached. ${analysis.reasoning}`,
        );
        queued++;
      } else if (decision === "auto") {
        if (config.dryRun) {
          logger.info(`[DRY RUN] Would open PR for ${candidate.repo} (score: ${scoreResult.total})`);
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
          record(candidate.repo, "add", analysis.reasoning, prNumber);
        }
        prsCreated++;
      } else if (decision === "queue") {
        record(candidate.repo, "add", `Queued: score ${scoreResult.total}. ${analysis.reasoning}`);
        queued++;
      } else {
        record(candidate.repo, "reject", analysis.reasoning);
        discarded++;
      }
    }

    logger.info(
      `Discovery finished: ${newCandidates.length} new, ${prsCreated} PRs, ${queued} queued, ` +
        `${discarded} discarded, ${tokensUsed} tokens`,
    );
    return { candidatesFound: newCandidates.length, prsCreated, queued, discarded, tokensUsed };
  } catch (error) {
    logger.error(
      `Discovery failed after ${tokensUsed} tokens: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}
