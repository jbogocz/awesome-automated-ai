import { Octokit } from "@octokit/rest";
import type { Config } from "../config.js";

interface PrEntryInput {
  name: string;
  repo: string;
  description: string;
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

export function buildYamlEntry(input: PrEntryInput): string {
  const lines = [`  - name: ${input.name}`, `    repo: ${input.repo}`, `    description: ${input.description}`];
  if (input.note) {
    lines.push(`    note: ${input.note}`);
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
    const line = lines[i];
    if (line.startsWith("- name: ")) {
      if (inTargetCategory && lastEntryLine > 0) break;
      inTargetCategory = line === `- name: ${category}`;
    }
    if (inTargetCategory && line.startsWith("  - name: ")) {
      lastEntryLine = i;
      while (i + 1 < lines.length && lines[i + 1].startsWith("    ") && !lines[i + 1].startsWith("  - ")) {
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
