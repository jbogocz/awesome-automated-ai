import { describe, expect, it } from "vitest";
import {
  findCrossCategoryDuplicates,
  findDuplicateReposInCategories,
  findStaleNoteYears,
  validateProjectsYaml,
} from "../../src/validation/projects-yaml.js";

describe("validateProjectsYaml", () => {
  it("accepts a minimal valid document", () => {
    const result = validateProjectsYaml({
      categories: [
        {
          name: "Test Category",
          entries: [{ name: "Tool", repo: "owner/repo", description: "A tool." }],
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.categories).toHaveLength(1);
    }
  });

  it("rejects missing categories", () => {
    const result = validateProjectsYaml({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("categories");
    }
  });

  it("rejects empty categories array", () => {
    const result = validateProjectsYaml({ categories: [] });
    expect(result.ok).toBe(false);
  });

  it("rejects entry missing name", () => {
    const result = validateProjectsYaml({
      categories: [
        {
          name: "Bad",
          entries: [{ repo: "a/b", description: "desc" } as unknown as Record<string, unknown>],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("accepts external entries with url instead of repo", () => {
    const result = validateProjectsYaml({
      categories: [
        {
          name: "External",
          entries: [{ name: "Vendor", url: "https://example.com", description: "A product." }],
        },
      ],
    });
    expect(result.ok).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = validateProjectsYaml({
      categories: [
        {
          name: "Full",
          description: "A category",
          entries: [
            {
              name: "Tool",
              repo: "owner/repo",
              description: "A tool.",
              tagline: "Short tagline",
              note: "A note",
              tags: ["ml", "ai"],
              commercial: true,
              vendor: "Acme",
            },
          ],
        },
      ],
    });
    expect(result.ok).toBe(true);
  });
});

describe("findDuplicateReposInCategories", () => {
  const entry = (repo: string) => ({ name: repo, repo, description: "d" });

  it("flags the same repo twice within one category", () => {
    const dups = findDuplicateReposInCategories({
      categories: [{ name: "HPO", entries: [entry("a/b"), entry("c/d"), entry("a/b")] }],
    });
    expect(dups).toEqual(["HPO / a/b"]);
  });

  it("allows the same repo across different categories (cross-listing)", () => {
    const dups = findDuplicateReposInCategories({
      categories: [
        { name: "HPO", entries: [entry("ray-project/ray")] },
        { name: "MLOps", entries: [entry("ray-project/ray")] },
      ],
    });
    expect(dups).toEqual([]);
  });

  it("ignores entries without a repo", () => {
    const dups = findDuplicateReposInCategories({
      categories: [
        {
          name: "Commercial",
          entries: [
            { name: "X", url: "https://example.com", description: "d" },
            { name: "Y", url: "https://example.com", description: "d" },
          ],
        },
      ],
    });
    expect(dups).toEqual([]);
  });
});

describe("EntrySchema hardening", () => {
  const doc = (entry: Record<string, unknown>) => ({
    categories: [{ name: "C", entries: [{ name: "N", description: "D", ...entry }] }],
  });

  it("rejects a repo that is not owner/name", () => {
    for (const bad of ["justname", "a/b/c", "https://github.com/a/b", "/leading", "trailing/"]) {
      expect(validateProjectsYaml(doc({ repo: bad })).ok).toBe(false);
    }
  });

  it("accepts real-world owner/name slugs", () => {
    for (const good of [
      "openai/codex",
      "Data-Centric-AI-Community/fg-data-profiling",
      "ggml-org/llama.cpp",
      "pytorch/ao",
    ]) {
      expect(validateProjectsYaml(doc({ repo: good })).ok).toBe(true);
    }
  });

  // escapeText in docs/lib.js blocks attribute breakout but not the scheme,
  // and the entry url becomes an href on both the site and the README.
  it("rejects non-http(s) url schemes", () => {
    for (const bad of ["javascript:alert(1)", "data:text/html,<script>x</script>", "file:///etc/passwd"]) {
      expect(validateProjectsYaml(doc({ url: bad })).ok).toBe(false);
    }
    expect(validateProjectsYaml(doc({ url: "https://example.com/x" })).ok).toBe(true);
  });
});

describe("findCrossCategoryDuplicates", () => {
  const e = (repo: string) => ({ name: repo, repo, description: "d" });

  it("reports a repo cross-listed in two categories with both category names", () => {
    const out = findCrossCategoryDuplicates({
      categories: [
        { name: "HPO", entries: [e("ray-project/ray")] },
        { name: "MLOps", entries: [e("ray-project/ray")] },
      ],
    });
    expect(out).toEqual(["ray-project/ray (HPO + MLOps)"]);
  });

  it("does not report a repo listed twice inside one category", () => {
    // That case is findDuplicateReposInCategories' job, and it is a hard error.
    const out = findCrossCategoryDuplicates({
      categories: [{ name: "HPO", entries: [e("a/b"), e("a/b")] }],
    });
    expect(out).toEqual([]);
  });

  it("is quiet when every repo appears once", () => {
    expect(
      findCrossCategoryDuplicates({
        categories: [
          { name: "A", entries: [e("a/b")] },
          { name: "B", entries: [e("c/d")] },
        ],
      }),
    ).toEqual([]);
  });
});

describe("findStaleNoteYears", () => {
  const withNote = (note: string) => ({
    categories: [{ name: "C", entries: [{ name: "Hyperopt", description: "d", note }] }],
  });

  it("flags a hard-coded year the weekly regeneration cannot keep true", () => {
    const out = findStaleNoteYears(withNote("Maintenance-only since 2021 - Optuna is successor."), 2026);
    expect(out).toHaveLength(1);
    expect(out[0]).toContain("2021");
    expect(out[0]).toContain("5y ago");
  });

  it("is quiet for a note carrying only a durable judgement", () => {
    expect(findStaleNoteYears(withNote("Optuna is the recommended successor for new work."), 2026)).toEqual([]);
  });

  it("is quiet when there is no note at all", () => {
    expect(
      findStaleNoteYears({ categories: [{ name: "C", entries: [{ name: "X", description: "d" }] }] }, 2026),
    ).toEqual([]);
  });
});
