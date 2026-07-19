# mohdbsaid.com

Personal site for Mohammed Al-Jabri — projects, writing, and work in 3D printing. Built with [Astro](https://astro.build), static output, Arabic-first (`lang="ar" dir="rtl"`).

## Requirements

- Node.js `>=22.12.0`

## Getting started

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Project structure

```
public/                 Static assets served as-is (favicon, fonts, robots.txt)
src/
  assets/                Images/SVGs processed by Astro's image pipeline
  components/            Reusable .astro components
  content/                Content Layer data sources (currently empty — see docs/CONTENT_STRATEGY.md)
  content.config.ts       Content collection definitions
  data/                   Static structured data (nav items, site metadata)
  layouts/                Page shells
  lib/                    Reusable logic modules
  pages/                  File-based routes
  styles/                 Global CSS — design tokens, resets, shared classes
  types/                  Shared TypeScript types
  utils/                  Small, pure helper functions
docs/                    Architecture, design system, content strategy, roadmap, SEO, and decision log
astro.config.mjs         Astro configuration (site URL, integrations)
CLAUDE.md                Project constitution — rules for working in this repo
```

For the full breakdown, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Commands

All commands run from the project root:

| Command                | Action                                              |
| ---------------------- | --------------------------------------------------- |
| `npm install`          | Install dependencies                                |
| `npm run dev`          | Start the local dev server at `localhost:4321`      |
| `npm run build`        | Build the production site to `./dist/`              |
| `npm run preview`      | Preview the production build locally                |
| `npm run check`        | Type-check and validate the project (`astro check`) |
| `npm run format`       | Format the codebase with Prettier                   |
| `npm run format:check` | Check formatting without writing changes            |
| `npm run astro ...`    | Run any Astro CLI command                           |

> **Known issue:** `npm run build` currently fails due to a pre-existing invalid-CSS bug in `src/styles/global.css` (breaks the CSS minifier). Tracked in [`docs/DECISIONS.md`](./docs/DECISIONS.md) (ADR-004) as the first fix needed before production deploy. `npm run dev` is unaffected.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — rendering model, folder structure, routing
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — tokens, typography, RTL conventions
- [`docs/CONTENT_STRATEGY.md`](./docs/CONTENT_STRATEGY.md) — content collections plan, RSS plan
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased plan
- [`docs/SEO.md`](./docs/SEO.md) — sitemap, robots, meta tag rules
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — architecture decision log
- [`CLAUDE.md`](./CLAUDE.md) — project constitution (rules for any contributor, human or AI)

## Learn more

[Astro documentation](https://docs.astro.build) · [Astro Discord](https://astro.build/chat)
