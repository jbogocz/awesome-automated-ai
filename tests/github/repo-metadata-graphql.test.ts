import { beforeEach, describe, expect, it, vi } from "vitest";

const mockExec = vi.fn();
vi.mock("node:child_process", () => ({
  execFileSync: (...args: unknown[]) => mockExec(...args),
}));

const { buildMetadataQuery, parseMetadataResponse, fetchRepoMetadataBatch } = await import(
  "../../src/github/repo-metadata-graphql.js"
);

describe("buildMetadataQuery", () => {
  it("aliases each repo and requests all metadata fields", () => {
    const q = buildMetadataQuery(["autogluon/autogluon", "pycaret/pycaret"]);
    expect(q).toContain('r0: repository(owner: "autogluon", name: "autogluon")');
    expect(q).toContain('r1: repository(owner: "pycaret", name: "pycaret")');
    for (const field of [
      "stargazerCount",
      "pushedAt",
      "isArchived",
      "licenseInfo { spdxId }",
      "primaryLanguage { name }",
      "repositoryTopics(first: 20)",
      "latestRelease { publishedAt }",
      'refs(refPrefix: "refs/tags/", first: 20, orderBy: {field: TAG_COMMIT_DATE, direction: DESC})',
      "committedDate history(since:",
    ]) {
      expect(q).toContain(field);
    }
  });

  it("uses the provided pulse window start date", () => {
    const q = buildMetadataQuery(["a/b"], "2026-04-18T00:00:00.000Z");
    expect(q).toContain('history(since: "2026-04-18T00:00:00.000Z")');
  });

  it("strips GraphQL-breaking characters from owner/name (injection hardening)", () => {
    const q = buildMetadataQuery(['evil"){ x }(owner/name"']);
    expect(q).not.toContain('""');
    expect(q).toContain('owner: "evilxowner"');
  });
});

describe("parseMetadataResponse", () => {
  const fullNode = {
    stargazerCount: 12000,
    pushedAt: "2026-07-12T00:00:00Z",
    isArchived: false,
    licenseInfo: { spdxId: "Apache-2.0" },
    primaryLanguage: { name: "Python" },
    repositoryTopics: { nodes: [{ topic: { name: "automl" } }, { topic: { name: "ml" } }] },
    latestRelease: { publishedAt: "2026-07-05T00:00:00Z" },
    refs: { nodes: [{ name: "v2.1.0", target: { committedDate: "2026-07-04T00:00:00Z" } }] },
    defaultBranchRef: { target: { committedDate: "2026-07-10T00:00:00Z", history: { totalCount: 42 } } },
  };

  it("maps a full node, keeping pushed as the RAW pushedAt (never a max)", () => {
    const out = parseMetadataResponse(["a/b"], { data: { r0: fullNode } });
    expect(out.get("a/b")).toEqual({
      stars: 12000,
      pushed: "2026-07-12T00:00:00Z",
      archived: false,
      license: "Apache-2.0",
      topics: ["automl", "ml"],
      lastRelease: "2026-07-05T00:00:00Z",
      lastCommit: "2026-07-10T00:00:00Z",
      lastTag: "2026-07-04T00:00:00Z",
      lastStableTag: "2026-07-04T00:00:00Z",
      commits90d: 42,
      language: "Python",
    });
  });

  it("splits newest-any vs newest-stable when prereleases lead the tag list", () => {
    const out = parseMetadataResponse(["a/b"], {
      data: {
        r0: {
          ...fullNode,
          refs: {
            nodes: [
              { name: "v4.0.0a2", target: { committedDate: "2026-04-24T00:00:00Z" } },
              { name: "v4.0.0a1", target: { committedDate: "2026-02-01T00:00:00Z" } },
              { name: "3.3.2", target: { committedDate: "2024-04-28T00:00:00Z" } },
            ],
          },
        },
      },
    });
    const meta = out.get("a/b");
    expect(meta?.lastTag).toBe("2026-04-24T00:00:00Z"); // the alpha — life sign
    expect(meta?.lastStableTag).toBe("2024-04-28T00:00:00Z"); // 3.3.2 — shipping
  });

  it("extracts the tag date from annotated tags (Tag node with tagger)", () => {
    const out = parseMetadataResponse(["a/b"], {
      data: {
        r0: {
          ...fullNode,
          refs: { nodes: [{ target: { tagger: { date: "2026-06-01T00:00:00Z" } } }] },
        },
      },
    });
    expect(out.get("a/b")?.lastTag).toBe("2026-06-01T00:00:00Z");
  });

  it("falls back to the annotated tag's commit date when tagger is absent", () => {
    const out = parseMetadataResponse(["a/b"], {
      data: {
        r0: {
          ...fullNode,
          refs: { nodes: [{ target: { target: { committedDate: "2026-05-01T00:00:00Z" } } }] },
        },
      },
    });
    expect(out.get("a/b")?.lastTag).toBe("2026-05-01T00:00:00Z");
  });

  it("handles repos without release/tag/commit/license/language/topics", () => {
    const out = parseMetadataResponse(["a/b"], {
      data: {
        r0: {
          stargazerCount: 5,
          pushedAt: "2026-01-01T00:00:00Z",
          isArchived: true,
          licenseInfo: null,
          primaryLanguage: null,
          repositoryTopics: { nodes: [] },
          latestRelease: null,
          refs: { nodes: [] },
          defaultBranchRef: null,
        },
      },
    });
    expect(out.get("a/b")).toEqual({
      stars: 5,
      pushed: "2026-01-01T00:00:00Z",
      archived: true,
      license: null,
      topics: [],
      lastRelease: null,
      lastCommit: null,
      lastTag: null,
      lastStableTag: null,
      commits90d: null,
      language: null,
    });
  });

  it("omits aliases with GraphQL errors or missing data instead of fabricating zeros", () => {
    // A zeroed entry would be snapshotted into the DB (poisoning star trends)
    // and rendered as a dead 0-star project; absence means "no data".
    const out = parseMetadataResponse(["gone/repo", "ok/repo"], {
      data: { r0: null, r1: { stargazerCount: 1 } },
      errors: [{ path: ["r0"], message: "Could not resolve", type: "NOT_FOUND" }],
    });
    expect(out.has("gone/repo")).toBe(false);
    expect(out.get("ok/repo")?.stars).toBe(1);
  });

  it("errored alias overrides partially-present data", () => {
    const out = parseMetadataResponse(["a/b"], {
      data: { r0: { stargazerCount: 7 } },
      errors: [{ path: ["r0"], message: "FORBIDDEN", type: "FORBIDDEN" }],
    });
    expect(out.has("a/b")).toBe(false);
  });
});

describe("fetchRepoMetadataBatch transport", () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it("recovers partial data when gh exits non-zero because one alias errored", async () => {
    // gh api graphql exits 1 whenever the response carries `errors`, but the
    // full JSON body (with data for the healthy aliases) is on stdout.
    const body = JSON.stringify({
      data: { r0: { stargazerCount: 7, pushedAt: "2026-01-01T00:00:00Z", isArchived: false }, r1: null },
      errors: [{ path: ["r1"], message: "Could not resolve to a Repository", type: "NOT_FOUND" }],
    });
    mockExec.mockImplementation(() => {
      const err = new Error("Command failed: gh api graphql") as Error & { stdout: string };
      err.stdout = body;
      throw err;
    });

    const out = await fetchRepoMetadataBatch(["ok/repo", "gone/repo"]);
    expect(out.get("ok/repo")?.stars).toBe(7);
    expect(out.has("gone/repo")).toBe(false);
  });

  it("omits the whole chunk on a non-JSON hard failure", async () => {
    mockExec.mockImplementation(() => {
      const err = new Error("gh: command not found") as Error & { stdout: string };
      err.stdout = "";
      throw err;
    });
    const out = await fetchRepoMetadataBatch(["a/b"]);
    expect(out.has("a/b")).toBe(false);
  });
});
