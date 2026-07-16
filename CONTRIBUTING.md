# Contributing

Thanks for helping keep this list sharp. Two ways to contribute:

## Suggest a tool

Open a pull request that adds an entry to [`projects.yaml`](projects.yaml) under the right category:

```yaml
  - name: ToolName
    repo: owner/repo
    description: One or two sentences with concrete facts — what it does and why it matters.
    tagline: 5-10 word punchy one-liner, no trailing period
    tags: [kebab-case, topic, tags]
```

Guidelines:

- **Pick the category carefully.** Every category's scope is defined in
  [`src/categories.yaml`](src/categories.yaml) (`scope_in` / `scope_out`) — match the scope rules,
  not just the name. The README table of contents is generated from that file.
- **Relevance:** the tool must automate some part of the AI/ML lifecycle — AutoML, NAS, HPO,
  fine-tuning, prompt optimization, agents, evaluation, serving, and so on.
- **Signal:** active maintenance (or clearly-flagged historical importance), a real README,
  and a license. Commercial platforms are welcome with `commercial: true`.
- **No self-promotion spam:** it's fine to submit your own project if it genuinely fits.

Before opening the PR, validate your change:

```sh
pnpm install
pnpm validate
```

Don't edit `README.md` directly — it is regenerated weekly from `projects.yaml`
plus live GitHub data, and manual edits will be overwritten.

## Report a problem

Wrong category, dead link, stale description, or a project that no longer belongs?
Open an issue with the entry name and what's off.

## License

By contributing you agree that list content is dedicated to the public domain under
[CC0 1.0](LICENSE) and source-code contributions are licensed under MIT.
