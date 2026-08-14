import { clamp } from "./utils.js";

export interface ScoreInput {
  stars: number;
  /**
   * Not supplied by discovery today, so scoreStarsVelocity returns its neutral
   * 50. Kept because the field is real and cheap to start passing; the neutral
   * default is explicit rather than an accidental zero.
   */
  starsLastMonth?: number;
  commitCount30d?: number;
  issueResponseHours?: number;
  contributorCount?: number;
  llmRelevanceScore: number;
  hasReadme: boolean;
  hasLicense: boolean;
}

export interface ScoreResult {
  total: number;
  starsVelocity: number;
  commitFrequency: number;
  issueResponse: number;
  contributors: number;
  documentation: number;
  llmRelevance: number;
}

/**
 * Discovery-triage weights. They sum to 1, so the result is a real weighted
 * mean rather than a number scaled by whatever the weights happen to total.
 *
 * There used to be a seventh term, `communityPlaceholder: 0.1`, whose value
 * was `(starsVelocity + commitFrequency + llmRelevance) / 3` — a re-average of
 * three terms already carrying 0.20/0.15/0.20. That is not a signal, it is the
 * same evidence counted twice, and it quietly gave those three an extra ~10%
 * of the weight while presenting itself as a distinct dimension. Its share is
 * redistributed across the terms that measure something.
 */
const W = {
  starsVelocity: 0.22,
  commitFrequency: 0.17,
  issueResponse: 0.1,
  contributors: 0.11,
  documentation: 0.18,
  llmRelevance: 0.22,
} as const;

export function computeScore(input: ScoreInput): ScoreResult {
  const starsVelocity = scoreStarsVelocity(input.stars, input.starsLastMonth);
  const commitFrequency = scoreCommitFrequency(input.commitCount30d);
  const issueResponse = scoreIssueResponse(input.issueResponseHours);
  const contributors = scoreContributors(input.contributorCount);
  const documentation = scoreDocumentation(input.hasReadme, input.hasLicense);
  const llmRelevance = input.llmRelevanceScore;

  const raw =
    starsVelocity * W.starsVelocity +
    commitFrequency * W.commitFrequency +
    issueResponse * W.issueResponse +
    contributors * W.contributors +
    documentation * W.documentation +
    llmRelevance * W.llmRelevance;

  return {
    total: clamp(Math.round(raw), 0, 100),
    starsVelocity: Math.round(starsVelocity),
    commitFrequency: Math.round(commitFrequency),
    issueResponse: Math.round(issueResponse),
    contributors: Math.round(contributors),
    documentation: Math.round(documentation),
    llmRelevance: Math.round(llmRelevance),
  };
}

function scoreStarsVelocity(stars: number, lastMonth: number | undefined): number {
  if (lastMonth === undefined) return 50;
  if (stars === 0) return 0;
  return clamp((lastMonth / stars) * 1000, 0, 100);
}

function scoreCommitFrequency(commits: number | undefined): number {
  if (commits === undefined) return 50;
  if (commits === 0) return 0;
  return clamp(Math.log2(commits + 1) * 20, 0, 100);
}

function scoreIssueResponse(hours: number | undefined): number {
  if (hours === undefined || hours === 0) return 50;
  return clamp(100 - Math.log2(hours + 1) * 15, 0, 100);
}

function scoreContributors(count: number | undefined): number {
  if (count === undefined) return 50;
  if (count === 0) return 0;
  return clamp(Math.log2(count + 1) * 18, 0, 100);
}

function scoreDocumentation(hasReadme: boolean, hasLicense: boolean): number {
  let score = 0;
  if (hasReadme) score += 60;
  if (hasLicense) score += 40;
  return score;
}
