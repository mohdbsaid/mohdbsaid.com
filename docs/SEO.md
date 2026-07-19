# SEO

## What's in place

Everything below is centralized in `<SEO />` (`src/components/SEO.astro`), rendered once from `Layout.astro`'s `<head>` — every page gets it automatically by using `Layout`, with no per-page opt-in required.

- **Title / description** — per-page via `title`/`description` props, with sensible Arabic defaults.
- **Canonical URL** — `<link rel="canonical">`, computed from `Astro.site` + the current path.
- **OpenGraph** — `og:type`, `og:locale` (`ar_AR`), `og:site_name`, `og:title`, `og:description`, `og:url`, and `og:image`/`og:image:alt` when a page passes an `image`/`imageAlt` prop.
- **Twitter Card** — `summary_large_image` when an image is present, `summary` otherwise.
- **JSON-LD** — optional `jsonLd` prop (a single node or an array, auto-wrapped in `@graph`). The homepage passes `Person` + `WebSite` nodes.
- **`noindex`** — optional prop, renders `<meta name="robots" content="noindex, nofollow">` for any future page that needs to stay out of search results (e.g. a draft preview route).
- **RSS discovery** — `<link rel="alternate" type="application/rss+xml">` pointing at `/rss.xml`, present on every page.
- **theme-color** — light/dark variants matching the design tokens' background colors.
- `astro.config.mjs` sets `site` (placeholder: `https://mohdbsaid.com` — **confirm before launch**) and `@astrojs/sitemap`, filtered to exclude `/rss.xml`.
- `public/robots.txt` allows all crawlers and points to the generated sitemap.
- `lang="ar"` / `dir="rtl"` are correctly set at the document root.
- RSS feed (`src/pages/rss.xml.ts`) serves the `blog` collection, newest first, non-draft only.

## Not yet in place

- **Per-page OG images** — no page currently passes an `image` prop (no designed 1200×630 assets exist yet); `og:image`/`twitter:image` are correctly omitted rather than pointing at a mismatched fallback. Add real per-page images through `src/assets/` when they exist.
- **`Article` JSON-LD** for individual blog posts — only the homepage's `Person`/`WebSite` graph exists; add an `Article` node once `/blog/[slug]` pages are built.

## Rules going forward

1. Every page uses `Layout` (directly or via `PageLayout`) and passes explicit `title`/`description` — never rely on the homepage's defaults for another page.
2. Every real route must be reachable from nav or otherwise included in the sitemap — no orphan pages.
3. Don't hand-maintain the sitemap or the RSS `<link>` — both are generated; if a route needs excluding from the sitemap, extend the `filter` in `astro.config.mjs`.
4. Re-confirm the `site` value in `astro.config.mjs` is the real production domain before the first production deploy.
5. Any image used for OG/Twitter/content should go through `src/assets/` or a content collection's `cover` field (both get `astro:assets` optimization), never `public/`.
6. New JSON-LD types get added via the `jsonLd` prop on `Layout`/`PageLayout` — don't hand-write a second `<script type="application/ld+json">` outside `<SEO />`.
