# Changelog

All notable additions, removals, and curation updates to this list are documented here.

## 2026-04-17 - Major content expansion

### Added
- **15 new 2024-26 tools** covering the modern agentic AI stack:
  - ML Engineering Agents: AG2, LangGraph, Pydantic AI, smolagents, Google ADK, Mem0, Browser Use, E2B, Magentic-UI
  - Automated AI Research: GPT Researcher
  - Automated Data Preprocessing: Data Formulator, NeMo Curator, Presidio
  - Automated Fine-Tuning: LeRobot
  - LLM Evaluation and Testing: Gorilla
- **Commercial Products** (8 entries) - new category covering Vertex AI AutoML, Azure ML AutoML, SageMaker Autopilot, H2O Driverless AI, DataRobot, Databricks AutoML, Dataiku Visual ML, Snowflake Cortex ML
- **Papers and Surveys** (22 entries) - new category with foundational surveys on NAS, HPO, AutoML benchmarking, LLM agents, and meta-learning

### Changed
- Curated `tags:` metadata for 33 entries previously missing topic tags (improves dashboard filterability)
- Added maintenance notes to entries with stale GitHub activity: Once-For-All, AutoPyTorch, Google AutoML, Autolabel
- Marked 3 GitHub-archived projects with explicit notes: Merlion, Gretel Synthetics, NAS-Bench-101
- Tightened note on Auto-WEKA (`Historical; Java-only, no commits since 2022`)
- Softened Hyperopt note to reflect ongoing maintenance commits
- Disambiguated Ray (MLOps umbrella) from Ray Tune (HPO library); trimmed Ray Tune tags to HPO-specific
- Removed stale `Low activity since 2022` note from LazyPredict (project resumed activity in 2026)

### Engine
- Extended generator to render non-GitHub entries (`url:` only) with dedicated card styles for commercial products and research papers
- Added `vendor`, `pricing`, `authors`, `venue`, `year` metadata fields in YAML schema

## Earlier

Previously the list was iterated weekly via the AI-driven regeneration pipeline. See git log prior to this changelog for history.
