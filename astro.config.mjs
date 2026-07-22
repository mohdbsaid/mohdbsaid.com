// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://mohdbsaid.com',
	integrations: [
		sitemap({
			// Neither the RSS feed nor the blog search index is an HTML page —
			// keep both out of the sitemap.
			filter: (page) => !page.endsWith('/rss.xml') && !page.endsWith('/search-index.json'),
		}),
	],
	markdown: {
		// Shiki ships with Astro — dual themes follow prefers-color-scheme
		// automatically, matching this site's existing light/dark tokens.
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
		},
	},
});
