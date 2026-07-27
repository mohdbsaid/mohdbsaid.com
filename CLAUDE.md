# Project Constitution — mohdbsaid.com

This document is the operating contract for anyone (human or AI) making changes to this repository. It overrides default behavior. When it conflicts with a specific one-off instruction from the project owner, the explicit instruction wins for that change — but architecture-level decisions still get recorded per the rule below.

Supporting detail lives in `/docs`: `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CONTENT_STRATEGY.md`, `ROADMAP.md`, `SEO.md`, `DECISIONS.md`. This file is the ruleset; `/docs` is the reference material behind it.

## Architecture rules

- Static Astro site. No SSR adapter, no server runtime, unless a decision to add one is recorded in `docs/DECISIONS.md` first.
- No UI framework (React/Vue/Svelte/etc.) unless a real interactivity need can't be met with plain Astro.
- **Tailwind CSS v4 is the sanctioned styling solution going forward** — see `docs/DECISIONS.md` ADR-022 for the standing architecture decision. New component styling should default to Tailwind utilities rather than new hand-written CSS. This does **not** retroactively obligate rewriting existing hand-written systems (`src/styles/global.css`'s token layer, the homepage's dark-glassmorphism system under ADR-014–020) — those remain valid, recorded exceptions until migrated on their own schedule, not as a side effect of unrelated work.
- Routing is file-based under `src/pages/` — every file there is a live URL. Don't create a page as a side effect of unrelated work.
- Content that has a title/date/body shape belongs in a Content Layer collection (`src/content/` + `src/content.config.ts`), not hardcoded into a page or a `src/data/*.ts` array. The four existing collections (`blog`/`projects`/`resources`/`courses`) share one base schema (`title`, `description`, `publishDate`, `draft`, `featured`, optional `cover`/`coverAlt`) — extend it, don't fork it, when adding a collection. New collections named in ADR-022's target architecture (`timeline`, `talks`, `notes`) are not yet defined — don't scaffold them ahead of real content (see ADR-001's precedent).
- Query collections through `src/lib/content.ts`'s `getFeatured()` (or extend it) rather than hand-rolling a second draft/featured/sort filter in a page.
- New long-form content (articles) should be authored as MDX going forward, per ADR-022 — existing `.md` entries aren't required to convert as a side effect of unrelated work.

## Folder conventions

```
src/
  assets/       Images/SVGs run through Astro's image pipeline
  components/   Reusable .astro components
  content/      Content Layer data sources (collections)
  data/         Static structured data (nav, site metadata) — not long-form content
  layouts/      Page shells
  lib/          Reusable logic with real behavior (data access, integrations)
  pages/        File-based routes
  styles/       Global CSS — tokens, resets, shared classes
  types/        Shared TypeScript types
  utils/        Small, pure, stateless helper functions
```

- `lib/` vs `utils/`: if it's a single pure function, it's `utils/`; if it composes several of those or owns behavior/state, it's `lib/`.
- Don't introduce a new top-level `src/` folder without updating this table and explaining why in `docs/DECISIONS.md`.

## Component rules

- One component, one responsibility. `Header`/`Footer`/`Layout` stay thin — page-specific markup belongs in the page, not bolted onto a shared component.
- Props get a typed `interface Props` (see `Layout.astro` for the pattern) — no untyped `Astro.props` access. When a component's props are just a shared type, `type Props = ThatType;` is fine (see `Card.astro`).
- A component only gets pulled into `Layout.astro` (i.e. rendered on every page) if it's genuinely global — `Header`, `Footer`, and `SEO` all qualify; verify a component is actually rendered somewhere before assuming it's live.
- Every page renders through `Layout.astro` (directly or via `PageLayout.astro`) — never construct `<html>`/`<head>` by hand in a page. This is also how `<SEO />` ends up on every page without each page needing to import it.
- Use `<Container>` for the page-width constraint instead of writing `class="container"` (or the width/margin-inline rule) by hand — pass extra layout classes via its `class` prop.
- Generic display components (`Card`, `SectionHeading`, `Button`) take flattened, presentation-shaped props — not a collection entry or other data-source-specific object. Whatever assembles the page computes `kind`/`meta`/etc. from the actual data source.
- Don't leave starter/template boilerplate (e.g. `Welcome.astro`) wired into pages once it's no longer needed — but don't delete it either without confirming with the project owner first, since removal is a judgment call, not a mechanical one.

## CSS rules

- All colors, spacing, and radii come from design tokens expressed as CSS custom properties — today that's `src/styles/global.css` (see `docs/DESIGN_SYSTEM.md`); under Tailwind v4 the same tokens belong in a `@theme` block, not scattered utility overrides. No hardcoded hex values or magic spacing numbers in component styles.
- Global/shared styles live in `global.css`, imported once (in `Layout.astro`). Component-specific styles live in that component's scoped `<style>` block (or Tailwind utility classes, once adopted).
- Use logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) over physical ones (`margin-left`, `left`) in any hand-written CSS — RTL must keep working through the same components/utilities in both directions, not a separate RTL stylesheet.
- Never let a CSS change alter the current rendered appearance unless that's the explicit goal of the change. A whitespace/formatting pass and a visual change are different kinds of commits — don't mix them.

## Accessibility rules

- Every interactive element needs a real accessible name (visible text, or `aria-label` when text isn't enough — see `nav[aria-label]` in `Header.astro`).
- Maintain a logical heading order (one `h1` per page) — don't skip levels for visual sizing; use CSS for that instead.
- Respect `prefers-color-scheme` and `prefers-reduced-motion` where animation/transition is added.
- Any new interactive component must be keyboard-operable without a mouse.

## Performance rules

- Ship zero client-side JS by default. A `<script>` tag or framework island requires a real interactivity need, not convenience. Plausible Analytics (ADR-022) is the one sanctioned exception once wired in — it needs a real Plausible site/domain provisioned first, so it isn't added speculatively.
- Route all content/thumbnail images through `astro:assets` — either `src/assets/` for site-chrome images, or a content collection's `cover` field for collection entries — so they get optimized via `<Image>`. `public/` is only for files that must be served byte-for-byte as-is (favicons, fonts, `robots.txt`). Don't add a `cover`/author photo to content just to exercise the pipeline — leave it unset until a real asset exists.
- Don't add a new npm dependency for something a small amount of plain code/CSS can do.
- Target Lighthouse Performance/Accessibility/Best Practices/SEO scores >95 (ADR-022) — treat a regression below that as a real bug, not a later cleanup.

## SEO rules

- Every page passes explicit `title`/`description` (and `image`/`imageAlt`/`jsonLd`/`noindex` where relevant) to `Layout.astro`/`PageLayout.astro` — never inherit the homepage defaults. Never render SEO meta tags anywhere except through `<SEO />` — add new tag types to that component, don't hand-write a second `<title>`/OG block/JSON-LD script in a page.
- Every real route is reachable from nav or otherwise included in the sitemap — no orphan pages. The sitemap is generated by `@astrojs/sitemap`; don't hand-maintain one. Use the sitemap's `filter` (in `astro.config.mjs`) to exclude non-page routes like `/rss.xml`, not a second config mechanism.
- Confirm `site` in `astro.config.mjs` is the correct production domain before anything gets deployed — it started life as a placeholder (see `docs/SEO.md`).

## Internationalization rules

- Target architecture (ADR-022): English and Arabic, sharing components rather than duplicated layouts, with `/en/`- and `/ar/`-prefixed routing as the long-term pattern for genuinely bilingual content. RTL is handled through the same components as LTR via logical CSS properties — never a separate RTL stylesheet or component fork.
- **Current reality, deliberately not touched by ADR-022:** the site's non-homepage routes (`/about`, `/blog`, `/projects`, `/resources`, `/courses`) are Arabic-only today, with `lang="ar" dir="rtl"` as `Layout.astro`'s actual default — that default is not to be flipped as a side effect of adopting this architecture doc, since doing so would mislabel real Arabic content as English and actively harm SEO/accessibility for pages that exist today. The homepage is the one bilingual pair, at `/` (English) + `/ar` (Arabic) — a deliberate exception to the `/en/`/`/ar/` pattern, recorded in ADR-019, because `/` is the live, indexed, canonical URL and moving it would violate "preserve all existing URLs." Reconcile `/` toward `/en/` only as an explicit, separately-confirmed step (e.g. `/` redirecting to `/en/`), never silently.
- New bilingual content going forward should target real `/en/`+`/ar/` routing per ADR-022 rather than repeating the homepage's props-based workaround.
- Arabic copy is always original writing for its context, never a literal translation of the English — see ADR-019/020 for examples of this in practice.

## Git workflow

- Work in small, reviewable commits scoped to one concern (structure, content, styling, config are different commits).
- Never commit changes to files unrelated to the task at hand — if you notice something else that needs fixing while working, note it (in `docs/DECISIONS.md` or a follow-up), don't fix it inline in an unrelated commit.
- Don't force-push, rebase interactively, or rewrite published history without the project owner's explicit go-ahead.
- Run `npm run check` and `npm run format:check` before considering a change done.

## Commit conventions

Use Conventional Commits: `type(scope): summary`, imperative mood, summary under ~70 chars.

- `feat` — new capability (a new page, a new collection going live)
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting-only changes, no logic/behavior change
- `refactor` — restructuring without changing behavior
- `chore` — tooling/config/dependency changes

Example: `chore(tooling): add prettier, editorconfig, astro check`

## Review checklist

Before calling any change done:

- [ ] Does it do only what was asked — no drive-by refactors, no unrelated files touched?
- [ ] `npm run check` passes (0 errors)?
- [ ] `npm run format:check` passes?
- [ ] `npm run build` still succeeds (or, if it was already broken, unaffected by this change)?
- [ ] If visual/behavioral: did you actually look at it (dev server), not just assume the diff is safe?
- [ ] If a token/convention was needed and didn't exist, was it added at the source (`global.css`, `content.config.ts`, etc.) rather than special-cased inline?
- [ ] If this is an architectural change (new integration, new top-level folder, rendering-mode change, new dependency category), is it explained in `docs/DECISIONS.md`?

## Never modify unrelated files

Touch only the files required for the task you were given. If you discover an unrelated problem while working (broken CSS, a stale dependency, a missing test), do not fix it as part of the current change — record it in `docs/DECISIONS.md` or flag it to the project owner, and let it be its own change.

## Explain architectural decisions before large changes

Before making any change that: adds a dependency category (framework, CMS, SSR adapter), changes the rendering mode, restructures top-level folders, or changes routing/content conventions — write the reasoning in `docs/DECISIONS.md` first (context, decision, why), then implement. Small, mechanical, or purely additive changes (a new page under an existing pattern, a new component following existing conventions) don't need this.

## Development

Start the dev server in background mode so it doesn't block the terminal:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.

## Documentation

Full Astro documentation: https://docs.astro.build

Consult before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
- [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)
