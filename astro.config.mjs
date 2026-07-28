// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://mohdbsaid.com',
	integrations: [
		sitemap({
			// Neither the RSS feed nor the blog search index is an HTML page —
			// keep both out of the sitemap.
			filter: (page) => !page.endsWith('/rss.xml') && !page.endsWith('/search-index.json'),
		}),
		// Required for the Content Layer glob loader to parse the `pages`
		// collection's .mdx files (src/content/pages/**) — see
		// docs/DECISIONS.md ADR-024. Installed now (not deferred, unlike
		// ADR-002's RSS precedent) because real .mdx content already exists
		// as of this same change.
		mdx(),
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
