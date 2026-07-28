# src/content/

Data-backed content sources for Astro's Content Layer API.

## Listing collections: `blog/`, `projects/`, `resources/`, `courses/`, `services/`, `store/`

- Schemas live in `../content.config.ts`, sharing one base shape (`title`, `description`, `publishDate`, `updatedDate`, `draft`, `featured`, optional `cover`/`coverAlt`) so a single `<Card>` component and the `getFeatured()` helper in `src/lib/content.ts` work across all of them without special-casing.
- Each collection extends the base with the fields that make it distinct: `category`/`client`/`year`/`technologies`/`gallery`/`links` (projects), `format` (resources), `level` (courses), `icon` (services), `price`/`currency`/`sku`/`inStock` (store).
- Entry filenames become the URL slug (e.g. `blog/from-idea-to-part.md` → `id: "from-idea-to-part"`).
- `cover`/`coverAlt` are wired for `astro:assets` optimization but unused by most current entries — no real photography/thumbnails exist yet.
- `services/` and `store/` are schema-only today — zero entries, no page/nav consumes them yet (same precedent as ADR-001: don't scaffold a page ahead of real content). See docs/DECISIONS.md ADR-024.

## `pages/` — structured Home/About section copy

Bilingual, per-section content for pages that aren't a chronological list — currently Home and About. Layout: `pages/<page>/<section>/<locale>.mdx` (e.g. `pages/about/hero/en.mdx`). One `type`-discriminated schema in `content.config.ts` covers every section shape. Fetch with `getPageSection()` in `src/lib/content.ts`. See `content-admin/README.md` for how to edit this content without touching any `.astro` file, and `docs/DECISIONS.md` ADR-024 for why this is one collection instead of one per section.
