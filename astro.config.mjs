// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkDraftNote } from './plugins/remark-draft-note.mjs';

// `site` drives canonical URLs, the sitemap and Open Graph tags. Currently the
// Vercel deployment URL; swap it for a custom domain when there is one.
export default defineConfig({
  site: 'https://claude-sandbox-xi.vercel.app',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDraftNote],
  },
});
