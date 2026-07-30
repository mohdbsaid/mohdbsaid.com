import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Every collection except `pages` — those share the base `title`/`description`/
 * `publishDate`/`draft`/`featured` shape (see content.config.ts), which is what
 * getFeatured()/getAdjacentEntries() below rely on. `pages` is a fundamentally
 * different content shape (structured page sections, not dated/listable
 * entries — see docs/DECISIONS.md ADR-024) and is fetched with
 * getPageSection() instead.
 */
type ListingCollectionKey = Exclude<CollectionKey, 'pages'>;

type PageSection = CollectionEntry<'pages'>;
type PageSectionData = PageSection['data'];
type PageSectionOfType<T extends PageSectionData['type']> = PageSection & {
	data: Extract<PageSectionData, { type: T }>;
};

/**
 * Fetch one Home/About section (src/content/pages/<page>/<section>/<locale>.mdx)
 * narrowed to the expected `type` from content.config.ts's discriminated
 * union — see docs/DECISIONS.md ADR-024. Throws if the entry is missing or
 * doesn't match `expectedType`: this is build-time page content, not
 * user input, so a missing/mistyped section is a real authoring bug that
 * should fail the build loudly rather than render silently blank.
 *
 * For sections whose body holds rendered prose (profile/training/
 * philosophy/contact), call `render()` from `astro:content` on the
 * returned entry yourself — see src/pages/about.astro for the pattern.
 */
export async function getPageSection<T extends PageSectionData['type']>(
	page: string,
	section: string,
	locale: 'en' | 'ar',
	expectedType: T,
): Promise<PageSectionOfType<T>> {
	const id = `${page}/${section}/${locale}`;
	const entry = await getEntry('pages', id);

	if (!entry) {
		throw new Error(`Missing content: src/content/pages/${id}.mdx`);
	}
	if (entry.data.type !== expectedType) {
		throw new Error(
			`src/content/pages/${id}.mdx has type "${entry.data.type}", expected "${expectedType}"`,
		);
	}

	return entry as PageSectionOfType<T>;
}

/**
 * Shared homepage query: non-draft, featured entries, newest first, capped
 * at `limit`. Every collection (blog/projects/resources/courses) shares the
 * same base schema (see src/content.config.ts), so this one helper serves
 * all four homepage sections instead of repeating the query per collection.
 */
export async function getFeatured<C extends ListingCollectionKey>(
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
export async function getAdjacentEntries<C extends ListingCollectionKey>(
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

/**
 * Other non-draft projects in the same category, newest-first, excluding the
 * current one. Projects have no `tags` (unlike blog), so this is a simpler
 * category-only match — see docs/DECISIONS.md ADR-025.
 */
export async function getRelatedProjects(
	current: CollectionEntry<'projects'>,
	limit = 3,
): Promise<CollectionEntry<'projects'>[]> {
	const projects = await getCollection('projects', ({ data }) => !data.draft);

	return projects
		.filter(
			(project) => project.id !== current.id && project.data.category === current.data.category,
		)
		.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
		.slice(0, limit);
}
