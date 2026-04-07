# Contributing

Thank you for contributing to Awesome AutoML! This list aims to be the most comprehensive and up-to-date resource for automating AI/ML.

Please read this guide before submitting a pull request.

## The Golden Rule

**Only suggest things you can personally recommend.** The word "awesome" is a quality bar, not a participation trophy. If you would not recommend a tool to a colleague, it does not belong here.

## Adding an Entry

### Step by Step

1. Fork and clone this repository.
2. Create a new branch: `git checkout -b add-tool-name`.
3. Add your entry to the correct category in `README.md`.
4. Ensure your entry follows the format below.
5. Commit and push your changes.
6. Open a pull request and fill out the template (including "Why is this awesome?").

### Entry Format

Use exactly this format:

```
- [Name](URL) - Description ending with a period.
```

**Good examples:**
- `- [AutoGluon](https://github.com/autogluon/autogluon) - Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon).`
- `- [Optuna](https://github.com/optuna/optuna) - Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework.`

**Bad examples:**
- `- [ToolName](url) - A tool for doing things.` - too vague, says nothing specific
- `- [ToolName](url) - ToolName is a framework...` - do not start with the tool's name
- `- [ToolName](url) - Best ML tool ever!!!` - no unsubstantiated claims

### Formatting Rules

- The description should start with a capital letter and end with a period.
- Do not start the description with the name of the tool.
- Keep descriptions to one or two sentences that explain **what makes it valuable**, not just what it does.
- Include the organization in parentheses at the end if it is a well-known company: `(Google)`, `(Microsoft)`.
- Mark unmaintained or deprecated projects with bold inline notes: `**Unmaintained since [date].**`
- Entries are ordered by relevance within each category; place new entries where they best fit.
- Check your spelling and grammar.
- Make sure your text editor is set to remove trailing whitespace.

## Quality Standards

### What TO Submit

- Open-source projects or those with a significant open-source component.
- Actively maintained projects (commits within the last 12 months).
- Projects with at least 100 GitHub stars, unless from a well-known organization or filling a unique niche.
- Historically significant projects (mark them clearly as historical).

### What NOT to Submit

- **Link dumps** - do not submit 10 entries at once with minimal descriptions.
- **Your own project without disclosure** - self-promotion is welcome if you are transparent about it. Note it in the PR description.
- **Closed-source tools** - unless they have a significant open-source component or are genuinely groundbreaking.
- **Abandoned projects** without marking them as such.
- **Duplicate tools** - check if a similar tool is already listed. Explain the differentiation if you believe both should be included.
- **AI-generated descriptions** - write descriptions in your own words.

## Suggesting New Categories

If a tool does not fit any existing category, open an issue to discuss adding a new one before submitting a pull request. New categories should have at least 3-4 potential entries.

## Updating Entries

- If a project has been archived or deprecated, open a pull request to add a warning note.
- If a description is inaccurate or outdated, open a pull request to correct it.
- If you find a broken link, please report it via an issue or fix it in a PR.

## Removing Entries

Entries may be removed if:
- The project has been archived for 2+ years with no fork carrying development forward.
- The project has critical unresolved security issues.
- The project's functionality has been fully superseded and the description already points to the replacement.

## Code of Conduct

By contributing, you agree to abide by the [Code of Conduct](code-of-conduct.md).

## AI Curator Engine

This list is partially maintained by an AI Curator Engine (`engine/`) that scans GitHub for new projects and proposes additions via pull requests. Human review is required for every AI-proposed change.

If you want to contribute to the engine itself, the code is MIT-licensed. See [LICENSE](LICENSE) for details.

## Questions?

Open an issue if you are unsure about anything. We are happy to help.
