# Content Strategy

## Sections implied by current navigation

`Header.astro`/`Footer.astro` list the intended information architecture. Collections now back four of these; the rest are still plain pages waiting to be built (see `ROADMAP.md`).

| Route                 | Purpose                               | Content model                                 |
| --------------------- | ------------------------------------- | --------------------------------------------- |
| `/`, `/ar`            | Home — intentionally minimal          | Static page, shared `PersonalPortfolio.astro` |
| `/about`, `/ar/about` | Full professional profile             | Static page, shared `AboutPage.astro`         |
| `/projects`           | 3D-printing / other project write-ups | Content collection: `projects` (implemented)  |
| `/blog`               | Articles                              | Content collection: `blog` (implemented)      |
| `/resources`          | Curated links/downloads               | Content collection: `resources` (implemented) |
| `/courses`            | Courses taught/taken                  | Content collection: `courses` (implemented)   |
| `/contact`            | Contact form/details                  | Static page, no collection needed             |
| `/privacy`, `/terms`  | Legal                                 | Static pages, no collection needed            |

The four collections are defined and populated (`src/content.config.ts`, `src/content/{blog,projects,resources,courses}/`) and power the homepage's preview sections. The listing/detail pages themselves (`/blog/[slug]`, `/projects/[slug]`, etc.) are **not** built yet — that's `ROADMAP.md` Phase 3.

## Shared schema shape

All four collections extend one base schema so a single `<Card>` component and one query helper work across all of them without special-casing:

```ts
z.object({
	title: z.string(),
	description: z.string(),
	publishDate: z.coerce.date(),
	draft: z.boolean().default(false),
	featured: z.boolean().default(false),
	cover: image().optional(),
	coverAlt: z.string().optional(), // required by a .refine() once cover is set
});
```

Each collection adds exactly one distinguishing field: `category` (projects), `format` (resources), `level` (courses). Blog needs no extra field — its distinguishing display text is the formatted `publishDate` (see `src/utils/formatDate.ts`).

`kind` (the small label shown above a card's title, e.g. "مشروع") is **not** part of any schema — it's a presentation choice supplied by whichever page assembles a section, not content data. Keeps `<Card>` fully generic.

## Querying

`src/lib/content.ts`'s `getFeatured(collection, limit = 3)` is the one query every homepage section uses: non-draft, `featured: true`, sorted newest-first, capped at `limit`. Don't hand-roll a second version of this filter/sort in a page — extend the helper if a new query shape is needed.

## How to add an entry

1. Add a markdown file under `src/content/{collection}/{slug}.md` with frontmatter matching that collection's schema.
2. Set `featured: true` if it should be eligible for the homepage preview (only the top `limit` newest-by-`publishDate` featured entries show).
3. Leave `cover`/`coverAlt` unset until a real image exists — don't fabricate placeholder imagery in content.

## Language

Arabic is the sitewide default (`lang="ar" dir="rtl"`, set in `Layout.astro`). The homepage and About are the exceptions: `/`+`/ar` and `/about`+`/ar/about` each share one template (`PersonalPortfolio.astro`, `AboutPage.astro`) driven by props/`dir` — see `DECISIONS.md` ADR-019/023. `<LanguageSwitcher>` derives both pages' Arabic URL from the current path itself (prefixing `/ar`), so this pattern extends to any future bilingual page pair with zero switcher/data changes. This predates Astro's built-in [i18n routing](https://docs.astro.build/en/guides/internationalization/) being adopted; if/when the rest of the site gets an English pairing, reconcile onto one mechanism rather than running both (tracked in `ROADMAP.md` Phase 5).

The four content collections (`blog`/`projects`/`resources`/`courses`) are Arabic-only today — no bilingual content model exists for them yet. The planned Sanity migration (`ROADMAP.md` Phase 6, `DECISIONS.md` ADR-021) is expected to be what formalizes per-document English/Arabic content for collections, rather than building a bespoke bilingual scheme into the current markdown-based collections first.

## RSS

Implemented: `src/pages/rss.xml.ts` (using `@astrojs/rss`) serves all non-draft `blog` entries, newest first. Discoverable via the `<link rel="alternate" type="application/rss+xml">` tag that `<SEO />` renders on every page, and excluded from the sitemap (`astro.config.mjs`'s sitemap `filter`).

## Editorial workflow

1. Draft as markdown in `src/content/{collection}/`, `draft: true` in frontmatter.
2. Review against `docs/SEO.md` (title length, description).
3. Set `draft: false` (and `featured: true` if it should appear on the homepage) and merge.
