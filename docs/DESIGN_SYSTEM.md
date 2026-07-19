# Design System

This document describes the visual foundation as it exists **today**. Nothing here has been changed by the foundation work — it's a record of current state plus conventions for extending it consistently.

## Typography

- Primary typeface: **Thmanyah Sans**, self-hosted as `.woff2` in `public/fonts/` (Light 300 / Regular 400 / Medium 500 / Bold 700 / Black 900).
- Fallback stack: `system-ui, sans-serif`.
- `@font-face` declarations live in `src/styles/global.css`.

## Design tokens

Defined as CSS custom properties on `:root` in `src/styles/global.css`:

| Token                         | Value                | Purpose                   |
| ----------------------------- | -------------------- | ------------------------- |
| `--color-background`          | `#ffffff`            | Page background           |
| `--color-surface`             | `#f5f5f7`            | Raised/panel surfaces     |
| `--color-text`                | `#1d1d1f`            | Primary text              |
| `--color-muted`               | `#6e6e73`            | Secondary text, nav links |
| `--color-border`              | `#d2d2d7`            | Hairlines, dividers       |
| `--color-primary`             | `#0071e3`            | Accent/interactive color  |
| `--container-width`           | `1100px`             | Max content width         |
| `--space-1`…`--space-6`       | `0.5rem`–`4rem`      | Spacing scale             |
| `--radius-small/medium/large` | `10px`/`18px`/`28px` | Border-radius scale       |

**Rule:** never hardcode a color, spacing, or radius value in a component — reference the token. If a new value is genuinely needed, add a token to `global.css` first, don't inline it.

## Dark mode

A dark palette is intended via `@media (prefers-color-scheme: dark)` overriding the same custom properties. **This block is currently broken** (invalid CSS — see `ARCHITECTURE.md` "Known issues" and `DECISIONS.md` ADR-004) and does not apply. Do not copy its current structure when fixing it; redefine the same token names inside a valid `:root { ... }` block nested in the media query.

## Layout conventions

- Page content is constrained by `main { width: min(var(--container-width), calc(100% - 2rem)); margin-inline: auto; }` — reuse this pattern rather than introducing a second container convention.
- The header is `position: sticky` with a blurred translucent background (`backdrop-filter: blur(18px)`) — establishes a "frosted glass" motif; keep any future overlay/panel treatments consistent with it rather than inventing a new elevation style.

## RTL

The whole site is Arabic-first RTL (`dir="rtl"` set once in `Layout.astro`). Consequences for new CSS:

- Prefer logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) over physical ones (`margin-left`, `left`) so behavior stays correct if an LTR (English) variant is ever added — see `ROADMAP.md`.
- `global.css` already does this correctly in the container/header rules; keep following that pattern.

## Component styling rules

- Component-scoped styles (`<style>` inside a `.astro` file) are for that component only — `Welcome.astro` demonstrates the pattern (scoped, not currently used in a page).
- Shared/base styles (resets, header, tokens) belong in `src/styles/global.css`, imported once in `Layout.astro` — don't re-import it elsewhere.
- No CSS framework (Tailwind, etc.) is installed. Don't add one without a recorded decision in `DECISIONS.md`.

## Assets

- `src/assets/` holds source images optimized by Astro's asset pipeline (`astro.svg`, `background.svg` — currently only used by the unused `Welcome.astro` starter component).
- `public/fonts/` and `public/favicon.*` are served verbatim, unprocessed — anything that needs Astro's image optimization belongs in `src/assets/` instead.
