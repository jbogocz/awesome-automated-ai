import { resolve } from "node:path";

const DATA = resolve(import.meta.dirname, "../../data");

/** Where the committed text data lives. Tests pass their own paths instead. */
export interface DataPaths {
  snapshotsDir: string;
  latestPath: string;
}

export function defaultDataPaths(): DataPaths {
  return { snapshotsDir: resolve(DATA, "snapshots"), latestPath: resolve(DATA, "latest.json") };
}

export const DECISIONS_PATH = resolve(DATA, "decisions.jsonl");
