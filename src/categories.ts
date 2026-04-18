import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export interface CategoryInfo {
  id: string;
  name: string;
  section: string;
  description: string;
  scope_in: string[];
  scope_out: string[];
  examples: string[];
}

export interface Manifest {
  sections: string[];
  categories: CategoryInfo[];
}

const DEFAULT_PATH = resolve(import.meta.dirname, "./categories.yaml");

export function loadManifest(path: string = DEFAULT_PATH): Manifest {
  const raw = readFileSync(path, "utf-8");
  const parsed = parseYaml(raw) as Partial<Manifest>;
  if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
    throw new Error(`Manifest ${path} has no categories`);
  }
  return {
    sections: parsed.sections ?? [],
    categories: parsed.categories.map((c) => ({
      id: c.id,
      name: c.name,
      section: c.section,
      description: c.description ?? "",
      scope_in: c.scope_in ?? [],
      scope_out: c.scope_out ?? [],
      examples: c.examples ?? [],
    })),
  };
}

export function renderCategoryCatalog(categories: CategoryInfo[]): string {
  return categories
    .map((c) => {
      const inBlock = c.scope_in.length > 0 ? c.scope_in.map((s) => `    - ${s}`).join("\n") : "    - (unspecified)";
      const outBlock = c.scope_out.length > 0 ? c.scope_out.map((s) => `    - ${s}`).join("\n") : "    - (unspecified)";
      const examples = c.examples.length > 0 ? c.examples.join(", ") : "(none)";
      return [
        `### ${c.name}`,
        c.description,
        "  Scope in:",
        inBlock,
        "  Scope out:",
        outBlock,
        `  Examples: ${examples}`,
      ].join("\n");
    })
    .join("\n\n");
}
