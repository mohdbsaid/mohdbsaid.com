# Content Strategy

## Sections implied by current navigation

`Header.astro`/`Footer.astro` list the intended information architecture. Collections now back four of these; the rest are still plain pages waiting to be built (see `ROADMAP.md`).

| Route                 | Purpose                               | Content model                                                               |
| --------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `/`, `/ar`            | Home — intentionally minimal          | Static page, shared `PersonalPortfolio.astro`, copy from `pages` collection |
| `/about`, `/ar/about` | Full professional profile             | Static page, shared `AboutPage.astro`, copy from `pages` collection         |
| `/projects`           | 3D-printing / other project write-ups | Content collection: `projects` (implemented)                                |
| `/blog`               | Articles                              | Content collection: `blog` (implemented)                                    |
| `/resources`          | Curated links/downloads               | Content collection: `resources` (implemented)                               |
| `/courses`            | Courses taught/taken                  | Content collection: `courses` (implemented)                                 |
| `/contact`            | Contact form/details                  | Static page, no collection needed                                           |
| `/privacy`, `/terms`  | Legal                                 | Static pages, no collection needed                                          |
| `/services`           | Professional service offerings        | Content collection: `services` (page live, zero real entries — ADR-025)     |
| `/store`              | Products (no checkout)                | Content collection: `store` (page live, zero real entries — ADR-025)        |

The four listing collections above `/contact` are defined and populated (`src/content.config.ts`, `src/content/{blog,projects,resources,courses}/`) and power the homepage's preview sections. The listing/detail pages themselves (`/blog/[slug]`, `/projects/[slug]`, `/services/[slug]`, `/store/[slug]`, etc.) are implemented for `blog`/`projects`/`services`/`store`; `resources`/`courses` still need theirs — that's `ROADMAP.md` Phase 3. `services`/`store` render an honest empty state until a real entry is added — see ADR-025.

Since ADR-024, Home and About no longer hold their section copy as hardcoded props inside `src/pages/*.astro` — it's fetched from the `pages` content collection (`src/content/pages/<page>/<section>/<locale>.mdx`) via `src/lib/content.ts`'s `getPageSection()`. See `content-admin/README.md` for how to edit this without touching any `.astro` file.

## Shared schema shape

`blog`/`projects`/`resources`/`courses`/`services`/`store` all extend one base schema so a single `<Card>` component and one query helper work across all of them without special-casing:

```ts
z.object({
	title: z.string(),
	description: z.string(),
	publishDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	draft: z.boolean().default(false),
	featured: z.boolean().default(false),
	cover: image().optional(),
	coverAlt: z.string().optional(), // required by a .refine() once cover is set
});
```

Each collection adds the fields that make it distinct: `category`/`client`/`year`/`technologies`/`gallery`/`links` (projects), `format` (resources), `level` (courses), `category`/`icon`/`whoItsFor`/`process`/`deliverables`/`technologies`/`faq` (services), `category`/`gallery`/`specifications`/`status`/`price`/`currency`/`sku` (store). Blog needs no extra field beyond `category`/`tags` — its distinguishing display text is the formatted `publishDate` (see `src/utils/formatDate.ts`). `gallery` (projects/store) is `{ image, alt }[]`, not a bare image array — every gallery photo needs its own real alt text (see `docs/DECISIONS.md` ADR-025).

The `pages` collection (Home/About section copy) does **not** share this base schema — it's a different content shape entirely (structured page sections, not dated posts), so it gets its own `type`-discriminated schema in `content.config.ts`. See `DECISIONS.md` ADR-024.

`kind` (the small label shown above a card's title, e.g. "مشروع") is **not** part of any schema — it's a presentation choice supplied by whichever page assembles a section, not content data. Keeps `<Card>` fully generic.

## Querying

`src/lib/content.ts`'s `getFeatured(collection, limit = 3)` is the one query every homepage section uses: non-draft, `featured: true`, sorted newest-first, capped at `limit`. `getRelatedProjects(current, limit = 3)` (category match) and `getRelatedPosts(current, limit = 3)` (tag + category match) power each detail page's "related" section the same way. Don't hand-roll a second version of any of these in a page — extend the helper if a new query shape is needed.

## How to add an entry

1. Add a markdown file under `src/content/{collection}/{slug}.md` with frontmatter matching that collection's schema.
2. Set `featured: true` if it should be eligible for the homepage preview (only the top `limit` newest-by-`publishDate` featured entries show).
3. Leave `cover`/`coverAlt` unset until a real image exists — don't fabricate placeholder imagery in content.

## Language

Arabic is the sitewide default (`lang="ar" dir="rtl"`, set in `Layout.astro`). The homepage and About are the exceptions: `/`+`/ar` and `/about`+`/ar/about` each share one template (`PersonalPortfolio.astro`, `AboutPage.astro`) driven by props/`dir` — see `DECISIONS.md` ADR-019/023. `<LanguageSwitcher>` derives both pages' Arabic URL from the current path itself (prefixing `/ar`), so this pattern extends to any future bilingual page pair with zero switcher/data changes. This predates Astro's built-in [i18n routing](https://docs.astro.build/en/guides/internationalization/) being adopted; if/when the rest of the site gets an English pairing, reconcile onto one mechanism rather than running both (tracked in `ROADMAP.md` Phase 5).

The `blog`/`projects`/`resources`/`courses`/`services`/`store` collections are Arabic-only today — no bilingual content model exists for them yet. The planned Sanity migration (`ROADMAP.md` Phase 6, `DECISIONS.md` ADR-021) is expected to be what formalizes per-document English/Arabic content for those collections, rather than building a bespoke bilingual scheme into the current markdown-based collections first.

The `pages` collection is the one exception — it's bilingual by construction (a separate `en.mdx`/`ar.mdx` file per section, see ADR-024), since Home/About are the two pages that actually need matched English/Arabic copy today.

## RSS

Implemented: `src/pages/rss.xml.ts` (using `@astrojs/rss`) serves all non-draft `blog` entries, newest first. Discoverable via the `<link rel="alternate" type="application/rss+xml">` tag that `<SEO />` renders on every page, and excluded from the sitemap (`astro.config.mjs`'s sitemap `filter`).

## Editorial workflow

1. Draft as markdown in `src/content/{collection}/`, `draft: true` in frontmatter.
2. Review against `docs/SEO.md` (title length, description).
3. Set `draft: false` (and `featured: true` if it should appear on the homepage) and merge.
