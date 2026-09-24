# mohdbsaid.com

Personal site for Mohammed Al-Jabri — additive manufacturing/3D printing work, projects, and writing. Built with [Astro](https://astro.build), static output. Home (`/`, `/ar`) and About (`/about`, `/ar/about`) are bilingual (English + Arabic); every other route (`/projects`, `/blog`, `/services`, `/store`) is Arabic-first (`lang="ar" dir="rtl"`).

## Requirements

- Node.js `>=22.12.0`

## Getting started

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Editing content

If you just need to change text, images, or add a project/article — not code — see [`content-admin/README.md`](./content-admin/README.md), a plain-language guide that assumes no programming background.

## Live routes

| Route                                  | Purpose                                              |
| -------------------------------------- | ---------------------------------------------------- |
| `/`, `/ar`                             | Home                                                 |
| `/about`, `/ar/about`                  | Full professional profile                            |
| `/projects`, `/projects/[slug]`        | Project write-ups (case studies)                     |
| `/blog`, `/blog/[slug]` + category/tag | Articles                                             |
| `/services`, `/services/[slug]`        | Service offerings                                    |
| `/store`, `/store/[slug]`              | Products — architecture only, no checkout            |
| `/rss.xml`, `/search-index.json`       | Non-HTML feeds — blog RSS, sitewide search-prep data |

`/contact` offers direct email and WhatsApp links. `/privacy` and `/terms` are not published or linked. `resources`/`courses` have content but no listing/detail pages yet — see `docs/ROADMAP.md`.

## Project structure

```
public/                 Static assets served as-is (favicon, fonts, robots.txt)
src/
  assets/                Images/SVGs processed by Astro's image pipeline
  components/            Reusable .astro components
  content/                Content Layer data sources: blog/, projects/, resources/,
                          courses/, services/, store/, pages/ (Home+About copy)
  content.config.ts       Content collection schemas
  data/                   Static structured data (nav items, site.ts's global config)
  layouts/                Page shells (Layout.astro, PageLayout.astro)
  lib/                    Reusable logic modules (content queries)
  pages/                  File-based routes
  styles/                 Global CSS — global.css (light token system, most pages) +
                          glass-theme.css (dark glassmorphism, Home/About only)
  types/                  Shared TypeScript types
  utils/                  Small, pure helper functions
docs/                    Architecture, design system, content strategy, roadmap, SEO,
                         and the full decision log (docs/DECISIONS.md)
content-admin/           Non-technical content-editing guide
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

There's no linter configured (no ESLint) — `npm run check` (type/schema validation) and `npm run format:check` (style) are the full validation suite today.

## Deployment

Intended host: Cloudflare Pages, connected directly to this GitHub repository (push to `main` → auto-build → auto-publish). **As of this writing the production domain does not resolve** — confirm in Cloudflare's dashboard and your domain registrar that hosting is actually connected before assuming a push goes live. See `content-admin/README.md`'s "How to deploy" section.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — rendering model, folder structure, routing
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — tokens, typography, RTL conventions
- [`docs/CONTENT_STRATEGY.md`](./docs/CONTENT_STRATEGY.md) — content collections, querying, editorial workflow
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased plan
- [`docs/SEO.md`](./docs/SEO.md) — sitemap, robots, meta tag rules
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — full architecture decision log (every non-obvious call made in this repo, and why)
- [`content-admin/README.md`](./content-admin/README.md) — non-technical content-editing guide
- [`CLAUDE.md`](./CLAUDE.md) — project constitution (rules for any contributor, human or AI)

## Learn more

[Astro documentation](https://docs.astro.build) · [Astro Discord](https://astro.build/chat)
