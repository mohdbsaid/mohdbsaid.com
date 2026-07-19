// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// TODO: confirm final production domain before launch.
	site: 'https://mohdbsaid.com',
	integrations: [
		sitemap({
			// The RSS feed isn't an HTML page — keep it out of the sitemap.
			filter: (page) => !page.endsWith('/rss.xml'),
		}),
	],
});
