// Astro Content Layer configuration.
// https://docs.astro.build/en/guides/content-collections/
//
// All four "listing" collections (blog/projects/resources/courses) share one
// base schema so a single generic <Card> component and a single query helper
// (src/lib/content.ts) can work across all of them without special-casing —
// see docs/CONTENT_STRATEGY.md. Each collection extends the base with exactly
// one field that captures what makes that collection's cards distinct.
//
// `pages`/`services`/`store` were added under the content-first architecture
// refactor (docs/DECISIONS.md ADR-024) — see that ADR for why `pages` is one
// discriminated-union collection rather than one collection per section.
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const baseSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		featured: z.boolean().default(false),
		// Optional cover/thumbnail — no content currently sets these (no real
		// photography/thumbnails exist yet), but the schema + <Card>/<Hero>
		// image rendering are fully wired for when they do.
		cover: image().optional(),
		coverAlt: z.string().optional(),
	});

type WithCover = z.ZodObject<{
	cover: z.ZodOptional<z.ZodType>;
	coverAlt: z.ZodOptional<z.ZodString>;
}>;

/** coverAlt is mandatory the moment a cover image is actually supplied. */
function requireAltWithCover<T extends WithCover>(schema: T) {
	return schema.refine((data) => !data.cover || !!data.coverAlt, {
		message: 'coverAlt is required whenever cover is set',
		path: ['coverAlt'],
	});
}

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: (ctx) =>
		requireAltWithCover(
			baseSchema(ctx).extend({
				category: z.string(),
				tags: z.array(z.string()).default([]),
			}),
		),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: (ctx) =>
		requireAltWithCover(
			baseSchema(ctx).extend({
				category: z.string(),
				// Everything below is optional — only set it on an entry when the
				// fact is actually known (see docs/CONTENT_STRATEGY.md); never
				// fabricated to fill the field.
				status: z.string().optional(),
				client: z.string().optional(),
				year: z.coerce.number().optional(),
				technologies: z.array(z.string()).optional(),
				gallery: z.array(ctx.image()).optional(),
				links: z
					.object({
						github: z.url().optional(),
						demo: z.url().optional(),
					})
					.optional(),
			}),
		),
});

const resources = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
	schema: (ctx) => requireAltWithCover(baseSchema(ctx).extend({ format: z.string() })),
});

const courses = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
	schema: (ctx) => requireAltWithCover(baseSchema(ctx).extend({ level: z.string() })),
});

// Not yet consumed by any page/nav entry — schema defined ahead of content,
// same precedent as ADR-001 (blog/projects/courses/resources started this
// way too). Add a real /services page + nav entry only once real service
// entries exist, per CLAUDE.md's "don't create a page as a side effect" rule.
const services = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
	schema: (ctx) =>
		requireAltWithCover(
			baseSchema(ctx).extend({
				icon: z.string().optional(),
			}),
		),
});

// Same status as `services` above: schema only, zero entries, no page yet.
const store = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/store' }),
	schema: (ctx) =>
		requireAltWithCover(
			baseSchema(ctx).extend({
				price: z.number().optional(),
				currency: z.string().optional(),
				sku: z.string().optional(),
				inStock: z.boolean().default(true),
			}),
		),
});

// Structured, per-section, bilingual copy for Home/About — the pieces of
// those pages that used to be hardcoded prop objects inside
// src/pages/*.astro. One collection with a `type`-discriminated schema
// (rather than one collection per section) keeps content.config.ts small
// while every section stays fully typed — see docs/DECISIONS.md ADR-024.
//
// File layout: src/content/pages/<page>/<section>/<locale>.mdx
// e.g. src/content/pages/about/hero/en.mdx, .../hero/ar.mdx
// id (used by getPageSection()) is that path minus the extension, e.g.
// "about/hero/en".
const pageSectionSchema = z.discriminatedUnion('type', [
	// Hero — name/initials/role come from src/data/site.ts, not repeated here.
	z.object({
		type: z.literal('hero'),
		tagline: z.string(),
		emailLabel: z.string(),
		whatsappLabel: z.string(),
	}),
	// A heading + free-form MDX body (rendered prose) — About's Profile,
	// Training, and Philosophy sections all use this shape.
	z.object({
		type: z.literal('prose'),
		eyebrow: z.string(),
		heading: z.string(),
	}),
	// Home's "Selected Work" section heading — the projects themselves come
	// from src/data/selectedWork.ts, not this collection. Lowercase (not
	// "workIntro") because Astro's Content Layer slugifies folder names to
	// lowercase for entry ids — the folder name, this type value, and every
	// getPageSection() call must all agree.
	z.object({
		type: z.literal('workintro'),
		eyebrow: z.string(),
		heading: z.string(),
	}),
	z.object({
		type: z.literal('achievements'),
		eyebrow: z.string(),
		heading: z.string(),
		stats: z.array(
			z.object({
				value: z.number(),
				suffix: z.string(),
				label: z.string(),
			}),
		),
	}),
	z.object({
		type: z.literal('experience'),
		eyebrow: z.string(),
		heading: z.string(),
		roles: z.array(
			z.object({
				title: z.string(),
				company: z.string(),
				period: z.string(),
				description: z.string(),
			}),
		),
	}),
	z.object({
		type: z.literal('industries'),
		eyebrow: z.string(),
		heading: z.string(),
		groups: z.array(
			z.object({
				title: z.string(),
				items: z.array(z.string()),
			}),
		),
	}),
	z.object({
		type: z.literal('skills'),
		eyebrow: z.string(),
		heading: z.string(),
		categories: z.array(
			z.object({
				icon: z.string(),
				title: z.string(),
				skills: z.string(),
			}),
		),
		note: z.string(),
	}),
	z.object({
		type: z.literal('certifications'),
		eyebrow: z.string(),
		heading: z.string(),
		degree: z.string(),
		institution: z.string(),
		period: z.string(),
		coursework: z.string(),
		certificationsLabel: z.string(),
		certifications: z.array(z.string()),
	}),
	z.object({
		type: z.literal('timeline'),
		eyebrow: z.string(),
		heading: z.string(),
		items: z.array(
			z.object({
				period: z.string(),
				title: z.string(),
			}),
		),
	}),
	// whatsappDisplay isn't repeated here — it's src/data/site.ts's
	// `whatsapp.display`, identical on every page that renders a contact CTA.
	z.object({
		type: z.literal('contact'),
		eyebrow: z.string(),
		heading: z.string(),
	}),
]);

const pages = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
	schema: pageSectionSchema,
});

export const collections = { blog, projects, resources, courses, services, store, pages };
