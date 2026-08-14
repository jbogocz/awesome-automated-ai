import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { loadManifest } from "../categories.js";
import { logger } from "../utils/logger.js";
import {
  findCrossCategoryDuplicates,
  findDuplicateReposInCategories,
  findStaleNoteYears,
  validateProjectsYaml,
} from "../validation/projects-yaml.js";

export interface ValidateOptions {
  projectsYamlPath: string;
}

export function runValidateCommand(options: ValidateOptions): void {
  let yamlContent: string;
  try {
    yamlContent = readFileSync(options.projectsYamlPath, "utf-8");
  } catch (err) {
    logger.error(`Cannot read ${options.projectsYamlPath}: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const parsed = parseYaml(yamlContent);
  const validation = validateProjectsYaml(parsed);
  if (!validation.ok) {
    logger.error(`projects.yaml validation failed: ${validation.error}`);
    process.exit(1);
  }

  // Cross-check category names against manifest
  const manifest = loadManifest();
  const manifestNames = new Set(manifest.categories.map((c) => c.name));
  const yamlNames = new Set(validation.data.categories.map((c) => c.name));

  const unknownInYaml = [...yamlNames].filter((n) => !manifestNames.has(n));
  const missingInYaml = [...manifestNames].filter((n) => !yamlNames.has(n));

  let ok = true;

  if (unknownInYaml.length > 0) {
    logger.warn(`Unknown categories in projects.yaml (not in categories.yaml): ${unknownInYaml.join(", ")}`);
    ok = false;
  }

  if (missingInYaml.length > 0) {
    logger.warn(`Categories missing from projects.yaml (present in categories.yaml): ${missingInYaml.join(", ")}`);
    ok = false;
  }

  // Check for entries without repo or url
  const orphanEntries: string[] = [];
  for (const cat of validation.data.categories) {
    for (const entry of cat.entries ?? []) {
      if (!entry.repo && !entry.url) {
        orphanEntries.push(`${cat.name} / ${entry.name}`);
      }
    }
  }

  if (orphanEntries.length > 0) {
    logger.warn(`Entries missing both repo and url: ${orphanEntries.join("; ")}`);
    ok = false;
  }

  const duplicateInCategory = findDuplicateReposInCategories(validation.data);
  if (duplicateInCategory.length > 0) {
    logger.warn(`Duplicate repos within a category: ${duplicateInCategory.join("; ")}`);
    ok = false;
  }

  // Advisory checks below. These describe curation drift rather than a broken
  // file, and some of them go true with no code change at all, so they must
  // never red-build an unrelated PR.
  const crossListed = findCrossCategoryDuplicates(validation.data);
  if (crossListed.length > 0) {
    logger.warn(
      `Cross-listed repos share one repo's stats, score and tagline: ${crossListed.join("; ")} ` +
        `— give each entry its own url + tagline, or drop one.`,
    );
  }

  const staleNotes = findStaleNoteYears(validation.data, new Date().getUTCFullYear());
  if (staleNotes.length > 0) {
    logger.warn(
      `Notes asserting a hard-coded year (the weekly regeneration cannot keep these true): ${staleNotes.join("; ")}`,
    );
  }

  if (ok) {
    logger.info(
      `projects.yaml is valid. ${validation.data.categories.length} categories, ${validation.data.categories.reduce((n, c) => n + (c.entries?.length ?? 0), 0)} entries.`,
    );
  } else {
    logger.error("Validation finished with warnings.");
    process.exit(1);
  }
}
