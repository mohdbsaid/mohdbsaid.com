import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	return rss({
		title: 'محمد الجابري',
		description: 'موقع شخصي لتوثيق مشاريعي، مقالاتي، وأعمالي في الطباعة ثلاثية الأبعاد.',
		site: context.site!,
		items: posts
			.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.publishDate,
				link: `/blog/${post.id}/`,
			})),
	});
}
