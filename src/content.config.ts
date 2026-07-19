// Astro Content Layer configuration.
// https://docs.astro.build/en/guides/content-collections/
//
// All four collections share one base schema so a single generic <Card>
// component and a single query helper (src/lib/content.ts) can work across
// blog/projects/resources/courses without special-casing — see
// docs/CONTENT_STRATEGY.md. Each collection extends the base with exactly
// one field that captures what makes that collection's cards distinct.
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const baseSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
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
	schema: (ctx) => requireAltWithCover(baseSchema(ctx).extend({ category: z.string() })),
});

const resources = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
	schema: (ctx) => requireAltWithCover(baseSchema(ctx).extend({ format: z.string() })),
});

const courses = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
	schema: (ctx) => requireAltWithCover(baseSchema(ctx).extend({ level: z.string() })),
});

export const collections = { blog, projects, resources, courses };
