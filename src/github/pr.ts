import { Octokit } from "@octokit/rest";
import { stringify } from "yaml";
import type { Config } from "../config.js";

interface PrEntryInput {
  name: string;
  repo: string;
  description: string;
  tagline: string;
  tags: string[];
  note: string | null;
}

interface PrBodyInput {
  repo: string;
  category: string;
  description: string;
  relevanceScore: number;
  qualityScore: number;
  reasoning: string;
  source: string;
}

interface CreatePrOptions {
  config: Config;
  entry: PrEntryInput;
  category: string;
  bodyInput: PrBodyInput;
}

// Entry values derive from untrusted repo READMEs via the LLM, so they must be
// serialized through the yaml library — structural characters (colons, leading
// indicators, brackets) would otherwise inject keys or break projects.yaml.
// Values are flattened to one line to match the file's single-line convention.
function yamlScalar(value: string): string {
  return stringify(value.replace(/\s+/g, " ").trim(), { lineWidth: 0 }).trimEnd();
}

export function buildYamlEntry(input: PrEntryInput): string {
  const lines = [
    `  - name: ${yamlScalar(input.name)}`,
    `    repo: ${yamlScalar(input.repo)}`,
    `    description: ${yamlScalar(input.description)}`,
  ];
  if (input.tagline) {
    lines.push(`    tagline: ${yamlScalar(input.tagline)}`);
  }
  if (input.tags.length > 0) {
    const tags = input.tags.map((t) => t.replace(/\s+/g, " ").trim());
    lines.push(
      `    tags: ${stringify(tags, { collectionStyle: "flow", flowCollectionPadding: false, lineWidth: 0 }).trimEnd()}`,
    );
  }
  if (input.note) {
    lines.push(`    note: ${yamlScalar(input.note)}`);
  }
  return lines.join("\n");
}

export function buildPrBody(input: PrBodyInput): string {
  return `## Add [${input.repo}](https://github.com/${input.repo})

**Category:** ${input.category}
**Description:** ${input.description}

### Scores
| Metric | Score |
|--------|-------|
| Relevance | ${input.relevanceScore}/100 |
| Quality | ${input.qualityScore}/100 |

### Reasoning
${input.reasoning}

---
*Proposed by AI Curator Engine (discovery source: ${input.source})*
*Review and merge to add this project to the list.*`;
}

export async function createPr(opts: CreatePrOptions): Promise<number> {
  const { config, entry, category, bodyInput } = opts;
  const octokit = new Octokit({ auth: config.githubToken });
  const owner = config.githubRepoOwner;
  const repo = config.githubRepoName;

  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
  const baseSha = ref.object.sha;

  const branchName = `ai-curator/add-${entry.repo.replace("/", "-")}-${Date.now()}`;
  await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });

  const { data: fileData } = await octokit.repos.getContent({ owner, repo, path: "projects.yaml", ref: branchName });
  if (!("content" in fileData) || typeof fileData.content !== "string") {
    throw new Error("Could not read projects.yaml");
  }

  const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  const yamlEntry = buildYamlEntry(entry);
  const updatedContent = insertEntry(currentContent, category, yamlEntry);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: "projects.yaml",
    message: `feat: add ${entry.name} to ${category}\n\nProposed by AI Curator Engine`,
    content: Buffer.from(updatedContent).toString("base64"),
    sha: (fileData as { sha: string }).sha,
    branch: branchName,
  });

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: `Add ${entry.name} to ${category}`,
    body: buildPrBody(bodyInput),
    head: branchName,
    base: "main",
  });

  return pr.number;
}

function insertEntry(yamlContent: string, category: string, newEntry: string): string {
  const lines = yamlContent.split("\n");
  let inTargetCategory = false;
  let lastEntryLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("- name: ")) {
      if (inTargetCategory && lastEntryLine > 0) break;
      inTargetCategory = line === `- name: ${category}`;
    }
    if (inTargetCategory && line.startsWith("  - name: ")) {
      lastEntryLine = i;
      while (i + 1 < lines.length) {
        const next = lines[i + 1] ?? "";
        if (!next.startsWith("    ") || next.startsWith("  - ")) break;
        i++;
        lastEntryLine = i;
      }
    }
  }

  if (lastEntryLine === -1) {
    return `${yamlContent}\n${newEntry}\n`;
  }
  lines.splice(lastEntryLine + 1, 0, newEntry);
  return lines.join("\n");
}
