// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/data/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // PROVISÓRIO — enquanto o domínio definitivo não é apontado, o site é
  // publicado no GitHub Pages sob /osmar/. Remover este `base` (e trocar
  // `site` para a raiz do domínio) quando o domínio definitivo estiver ativo.
  base: '/osmar/',
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
