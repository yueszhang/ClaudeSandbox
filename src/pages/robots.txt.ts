import type { APIRoute } from 'astro';
import { site } from '../site';

/**
 * While `site.indexable` is false, this blocks every crawler outright — so the
 * site can be deployed and shared as a live link before it is finished.
 * Flipping the switch in src/site.ts opens it up and advertises the sitemap.
 */
export const GET: APIRoute = ({ url }) => {
  const body = site.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', url.origin)}\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
