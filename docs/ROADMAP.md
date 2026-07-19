# Roadmap

Phased plan. Nothing beyond Phase 0 has been implemented — this is planning only.

## Phase 0 — Foundation

- [x] Documentation set (`/docs`)
- [x] Project constitution (`CLAUDE.md`)
- [x] Recommended `src/` folder structure (`content`, `data`, `lib`, `types`, `utils`)
- [x] Production config scaffolding: `site` URL placeholder, `@astrojs/sitemap`, `robots.txt`, content-collections scaffold
- [x] Tooling: Prettier, EditorConfig, `astro check`, npm scripts
- [x] README refresh
- [x] Fixed the invalid CSS in `src/styles/global.css` that broke `npm run build`

## Phase 1 — Make the build shippable

- [x] Fixed `global.css` dark-mode block
- [ ] Confirm production `site` URL in `astro.config.mjs` (currently a placeholder) and DNS/hosting target.
- [x] `Footer.astro` now rendered in `Layout.astro` on every page

## Phase 2 — Core static pages

- `/about`, `/contact`, `/privacy`, `/terms` as plain Astro pages (no content collection needed) — use `PageLayout.astro`.
- Real per-page Open Graph images once designed (see `SEO.md`).

## Phase 3 — Content collections (production hardening pass)

- [x] Defined and populated `blog`, `projects`, `resources`, `courses` collections per `CONTENT_STRATEGY.md`
- [x] RSS feed live (`src/pages/rss.xml.ts`), sourced from `blog`
- [ ] List/detail pages for each collection (`/blog/[slug]`, `/projects/[slug]`, `/resources/[slug]`, `/courses/[slug]`, plus their index/listing pages) — next up, using `PageLayout.astro`

## Phase 4 — SEO & performance polish

- [x] `<SEO />` component: canonical, OG, Twitter Card, JSON-LD, RSS discovery, `noindex` support
- [x] Image optimization wired (`<Card>`/`<Hero>` optional `image` prop via `astro:assets`) — not yet exercised by real assets
- [ ] `Article` JSON-LD once blog detail pages exist
- [ ] Real photography/thumbnails through the now-wired image pipeline
- [ ] Lighthouse/Core Web Vitals pass

## Phase 5 — Internationalization (tentative)

- English variant via Astro i18n routing, only if/when needed — not committed to yet.

## Explicitly out of scope for now

- Any CMS integration.
- Any UI framework (React/Vue/Svelte) — the site has no interactivity requirement today.
- Any redesign of current visuals.
