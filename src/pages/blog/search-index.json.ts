// Static JSON index of all published posts — not a search implementation
// itself (no search library is installed), but the data any future
// client-side search (Pagefind, Fuse.js, etc.) would consume without a
// backend. Same static-endpoint pattern as rss.xml.ts.
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	const index = posts
		.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
		.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			category: post.data.category,
			tags: post.data.tags,
			publishDate: post.data.publishDate.toISOString(),
			url: new URL(`/blog/${post.id}/`, context.site).toString(),
		}));

	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json' },
	});
}
