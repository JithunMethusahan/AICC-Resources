# IOAI 2026 Resource Map

The editable resource catalogue now lives in **`IOAI-RESOURCES.md`**.

## How it works

- `IOAI-RESOURCES.md` is the human-edited source of truth.
- `scripts/build-resource-map.mjs` converts that Markdown into `public/ioai2026-resource-map.json` during production builds.
- The website reads the generated JSON; do not manually edit the generated file.
- Each topic should have 2–3 focused resources, a clear reason to use each one, and a realistic time estimate.
- Resources stay marked **Needs verification** until a maintainer checks the link and confirms it directly covers the topic.

## Quality standard

Prioritize topic fit, clear explanations, hands-on practice, reasonable length, accessible material, and stable URLs. A popular resource is not automatically a good resource for every topic. Replace broad, outdated, overly long, or weak links.

## Contribution flow

1. Open `IOAI-RESOURCES.md`.
2. Find the topic heading.
3. Add or replace a resource using the existing format.
4. Explain why it fits and estimate the time for the relevant section.
5. Open a pull request so a maintainer can review the link and topic match.
