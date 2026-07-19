# Architectural Decisions

Log of non-obvious decisions made during the foundation pass, and known issues discovered along the way. New entries go at the bottom. See `CLAUDE.md` for when a decision must be recorded here before a change is made.

---

### ADR-001: Adopt Content Layer collections for future content, with zero collections defined yet

**Context:** Nav links to `/blog`, `/projects`, `/courses`, `/resources` exist but no content or pages do.
**Decision:** Add `src/content.config.ts` with `export const collections = {}` and a `src/content/` folder, both documented, but define no actual collections or schemas yet.
**Why:** Gives the content model a correct home (Astro 5+ Content Layer API, not the legacy `src/content/config.ts` location) without inventing schemas for content that doesn't exist, and without creating any pages.

### ADR-002: Defer `@astrojs/rss` installation until the blog collection has real content

**Context:** Task asked for "RSS preparation."
**Decision:** Document the RSS plan in `CONTENT_STRATEGY.md` rather than installing `@astrojs/rss` or creating `src/pages/rss.xml.js` now.
**Why:** An RSS feed needs a page (`src/pages/rss.xml.js`), which the task explicitly said not to create in this pass. Installing an unused dependency ahead of that would violate "don't add things beyond what's needed now."

### ADR-003: Add `@astrojs/sitemap` now (not deferred)

**Context:** Task explicitly asked for sitemap configuration.
**Decision:** Install `@astrojs/sitemap`, set `site` in `astro.config.mjs` to a placeholder domain, add the integration.
**Why:** Unlike RSS, the sitemap integration requires no new page — it hooks into the existing build and needs no content to be useful once real pages exist.

### ADR-004: Pre-existing broken CSS in `src/styles/global.css` — left unfixed in this pass

**Context:** While configuring Prettier, `prettier --check` crashed entirely on `src/styles/global.css` (`UnexpectedNodeError: Unexpected PostCSS node type`). Investigation confirmed the file has genuinely invalid CSS: a `:root` selector (line ~24) with no opening brace, five `@font-face` blocks stranded inside `@media (prefers-color-scheme: dark)`, and a dangling `{ --color-background: #000000; ... }` block disconnected from any selector. Running `npm run build` confirms this **breaks the production build outright** (`lightningcss` throws `Invalid dangling combinator in selector`); `npm run dev` still works because Vite's dev server doesn't run the same minifier.
**Decision:** Do not fix it in this pass. Exclude the file from Prettier (`.prettierignore`) so tooling setup doesn't crash, and document it here + in `ARCHITECTURE.md` / `ROADMAP.md` as the first task of Phase 1.
**Why:** The task explicitly scoped this pass to foundation/tooling/docs with "no visual or behavioral changes." Fixing broken CSS is a legitimate, separate bug-fix task — it should land as its own change with its own review, not buried inside a structural/tooling commit. **This is flagged as a launch blocker** — the site cannot currently be built for production.

### ADR-005: Reformat existing source files with Prettier as part of this pass

**Context:** Configuring Prettier surfaced that most existing files (tab-indented `.astro` files vs. space-indented `package.json`/`tsconfig.json`) didn't match a single consistent style.
**Decision:** Ran `prettier --write` across the repo (excluding `global.css`, `.vscode/`, `.claude/`, and generated/lock files) after previewing every diff — all changes were whitespace-only (2-space → tab, added trailing newlines), verified with `diff` before applying.
**Why:** A formatter with no formatted code to prove it works isn't "configured," and whitespace-only changes carry zero behavioral or visual risk. `.vscode/` and `.claude/` were excluded as editor/tool-specific settings, not project source.

### ADR-006: Pin `typescript` to `^5.9` instead of the latest `7.x`

**Context:** `npm install typescript` resolved to `7.0.2` by default, which falls outside `@astrojs/check@0.9.9`'s declared peer range (`^5.0.0 || ^6.0.0`).
**Decision:** Installed `typescript@^5.7` (resolved to `5.9.3`) instead.
**Why:** Avoids a peer-dependency mismatch that could cause `astro check` to misbehave; `astro check` passes cleanly (0 errors/warnings/hints) on this version.

### ADR-007: Content collections share one base schema instead of four independent ones

**Context:** Production hardening pass required real `blog`/`projects`/`resources`/`courses` collections (superseding ADR-001, which deliberately left collections undefined).
**Decision:** One `baseSchema` (`title`, `description`, `publishDate`, `draft`, `featured`, optional `cover`/`coverAlt`) in `src/content.config.ts`, extended per-collection with exactly one distinguishing field (`category`/`format`/`level`; blog needs none). A `.refine()` requires `coverAlt` whenever `cover` is set.
**Why:** This is what `CONTENT_STRATEGY.md` already committed to ("consistent frontmatter... so a shared card component works without special-casing") — it lets `src/lib/content.ts`'s `getFeatured()` and `<Card>` both work identically across all four collections instead of four bespoke implementations.

### ADR-008: `<Card>` takes flattened props, not a collection entry

**Context:** With real content collections, each collection's `CollectionEntry` type differs slightly (`category` vs `format` vs `level`). `kind` (e.g. "مشروع") was previously stored redundantly 3× per data file.
**Decision:** `<Card>` takes `{ kind, title, description, href, meta, image?, imageAlt? }` — plain values, not a collection entry or the old `PreviewItem` object (removed from `src/types/index.ts`). The page assembling a section passes `kind` once and computes `meta` from whichever field is relevant (formatted date for blog, `category`/`format`/`level` for the others).
**Why:** Decouples the generic, reusable `<Card>` from any one data shape entirely — it has no knowledge of collections at all. `kind`/`meta`-selection is a presentation decision, not content data.

### ADR-009: `<SEO />` is rendered from `Layout.astro`, not imported per-page

**Context:** Task required "every page must use `<SEO />`."
**Decision:** `<SEO />` is rendered once inside `Layout.astro`'s `<head>`, receiving `title`/`description`/`image`/`imageAlt`/`noindex`/`jsonLd` forwarded from `Layout`'s own props. No page imports `<SEO />` directly.
**Why:** A rule that depends on every future page author remembering to import a component is weaker than an architecture where it's structurally impossible to render a page without it. Since every page already must use `Layout` (or `PageLayout`, which itself wraps `Layout`), every page gets `<SEO />` for free and can't opt out by omission.

### ADR-010: Image optimization wired but not exercised by real content

**Context:** Task asked to "prepare the project for future author images and project thumbnails" while also requiring zero visual regressions.
**Decision:** `<Card>`/`<Hero>` accept optional `image: ImageMetadata`/`imageAlt` props rendering `astro:assets`'s `<Image>`; the content schema's `cover`/`coverAlt` fields feed this. No current content entry sets `cover`, and the homepage passes no author photo — so today's output is text-only, identical to before this pass.
**Why:** Building the capability without fabricating placeholder photography satisfies both constraints at once — real assets can be dropped in later with zero component changes, and nothing about the current design changes until they are.

### ADR-011: RSS implemented (supersedes ADR-002's deferral)

**Context:** ADR-002 deferred `@astrojs/rss` until the `blog` collection had real content, since a feed page didn't make sense against empty data.
**Decision:** The `blog` collection now has three real, non-draft entries, so `@astrojs/rss` was installed and `src/pages/rss.xml.ts` added, serving all non-draft posts newest-first. Discoverable via `<SEO />`'s `<link rel="alternate">`, excluded from the sitemap via `astro.config.mjs`'s sitemap `filter`.
**Why:** The condition ADR-002 was waiting on is now met; this is that plan executing, not a new decision to revisit.

### ADR-012: New `<Container>` component replaces duplicated width-constraint CSS

**Context:** `.container`/`.header-container`/`.footer-container` previously shared width/margin-inline rules via a grouped CSS selector — correct in CSS terms, but every consuming component still had to know and type the right class name by hand.
**Decision:** `src/components/Container.astro` renders `<div class:list={['container', class]}>`; `Section`, `Hero`, `Header`, `Footer` all use it (passing their own extra layout class, e.g. `class="hero-grid"`) instead of writing `<div class="container ...">` by hand.
**Why:** Moves the "how do I get the standard page-width constraint" answer from "remember the CSS class name" to "use the component" — the more misuse-resistant version of the same rule, and what the task asked for as a named reusable primitive.

### ADR-013: New `PageLayout.astro`, not yet consumed by any page

**Context:** Task asked for a reusable page layout distinct from the base `Layout.astro` shell.
**Decision:** `PageLayout.astro` wraps `Layout` with a standard title/eyebrow/description heading `<Section>`, for future content pages (`/about`, `/blog/[slug]`, listing pages, etc.). The homepage keeps using `Layout` directly since it has a bespoke `<Hero>`, not a generic heading.
**Why:** Zero risk to add now (nothing currently renders it, so zero visual impact) and saves the next page built from re-implementing the same heading pattern from scratch.
