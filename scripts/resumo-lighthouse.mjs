import { readFileSync } from 'node:fs';

const path = process.argv[2];
const report = JSON.parse(readFileSync(path, 'utf-8'));

console.log('URL:', report.finalUrl);
console.log('Form factor:', report.configSettings.formFactor);
console.log('---');
for (const [key, cat] of Object.entries(report.categories)) {
  console.log(`${cat.title}: ${Math.round(cat.score * 100)}`);
}
console.log('---');
const metrics = report.audits;
const interessantes = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
];
for (const id of interessantes) {
  const a = metrics[id];
  if (a) console.log(`${a.title}: ${a.displayValue}`);
}
