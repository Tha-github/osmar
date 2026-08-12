import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

export const GET: APIRoute = () => {
  const corpo = ['User-agent: *', 'Allow: /', 'Disallow: /og/', '', `Sitemap: ${SITE_URL}/sitemap-index.xml`, ''].join(
    '\n',
  );

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
