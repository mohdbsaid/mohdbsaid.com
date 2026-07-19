import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Shared homepage query: non-draft, featured entries, newest first, capped
 * at `limit`. Every collection (blog/projects/resources/courses) shares the
 * same base schema (see src/content.config.ts), so this one helper serves
 * all four homepage sections instead of repeating the query per collection.
 */
export async function getFeatured<C extends CollectionKey>(
	collection: C,
	limit = 3,
): Promise<CollectionEntry<C>[]> {
	const entries = await getCollection(collection, ({ data }) => !data.draft && data.featured);

	return entries
		.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
		.slice(0, limit);
}
