// Gera as imagens de Open Graph a partir das páginas /og/* (que usam o CSS
// e os componentes reais do site), tirando um screenshot exato de 1200x630.
// Uso: depois de `astro build`, rode `astro preview` e, em outro terminal,
// `node scripts/gerar-og.mjs`. Depois rode `astro build` de novo para o
// build final incluir as imagens geradas em public/og/.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE_URL = process.env.OG_BASE_URL ?? 'http://localhost:4321';
const SLUGS = ['home', 'manutencao', 'formas-de-pagamento'];

await mkdir('public/og', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const slug of SLUGS) {
  await page.goto(`${BASE_URL}/og/${slug}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `public/og/${slug}.png` });
  console.log(`Gerado: public/og/${slug}.png`);
}

await browser.close();
