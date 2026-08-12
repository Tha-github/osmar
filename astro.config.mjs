// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/data/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    preact(),
    sitemap({
      // As páginas /og/* são cartões para gerar imagens de Open Graph, não
      // conteúdo — não devem aparecer no sitemap nem ser indexadas.
      filter: (page) => !page.includes('/og/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
