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

## Phase 5 — Internationalization (partial)

- [x] Homepage has a real English/Arabic pair (`/` + `/ar`), sharing one template (`PersonalPortfolio.astro`) driven by props/`dir` — see `DECISIONS.md` ADR-019.
- **Deviation from the original plan below:** this used a manual thin-wrapper-page pair, not Astro's built-in i18n routing (`astro:i18n`) — see ADR-019 for why. If i18n routing is adopted later for the rest of the site, reconcile the homepage onto the same mechanism rather than running two approaches side by side.
- [ ] Extend English/Arabic pairing to `/about`, `/blog`, `/projects`, `/resources`, `/courses` — not started; those remain Arabic-only.
- [ ] Formalize `/en/`/`/ar/`-prefixed routing per ADR-022, for new bilingual content — the homepage's `/`/`/ar` pair stays a recorded exception (ADR-019) unless explicitly reconciled as its own step, since `/` is the live canonical URL.

## Phase 6 — Styling migration to Tailwind CSS v4 — planned, not started

Per `DECISIONS.md` ADR-022. Incremental, not a rewrite:

- [ ] New components/pages default to Tailwind utilities instead of new hand-written CSS.
- [ ] Design tokens (`docs/DESIGN_SYSTEM.md`) move to Tailwind v4's `@theme` (still CSS custom properties, just Tailwind's configuration surface instead of a hand-rolled `:root` block).
- [ ] Existing hand-written CSS (`global.css`'s current rules, the homepage's dark-glassmorphism system under ADR-014–020) migrates opportunistically, page/component at a time — not a single sweeping rewrite, and never mixed into an unrelated commit.

## Phase 7 — Content authoring: MDX + new collections — planned, not started

Per `DECISIONS.md` ADR-022.

- [ ] Add `@astrojs/mdx`; new articles authored as `.mdx`.
- [ ] Existing `.md` entries are not required to convert as a side effect of unrelated work.
- [ ] `timeline`, `talks`, `notes` collections defined only once real content exists for each — per ADR-001's precedent against scaffolding unused collections.

## Phase 8 — Analytics (Plausible) — blocked

Per `DECISIONS.md` ADR-022. Blocked on the project owner provisioning a real Plausible site/domain — the tracking script can't be wired in against a domain that doesn't exist yet.

## Phase 9 — Headless CMS (Sanity) — planned, not started

v2 of the content architecture. Astro + Cloudflare Pages stay; Sanity is introduced as the content source, **additively** — see `DECISIONS.md` ADR-021 for the full decision record before any of this is implemented.

- [ ] Add Sanity as a Content Layer **loader** for one collection first (most likely `blog`), keeping `content.config.ts`'s existing base schema as the target shape — not a new, separate data path.
- [ ] Preserve every existing URL — no slug/route changes as a side effect of the migration.
- [ ] Preserve the `<SEO />` contract (canonical/OG/Twitter/JSON-LD) unchanged; only the content source changes.
- [ ] Migrate collections one at a time (`blog` → `projects` → `resources` → `courses`), each shippable on its own, not a big-bang cutover.
- [ ] Structured content (Sanity Portable Text or equivalent) renders through the existing `Layout`/`PageLayout`/`Card` components — no rewrite of the presentation layer.
- [ ] Draft/published workflow maps onto the existing `draft: boolean` semantics already in the base schema.
- [ ] Image management goes through Sanity's asset pipeline into `astro:assets`, the same way `cover`/`coverAlt` work today.
- [ ] English/Arabic per document, formalizing what Phase 5 started ad hoc for the homepage.
- [ ] Requires the project owner to provision a real Sanity project (project ID, dataset, API token) before any code lands — not something to stub out speculatively.

## Explicitly out of scope for now

- Any CMS integration **beyond what's planned in Phase 9** — no Sanity code lands until that ADR's prerequisites (a real Sanity project) exist.
- Any UI framework (React/Vue/Svelte) — the site has no interactivity requirement today.
- Any redesign of current visuals — Phase 6's Tailwind migration is a re-implementation, not a restyle; visual output should stay the same unless a redesign is separately requested.
- Flipping any existing Arabic-only route's declared language away from `ar`/`rtl` — see `CLAUDE.md`'s Internationalization rules.
