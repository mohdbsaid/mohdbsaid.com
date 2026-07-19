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

/**
 * The chronologically previous/next non-draft entry relative to `currentId`,
 * newest-first. Generic across any collection (all four share
 * `publishDate`/`draft`) even though only blog post pages use it today.
 */
export async function getAdjacentEntries<C extends CollectionKey>(
	collection: C,
	currentId: string,
): Promise<{ previous?: CollectionEntry<C>; next?: CollectionEntry<C> }> {
	const entries = await getCollection(collection, ({ data }) => !data.draft);
	const sorted = entries.sort(
		(a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
	);
	const index = sorted.findIndex((entry) => entry.id === currentId);

	if (index === -1) return {};

	return { previous: sorted[index + 1], next: sorted[index - 1] };
}

/**
 * Other non-draft blog posts ranked by shared tags (weighted higher) and
 * matching category, newest-first among ties. Only blog has `tags`/
 * `category`, so unlike `getAdjacentEntries` this isn't generic. Returns
 * fewer than `limit` (or none) rather than padding with unrelated posts.
 */
export async function getRelatedPosts(
	current: CollectionEntry<'blog'>,
	limit = 3,
): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	return posts
		.filter((post) => post.id !== current.id)
		.map((post) => {
			const sharedTags = post.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
			const sameCategory = post.data.category === current.data.category ? 1 : 0;
			return { post, score: sharedTags * 2 + sameCategory };
		})
		.filter(({ score }) => score > 0)
		.sort(
			(a, b) =>
				b.score - a.score || b.post.data.publishDate.valueOf() - a.post.data.publishDate.valueOf(),
		)
		.slice(0, limit)
		.map(({ post }) => post);
}
