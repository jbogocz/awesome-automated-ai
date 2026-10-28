import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Discovery's verdicts, one JSON line each (data/decisions.jsonl). A repo
 * with any decision is never evaluated again, and the PR lines are what the
 * daily PR cap counts across runs.
 */
export interface Decision {
  date: string;
  repo: string;
  decision: "add" | "reject" | "remove";
  reasoning: string;
  prNumber?: number;
}

export function loadDecisions(path: string): Decision[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as Decision);
}

export function appendDecision(path: string, decision: Decision): void {
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify(decision)}\n`);
}
