import { z } from "zod";

/**
 * Zod schema for a single entry in projects.yaml.
 */
/** owner/name, the only shape the GitHub API and the generated links accept. */
const REPO_SLUG = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

/**
 * http(s) only. escapeText in docs/lib.js prevents attribute breakout but not
 * a `javascript:` or `data:` URL reaching an href, so the scheme is rejected
 * at the source instead.
 */
const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), { message: "must be an http(s) URL" });

export const EntrySchema = z.object({
  name: z.string().min(1),
  repo: z.string().regex(REPO_SLUG, "must be owner/name").optional(),
  url: httpUrl.optional(),
  description: z.string().min(1),
  tagline: z.string().optional(),
  note: z.string().optional(),
  /**
   * Curator-declared lifecycle. Drives presentation via status.displayBucket;
   * previously inferred by regexing the free-text note, which the site could
   * not reproduce.
   */
  lifecycle: z.enum(["historical", "deprecated"]).optional(),
  tags: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  pricing: z.string().optional(),
  authors: z.string().optional(),
  venue: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
  commercial: z.boolean().optional(),
});

export type Entry = z.infer<typeof EntrySchema>;

/**
 * Zod schema for a category in projects.yaml.
 */
export const CategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  entries: z.array(EntrySchema).optional(),
});

export type Category = z.infer<typeof CategorySchema>;

/**
 * Zod schema for the top-level projects.yaml document.
 */
export const ProjectsYamlSchema = z.object({
  categories: z.array(CategorySchema).min(1),
});

export type ProjectsYaml = z.infer<typeof ProjectsYamlSchema>;

/**
 * Validate raw YAML-parsed data against the schema.
 * Returns { ok: true, data } on success or { ok: false, error } on failure.
 */
export function validateProjectsYaml(raw: unknown): { ok: true; data: ProjectsYaml } | { ok: false; error: string } {
  const result = ProjectsYamlSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`).join("; ");
    return { ok: false, error: issues };
  }
  return { ok: true, data: result.data };
}

/**
 * Find repos listed more than once within a single category — always a
 * mistake. The same repo across DIFFERENT categories is allowed (deliberate
 * cross-listing, e.g. Ray Tune under HPO and Ray under MLOps).
 * Returns "category / repo" strings for each duplicate occurrence.
 */
export function findDuplicateReposInCategories(data: ProjectsYaml): string[] {
  const duplicates: string[] = [];
  for (const cat of data.categories) {
    const seen = new Set<string>();
    for (const entry of cat.entries ?? []) {
      if (!entry.repo) continue;
      if (seen.has(entry.repo)) {
        duplicates.push(`${cat.name} / ${entry.repo}`);
      }
      seen.add(entry.repo);
    }
  }
  return duplicates;
}

/**
 * Repos cross-listed in more than one category. Deliberate cross-listing is
 * allowed, but both entries are keyed on the same repo, so they inherit
 * identical stars, score, status and tagline — the reader sees one project
 * twice with the same numbers. Reported as a warning, never a failure.
 */
export function findCrossCategoryDuplicates(data: ProjectsYaml): string[] {
  const byRepo = new Map<string, string[]>();
  for (const cat of data.categories) {
    for (const entry of cat.entries ?? []) {
      if (!entry.repo) continue;
      const cats = byRepo.get(entry.repo) ?? [];
      if (!cats.includes(cat.name)) cats.push(cat.name);
      byRepo.set(entry.repo, cats);
    }
  }
  return [...byRepo.entries()]
    .filter(([, cats]) => cats.length > 1)
    .map(([repo, cats]) => `${repo} (${cats.join(" + ")})`);
}

/**
 * Notes asserting a year that the entry's own rendered data contradicts.
 * Hand-typed date prose cannot survive an unattended weekly regeneration:
 * Hyperopt's "Maintenance-only since 2021" outlived four years of releases
 * and rendered above its own green Jul 2026 commit.
 */
export function findStaleNoteYears(data: ProjectsYaml, currentYear: number): string[] {
  const stale: string[] = [];
  for (const cat of data.categories) {
    for (const entry of cat.entries ?? []) {
      if (!entry.note) continue;
      for (const m of entry.note.matchAll(/\b(19|20)\d{2}\b/g)) {
        stale.push(`${cat.name} / ${entry.name}: note cites ${m[0]} (${currentYear - Number(m[0])}y ago)`);
      }
    }
  }
  return stale;
}
