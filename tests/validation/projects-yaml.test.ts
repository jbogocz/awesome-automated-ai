import { describe, expect, it } from "vitest";
import { validateProjectsYaml } from "../../src/validation/projects-yaml.js";

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
