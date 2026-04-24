import { z } from "zod";

/**
 * Zod schema for a single entry in projects.yaml.
 */
export const EntrySchema = z.object({
  name: z.string().min(1),
  repo: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().min(1),
  tagline: z.string().optional(),
  note: z.string().optional(),
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
