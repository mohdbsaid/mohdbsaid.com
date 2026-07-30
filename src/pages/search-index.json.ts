// Sitewide static JSON index — not a search implementation itself (no
// search library is installed), but the data any future client-side search
// (Pagefind, Fuse.js, etc.) would consume without a backend, across every
// searchable collection at once rather than one index per collection. This
// is what "structure the project so search can be added later without
// refactoring" (docs/DECISIONS.md ADR-025) means in practice: a future
// search UI reads this one endpoint and filters/groups by `type` itself —
// adding a new searchable collection later means adding one block below,
// not building a second index. Same static-endpoint pattern as rss.xml.ts.
// Supersedes the old blog-only src/pages/blog/search-index.json.ts.
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

interface SearchEntry {
	type: 'blog' | 'project' | 'service' | 'product';
	title: string;
	description: string;
	category?: string;
	tags?: string[];
	publishDate: string;
	url: string;
}

export async function GET(context: APIContext) {
	const [posts, projects, services, products] = await Promise.all([
		getCollection('blog', ({ data }) => !data.draft),
		getCollection('projects', ({ data }) => !data.draft),
		getCollection('services', ({ data }) => !data.draft),
		getCollection('store', ({ data }) => !data.draft),
	]);

	const index: SearchEntry[] = [
		...posts.map((post): SearchEntry => ({
			type: 'blog',
			title: post.data.title,
			description: post.data.description,
			category: post.data.category,
			tags: post.data.tags,
			publishDate: post.data.publishDate.toISOString(),
			url: new URL(`/blog/${post.id}/`, context.site).toString(),
		})),
		...projects.map((project): SearchEntry => ({
			type: 'project',
			title: project.data.title,
			description: project.data.description,
			category: project.data.category,
			publishDate: project.data.publishDate.toISOString(),
			url: new URL(`/projects/${project.id}/`, context.site).toString(),
		})),
		...services.map((service): SearchEntry => ({
			type: 'service',
			title: service.data.title,
			description: service.data.description,
			tags: service.data.technologies,
			publishDate: service.data.publishDate.toISOString(),
			url: new URL(`/services/${service.id}/`, context.site).toString(),
		})),
		...products.map((product): SearchEntry => ({
			type: 'product',
			title: product.data.title,
			description: product.data.description,
			category: product.data.category,
			publishDate: product.data.publishDate.toISOString(),
			url: new URL(`/store/${product.id}/`, context.site).toString(),
		})),
	].sort((a, b) => new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf());

	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json' },
	});
}
