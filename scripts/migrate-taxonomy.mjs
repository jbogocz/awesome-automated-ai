#!/usr/bin/env node
// One-shot migration that restructures projects.yaml to match src/categories.yaml.
//
// Moves:
//   - Commercial Products entries -> General-Purpose AutoML (+ commercial: true)
//   - Foundation Models as AutoML time-series -> Time-Series AutoML (renames rest to Tabular Foundation Models)
//   - ML Engineering Agents + Automated AI Research -> Agent Frameworks / Coding Agents / ML & Research Agents
//   - Automated Deployment and Serving -> Model Serving / LLM Inference Runtimes
//
// Also:
//   - Removes AutoGen (duplicate of AG2); updates AG2 description to note the merge.
//   - Fills empty description for Related Awesome Lists.
//   - Reorders categories to match the manifest.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isMap, isScalar, isSeq, parseDocument, parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PROJECTS_YAML = resolve(ROOT, "projects.yaml");
const MANIFEST_YAML = resolve(ROOT, "src/categories.yaml");

const manifest = parseYaml(readFileSync(MANIFEST_YAML, "utf-8"));
const orderedCategoryNames = manifest.categories.map((c) => c.name);
const manifestByName = new Map(manifest.categories.map((c) => [c.name, c]));

const toolToNewCategory = Object.entries({
  "Agent Frameworks": [
    "AG2",
    "CrewAI",
    "LangGraph",
    "Pydantic AI",
    "smolagents",
    "Google ADK for Python",
    "Mem0",
    "Browser Use",
    "E2B",
    "Magentic-UI",
  ],
  "Coding Agents": ["OpenHands", "Aider", "SWE-agent", "mini-swe-agent", "AutoCodeRover"],
  "ML and Research Agents": [
    "AutoResearch",
    "STORM",
    "AI-Scientist",
    "PaperQA",
    "AI-Scientist-v2",
    "AI-Researcher",
    "AIDE",
    "AutoML-Agent",
    "GPT Researcher",
  ],
  "Model Serving": [
    "ONNX Runtime",
    "Triton Inference Server",
    "OpenVINO",
    "BentoML",
    "KServe",
    "ExecuTorch",
    "LitServe",
    "Cog",
    "TFX",
  ],
  "LLM Inference Runtimes": ["Ollama", "llama.cpp", "vLLM", "SGLang", "TensorRT-LLM", "LMDeploy", "LightLLM"],
  "Time-Series AutoML": ["TimesFM", "Chronos", "Moirai"],
  "General-Purpose AutoML": [
    "Vertex AI AutoML",
    "Azure Machine Learning AutoML",
    "Amazon SageMaker Autopilot",
    "H2O Driverless AI",
    "DataRobot",
    "Databricks AutoML",
    "Dataiku Visual ML",
    "Snowflake Cortex ML Functions",
  ],
}).flatMap(([cat, tools]) => tools.map((t) => [t, cat]));
const newCatByTool = new Map(toolToNewCategory);

const commercialTools = new Set([
  "Vertex AI AutoML",
  "Azure Machine Learning AutoML",
  "Amazon SageMaker Autopilot",
  "H2O Driverless AI",
  "DataRobot",
  "Databricks AutoML",
  "Dataiku Visual ML",
  "Snowflake Cortex ML Functions",
]);

const toolsToRemove = new Set(["AutoGen"]);

const categoryRenames = new Map([["Foundation Models as AutoML", "Tabular Foundation Models"]]);

const dissolvedCategories = new Set([
  "Commercial Products",
  "ML Engineering Agents",
  "Automated AI Research",
  "Automated Deployment and Serving",
]);

const doc = parseDocument(readFileSync(PROJECTS_YAML, "utf-8"));
const categoriesNode = doc.get("categories", true);
if (!isSeq(categoriesNode)) throw new Error("projects.yaml: categories is not a sequence");

function scalarValue(node) {
  if (node == null) return undefined;
  if (typeof node === "string") return node;
  if (isScalar(node)) return node.value;
  return undefined;
}

// Extract entries keyed by old category name, preserving the YAMLMap nodes so tag flow style survives.
const entriesByOldCategory = new Map();
for (const catItem of categoriesNode.items) {
  if (!isMap(catItem)) continue;
  const name = scalarValue(catItem.get("name"));
  const entriesNode = catItem.get("entries", true);
  const list = isSeq(entriesNode) ? entriesNode.items.filter(isMap) : [];
  entriesByOldCategory.set(name, list);
}

function resolveNewCategory(oldCat, entryName) {
  if (newCatByTool.has(entryName)) return newCatByTool.get(entryName);
  if (categoryRenames.has(oldCat)) return categoryRenames.get(oldCat);
  if (dissolvedCategories.has(oldCat)) {
    throw new Error(`No mapping for ${entryName} (was in dissolved category ${oldCat})`);
  }
  return oldCat;
}

const newCategoryBuckets = new Map(orderedCategoryNames.map((n) => [n, []]));

for (const [oldCat, entries] of entriesByOldCategory) {
  for (const entry of entries) {
    const entryName = scalarValue(entry.get("name"));
    if (toolsToRemove.has(entryName)) continue;

    const target = resolveNewCategory(oldCat, entryName);
    if (!newCategoryBuckets.has(target)) {
      throw new Error(`Unknown target category '${target}' for entry '${entryName}'`);
    }

    if (commercialTools.has(entryName) && entry.get("commercial") === undefined) {
      entry.set("commercial", true);
    }

    if (entryName === "AG2") {
      const desc = scalarValue(entry.get("description")) ?? "";
      if (!/formerly AutoGen/i.test(desc)) {
        entry.set(
          "description",
          "Multi-agent framework for building conversational agent systems with tool use and code execution (formerly AutoGen, continued as AG2 after Microsoft put AutoGen in maintenance mode).",
        );
      }
    }

    newCategoryBuckets.get(target).push(entry);
  }
}

// Replace the top-level sequence with one rebuilt in manifest order.
categoriesNode.items.length = 0;
for (const catName of orderedCategoryNames) {
  const manifestMeta = manifestByName.get(catName);
  const description = manifestMeta?.description ?? "";
  const entries = newCategoryBuckets.get(catName) ?? [];

  const catMap = doc.createNode({ name: catName, description, entries: [] });
  // Replace the auto-created (empty) entries sequence with the pre-existing YAMLMap nodes
  // so tag flow formatting is preserved.
  const entriesSeq = catMap.get("entries", true);
  for (const entry of entries) entriesSeq.items.push(entry);

  categoriesNode.items.push(catMap);
}

let out = doc.toString({ lineWidth: 0, indentSeq: false });
// Tag sequences lose a little formatting when re-serialised; reapply the project convention.
out = out.replace(/tags: \[ /g, "tags: [").replace(/ \]$/gm, "]");

writeFileSync(PROJECTS_YAML, out);

console.log("Migration done.");
for (const catName of orderedCategoryNames) {
  const count = newCategoryBuckets.get(catName)?.length ?? 0;
  console.log(`  ${catName.padEnd(40)} ${count}`);
}
