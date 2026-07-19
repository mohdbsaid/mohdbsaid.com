// Shared TypeScript types and interfaces used across components, layouts, and pages.
// Keep content-collection data types out of here — Astro generates those
// automatically from src/content.config.ts (import from "astro:content"
// instead, e.g. `CollectionEntry<'blog'>`).
import type { ImageMetadata } from 'astro';

export interface NavItem {
	label: string;
	href: string;
}

// Flattened props for the generic <Card> — used for Projects/Articles/
// Resources/Courses homepage previews. Deliberately decoupled from any one
// collection's schema: the page assembling a section supplies `kind`/`meta`,
// since which label/secondary-text to show is a presentation choice, not
// content data (see docs/CONTENT_STRATEGY.md).
export interface CardProps {
	/** Small tag shown above the title, e.g. "مشروع", "مقالة". */
	kind: string;
	title: string;
	description: string;
	href: string;
	/** Small secondary text, e.g. a formatted date, format, or level. */
	meta: string;
	image?: ImageMetadata;
	imageAlt?: string;
}
