// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkDraftNote } from './plugins/remark-draft-note.mjs';

// Update `site` to your real domain before launch — it drives canonical URLs,
// the sitemap, and Open Graph tags. See README.md.
export default defineConfig({
  site: 'https://joeyzhang.example.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDraftNote],
  },
});
