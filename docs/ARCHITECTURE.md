# Architecture

## Summary

A static, content-driven personal site for Mohammed Al-Jabri, built with [Astro](https://astro.build) (`^7.1.1`). Output is fully static (`output: "static"`, the Astro default) — no server runtime, no client-side framework. Primary language is Arabic (`lang="ar" dir="rtl"`), set once in the root layout.

## Rendering model

- **Static output.** Every route is prerendered at build time to `dist/`. There is no SSR adapter configured, and none should be added without an explicit decision recorded in `DECISIONS.md` — this site does not need one.
- **Islands, not app.** Astro components (`.astro`) render to HTML with zero client-side JS by default. If interactivity is ever needed, prefer a scoped `<script>` in the component first; reach for a UI framework island only when local state/reactivity genuinely requires it, and record that decision.

## Folder structure

```
public/                 Static files served as-is (favicon, fonts, robots.txt)
src/
  assets/                Images/SVGs processed by Astro's asset pipeline (images/{profile,projects,blog,services,clients,gallery,logos}/)
  components/            Reusable .astro components (Header, Footer, SEO, Container, Section, Card, ...)
  content/                Content Layer entries — blog/, projects/, resources/, courses/, services/, store/, pages/ (Home+About section copy)
  content.config.ts       Content collection schemas (shared base + per-collection extension; pages/ uses a type-discriminated union — see ADR-024)
  data/                   Static structured data (nav items, site.ts's global identity/contact config — not long-form content)
  layouts/                Page shells: Layout.astro (base) + PageLayout.astro (standard content-page heading)
  lib/                    Reusable logic modules (content.ts's getFeatured/getPageSection query helpers; glassInteractions.ts's shared client-side behavior for the dark-glassmorphism pages)
  pages/                  File-based routes — every file here is a URL (+ rss.xml.ts feed route)
  styles/                 Global CSS (design tokens, resets, shared classes) + glass-theme.css (the homepage/About design system — see ADR-023)
  types/                  Shared TypeScript types
  utils/                  Small pure helper functions (formatDate.ts)
docs/                    This documentation set
content-admin/           Non-technical guide to editing site content — see README.md (ADR-024)
astro.config.mjs         Astro + integrations configuration
```

See `DESIGN_SYSTEM.md` for the CSS/token layer and `CONTENT_STRATEGY.md` for how `content/` and `content.config.ts` are used.

## Routing

Pure file-based routing under `src/pages/`. Live today: `/`, `/ar` (Home), `/about`, `/ar/about`, `/projects` (+ `[slug]`), `/blog` (+ `[slug]`, `/category/[category]`, `/tags/[tag]`), `/services` (+ `[slug]`), `/store` (+ `[slug]`), `/rss.xml`, `/search-index.json`. `primaryNav`/`legalNav` (`src/data/nav.ts`) still list `/contact`, `/privacy`, `/terms`, and content exists for `resources`/`courses` — none of those four have a page yet; see `ROADMAP.md`/`CONTENT_STRATEGY.md`. `PageLayout.astro` is the shell every one of the live content pages above (except Home/About, which use the glass system) actually renders through.

## Layout composition

- `Layout.astro` — the base HTML shell: `<html lang dir>`, global CSS, `<SEO />` in `<head>`, renders `<Header />` + `<Footer />` around a `<slot />`. Every page uses this, which means every page automatically gets `<SEO />` — there's no way to render a page without it.
- `PageLayout.astro` — wraps `Layout` with a standard title/eyebrow/description heading `<Section>`. Consumed by every non-Home/About content page (`/projects`, `/blog`, `/services`, `/store` and their detail routes) — each gets exactly one `<h1>` for free. Not used by Home/About, which have their own bespoke `<Hero>` via the glass system instead.
- `<Container>` — the one real component providing the page-width constraint (`.container` class), used by `Section`, `Hero`, `Header`, `Footer` instead of each hand-duplicating the width rule.
- `<CardGrid>` — the shared 3-col→1-col `<Card>` grid used by every listing page (`/projects`, `/blog` + its category/tag pages, `/services`, `/store`, and a project's "Related Projects") — extracted under ADR-025 to remove four copies of the same grid markup/CSS.

## Content Collections

Six "listing" collections (`blog`, `projects`, `resources`, `courses`, `services`, `store`), each backed by markdown/MDX files under `src/content/{name}/` and defined in `content.config.ts` with one shared base Zod schema extended per-collection — see `CONTENT_STRATEGY.md`. `src/lib/content.ts`'s `getFeatured(collection, limit)` is the single query (non-draft, featured, newest-first, capped) every homepage section calls; `getRelatedProjects()`/`getRelatedPosts()` do the same for each detail page's "related" section. `services`/`store` have real, live pages (`/services`, `/store` + `[slug]`, nav-linked) but zero real entries — see ADR-025's "don't fabricate offerings" reasoning.

A seventh collection, `pages`, holds structured bilingual copy for Home/About (the sections that used to be hardcoded prop objects inside `src/pages/*.astro`) — one `type`-discriminated schema, one entry per `<page>/<section>/<locale>.mdx`. Fetched via `src/lib/content.ts`'s `getPageSection()`. See `DECISIONS.md` ADR-024 and `content-admin/README.md`.

## Search preparation

`src/pages/search-index.json.ts` is a single static JSON endpoint covering every listing collection at once (`blog`/`projects`/`services`/`store`, each entry tagged with a `type`), rather than one index per collection — see ADR-025. No search library is installed; this is the data a future client-side search (Pagefind, Fuse.js, etc.) would consume without needing to touch page code.

## Image optimization

`Card` and `Hero` both accept an optional `image`/`imageAlt` prop rendering `astro:assets`'s `<Image>`. The content schema's `cover`/`coverAlt` fields are wired to feed this, but no current entry sets them (no real photography/thumbnails exist yet) — the pipeline is prepared, not yet exercised by real assets. `projects`/`store`'s optional `gallery` field is an array of `{ image, alt }` objects (not bare images) — alt text is required per image directly in the schema shape, not bolted on separately, since gallery photos have no single shared caption the way a page-level `coverAlt` does.

## SEO

`<SEO />` (`src/components/SEO.astro`) is the single place every `<head>` SEO tag lives: title, description, canonical, OG, Twitter Card, theme-color, RSS `<link>`, and optional JSON-LD/`noindex`. See `SEO.md`.

## Integrations

- `@astrojs/sitemap` — generates `sitemap-index.xml` at build time from `site` in `astro.config.mjs`, filtered to exclude `/rss.xml`. See `SEO.md`.
- `@astrojs/rss` — powers `src/pages/rss.xml.ts`, sourced from the `blog` collection.

## Known issues (pre-existing, not introduced by this work)

- `/contact`, `/privacy`, `/terms` are linked from nav but have no page yet; `resources`/`courses` have content collections but no listing/detail pages yet either (see Routing above) — tracked in `ROADMAP.md`.

## Explaining architectural decisions

Any change that alters rendering mode, adds a framework integration, introduces a new top-level folder, or changes how routing/content works must be explained in `DECISIONS.md` **before** the change lands — see `CLAUDE.md`.

## Target architecture (ADR-022)

The project owner has set a standing long-term direction, recorded in full in `DECISIONS.md` ADR-022. Current state (this section, above) vs. target:

| Area      | Current                                                                                                                                                                                      | Target                                                                                                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Styling   | Hand-written CSS: `global.css` tokens + per-component scoped `<style>`                                                                                                                       | Tailwind CSS v4, tokens via `@theme` (CSS variables) — existing hand-written systems (incl. the homepage's dark-glassmorphism system) are recorded exceptions, migrated incrementally, not rewritten wholesale                           |
| Content   | Markdown + MDX, `blog`/`projects`/`resources`/`courses`/`services`/`store` (`/services`/`/store` pages live, zero real entries) + `pages` (Home/About structured copy) — see ADR-024/025     | `timeline`/`talks`/`notes` remain undefined ahead of real content, per ADR-001's precedent — added only once real content exists                                                                                                         |
| Analytics | None                                                                                                                                                                                         | Plausible Analytics — blocked on a real Plausible site/domain being provisioned                                                                                                                                                          |
| i18n      | Arabic-only sitewide default; homepage (`/`+`/ar`) and About (`/about`+`/ar/about`) each share one template, `<LanguageSwitcher>` deriving the `/ar` URL from the current path (ADR-019/023) | `/en/`/`/ar/`-prefixed routing, shared components, for genuinely bilingual content — existing Arabic-only routes and the homepage/About pairs are not retroactively touched by this alone (see `CLAUDE.md`'s Internationalization rules) |
| CMS       | None — content lives in Git                                                                                                                                                                  | Sanity, additive via a Content Layer loader (ADR-021) — blocked on a real Sanity project being provisioned                                                                                                                               |

Nothing in this table is implemented yet beyond what's already noted as current. See `ROADMAP.md` for phasing.
