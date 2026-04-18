import { isMap, isScalar, isSeq, parseDocument, type Scalar, type YAMLSeq } from "yaml";
import type { ApiData } from "../generator/readme.js";
import { curateTags } from "./tag-curator.js";

export interface RefreshTagsOptions {
  yamlContent: string;
  apiData: ApiData;
  apiKey: string;
  limit?: number;
  dryRun?: boolean;
  onProgress?: (evt: ProgressEvent) => void;
}

export interface ProgressEvent {
  index: number;
  total: number;
  repo: string;
  before: string[];
  after: string[];
  reasoning: string;
}

export interface RefreshTagsResult {
  yamlContent: string;
  refreshedCount: number;
  skippedCount: number;
  failedCount: number;
  tokensUsed: number;
}

export async function refreshTags(opts: RefreshTagsOptions): Promise<RefreshTagsResult> {
  const doc = parseDocument(opts.yamlContent);
  const categoriesNode = doc.get("categories", true);
  if (!isSeq(categoriesNode)) {
    throw new Error("projects.yaml: top-level `categories` must be a sequence");
  }

  const targets: Array<{
    repo: string;
    name: string;
    category: string;
    description: string;
    tagline?: string;
    currentTags: string[];
    githubTopics: string[];
    entryNode: ReturnType<typeof parseDocument>["contents"];
  }> = [];

  for (const catItem of categoriesNode.items) {
    if (!isMap(catItem)) continue;
    const categoryName = stringFrom(catItem.get("name"));
    const entriesNode = catItem.get("entries", true);
    if (!isSeq(entriesNode)) continue;

    for (const entryItem of entriesNode.items) {
      if (!isMap(entryItem)) continue;
      const repo = stringFrom(entryItem.get("repo"));
      if (!repo) continue;
      const name = stringFrom(entryItem.get("name")) ?? repo;
      const description = stringFrom(entryItem.get("description")) ?? "";
      const tagline = stringFrom(entryItem.get("tagline"));
      const currentTags = arrayFrom(entryItem.get("tags", true));
      const githubTopics = opts.apiData[repo]?.topics ?? [];

      targets.push({
        repo,
        name,
        category: categoryName ?? "",
        description,
        tagline,
        currentTags,
        githubTopics,
        entryNode: entryItem as never,
      });
    }
  }

  const processed = opts.limit !== undefined ? targets.slice(0, opts.limit) : targets;

  let refreshedCount = 0;
  let failedCount = 0;
  let tokensUsed = 0;

  for (let i = 0; i < processed.length; i++) {
    const t = processed[i];
    try {
      const result = await curateTags({
        apiKey: opts.apiKey,
        name: t.name,
        repo: t.repo,
        category: t.category,
        description: t.description,
        tagline: t.tagline,
        currentTags: t.currentTags,
        githubTopics: t.githubTopics,
      });
      tokensUsed += result.tokensUsed;

      if (!opts.dryRun) {
        setFlowTags(t.entryNode as never, doc as never, result.tags);
      }
      refreshedCount++;
      opts.onProgress?.({
        index: i + 1,
        total: processed.length,
        repo: t.repo,
        before: t.currentTags,
        after: result.tags,
        reasoning: result.reasoning,
      });
    } catch (err) {
      failedCount++;
      console.error(`Failed ${t.repo}: ${err instanceof Error ? err.message : err}`);
    }
  }

  const out = opts.dryRun
    ? opts.yamlContent
    : doc
        .toString({ lineWidth: 0, indentSeq: false })
        .replace(/tags: \[ /g, "tags: [")
        .replace(/ \]$/gm, "]");

  return {
    yamlContent: out,
    refreshedCount,
    skippedCount: targets.length - processed.length,
    failedCount,
    tokensUsed,
  };
}

function stringFrom(node: unknown): string | undefined {
  if (typeof node === "string") return node;
  if (node && typeof node === "object" && isScalar(node as Scalar)) {
    const v = (node as Scalar).value;
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function arrayFrom(node: unknown): string[] {
  if (!node) return [];
  if (isSeq(node as YAMLSeq)) {
    return (node as YAMLSeq).items
      .map((it) => (isScalar(it as Scalar) ? (it as Scalar).value : it))
      .filter((v): v is string => typeof v === "string");
  }
  return [];
}

function setFlowTags(entryNode: never, doc: never, tags: string[]): void {
  const d = doc as ReturnType<typeof parseDocument>;
  const e = entryNode as { set: (k: string, v: unknown) => void };
  const seq = d.createNode(tags) as YAMLSeq;
  seq.flow = true;
  e.set("tags", seq);
}
