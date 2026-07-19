# src/content/

Data-backed content sources for Astro's Content Layer API — four collections, one subfolder each: `blog/`, `projects/`, `resources/`, `courses/`.

- Schemas live in `../content.config.ts`, sharing one base shape (`title`, `description`, `publishDate`, `draft`, `featured`, optional `cover`/`coverAlt`) so a single `<Card>` component and the `getFeatured()` helper in `src/lib/content.ts` work across all four without special-casing.
- Each collection extends the base with exactly one distinguishing field: `category` (projects), `format` (resources), `level` (courses); blog needs none extra.
- Entry filenames become the URL slug (e.g. `blog/from-idea-to-part.md` → `id: "from-idea-to-part"`).
- `cover`/`coverAlt` are wired for `astro:assets` optimization but unused by any current entry — no real photography/thumbnails exist yet.
