import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'dist/index.html';
const html = readFileSync(path, 'utf-8');

const title = html.match(/<title>(.*?)<\/title>/)?.[1];
const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
const themeColors = [...html.matchAll(/name="theme-color" media="([^"]+)" content="([^"]+)"/g)].map(
  (m) => `${m[1]} -> ${m[2]}`,
);
const ldJsonMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];

console.log('PATH:', path);
console.log('TITLE:', title);
console.log('CANONICAL:', canonical);
console.log('OG:TITLE:', ogTitle);
console.log('OG:IMAGE:', ogImage);
console.log('OG:URL:', ogUrl);
console.log('THEME-COLOR:', themeColors);
console.log('LD+JSON blocks found:', ldJsonMatches.length);
ldJsonMatches.forEach((m, i) => {
  const parsed = JSON.parse(m[1]);
  console.log(`--- block ${i} @type:`, parsed['@type']);
  if (parsed['@type'] === 'LocalBusiness') {
    console.log('    geo:', parsed.geo);
    console.log('    address:', parsed.address);
    console.log('    openingHoursSpecification:', parsed.openingHoursSpecification);
  }
  if (parsed['@type'] === 'FAQPage') {
    console.log('    perguntas:', parsed.mainEntity.length);
  }
});
