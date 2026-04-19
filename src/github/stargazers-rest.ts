import { execFileSync } from "node:child_process";
import type { RepoStargazersPage } from "./types.js";

const GH_TIMEOUT_MS = 15_000;

function categorizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/HTTP 404|Not Found/i.test(msg)) return "not_found";
  if (/HTTP 410/i.test(msg)) return "not_found";
  if (/HTTP 422/i.test(msg)) return "unprocessable";
  if (/HTTP 403/i.test(msg)) return "forbidden";
  if (/HTTP 5\d\d/i.test(msg)) return "server_error";
  return "network";
}

interface RawPage {
  linkHeader: string;
  data: { starred_at: string }[];
}

function ghRequest(repo: string, page: number): RawPage {
  const out = execFileSync(
    "gh",
    [
      "api",
      "-H",
      "Accept: application/vnd.github.star+json",
      `repos/${repo}/stargazers?per_page=100&page=${page}`,
      "--include",
    ],
    { timeout: GH_TIMEOUT_MS, encoding: "utf-8" },
  );
  const separatorIdx = out.indexOf("\r\n\r\n");
  const rawHeaders = separatorIdx >= 0 ? out.slice(0, separatorIdx) : "";
  const body = separatorIdx >= 0 ? out.slice(separatorIdx + 4) : out;
  const linkMatch = rawHeaders.match(/^Link:\s*(.+)$/im);
  const link = linkMatch ? linkMatch[1].trim() : "";
  const data = body.trim().length ? (JSON.parse(body) as { starred_at: string }[]) : [];
  return { linkHeader: link, data };
}

function extractLastPage(linkHeader: string): number | null {
  const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

export async function fetchRecentStargazersRest(repo: string, since: Date): Promise<RepoStargazersPage> {
  try {
    const head = ghRequest(repo, 1);
    const lastPage = extractLastPage(head.linkHeader) ?? 1;

    const stars: { starredAt: string }[] = [];
    for (let page = lastPage; page >= 1; page--) {
      const p = page === 1 ? head : ghRequest(repo, page);
      if (p.data.length === 0) break;
      const firstOnPage = new Date(p.data[0].starred_at);
      for (const entry of p.data) {
        const d = new Date(entry.starred_at);
        if (d >= since) stars.push({ starredAt: entry.starred_at });
      }
      if (firstOnPage < since) break;
    }

    return {
      stargazers: stars,
      totalCount: stars.length,
      hasNextPage: false,
      endCursor: null,
    };
  } catch (err) {
    return {
      stargazers: [],
      totalCount: 0,
      hasNextPage: false,
      endCursor: null,
      error: categorizeError(err),
    };
  }
}
