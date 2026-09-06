#!/usr/bin/env node
/**
 * Prove the built service pages against the copy set, not against themselves.
 * For every page in src/data/servicePages.generated.json: the prerendered file
 * exists, its <title>, meta description, canonical, and H1 match exactly, there
 * is exactly one H1, no em or en dash appears anywhere, every visible copy
 * line (lead, proof tiles, paragraphs, list items, quotes, FAQ answers, final
 * CTA) is present in the page text, JSON-LD parses and carries Service,
 * BreadcrumbList, and FAQPage, and the tel link is present.
 *
 * Run after `npm run build`:  node scripts/verify-service-pages.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const pages = JSON.parse(readFileSync(resolve(__dirname, '../src/data/servicePages.generated.json'), 'utf-8'));

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const norm = (s) => decode(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();
// Inline tags (links, spans, emphasis) vanish so "an <a>automation</a>, not" reads
// "an automation, not"; every other tag becomes a space so blocks never fuse.
const textOf = (html) => norm(html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<\/?(a|span|strong|em|b|i)\b[^>]*>/g, '')
  .replace(/<[^>]+>/g, ' '));

let failures = 0;
const fail = (route, msg) => { failures++; console.error(`  FAIL ${route}: ${msg}`); };

for (const page of pages) {
  const file = resolve(DIST, page.route.replace(/^\//, ''), 'index.html');
  if (!existsSync(file)) { fail(page.route, 'no prerendered file'); continue; }
  const html = readFileSync(file, 'utf-8');
  const text = textOf(html);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (decode(title || '') !== page.title) fail(page.route, `title "${decode(title || '')}" != "${page.title}"`);
  const meta = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (decode(meta || '') !== page.meta) fail(page.route, `meta mismatch`);
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (canonical !== page.canonical) fail(page.route, `canonical ${canonical}`);
  if (/<meta name="robots"[^>]*noindex/.test(html)) fail(page.route, 'noindex present');

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => norm(m[1].replace(/<[^>]+>/g, '')));
  if (h1s.length !== 1) fail(page.route, `${h1s.length} H1s`);
  else if (h1s[0] !== page.h1) fail(page.route, `H1 "${h1s[0]}" != "${page.h1}"`);
  const firstHeading = html.match(/<h[1-6][^>]*>/);
  if (firstHeading && !firstHeading[0].startsWith('<h1')) fail(page.route, 'first heading is not the H1');

  if (/[–—]/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) fail(page.route, 'em or en dash in HTML');

  const lines = [];
  lines.push(page.lead.text, ...page.proof, page.heroCta.lead, page.finalCta.text);
  for (const s of page.sections) {
    if (s.heading) lines.push(s.heading);
    for (const b of s.blocks) {
      if (b.type === 'p') lines.push(b.text);
      if (b.type === 'ol') lines.push(...b.items);
      if (b.type === 'quote') { lines.push(b.text); if (b.cite) lines.push(b.cite); }
      if (b.type === 'cta') lines.push(b.lead);
    }
  }
  for (const f of page.faqs) lines.push(f.q, f.a);
  for (const line of lines) {
    const n = norm(line);
    if (n && !text.includes(n)) fail(page.route, `missing line: ${n.slice(0, 90)}`);
  }

  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const types = new Set();
  for (const raw of ld) {
    try { const j = JSON.parse(raw); (Array.isArray(j) ? j : [j]).forEach(n => { const t = n['@type']; (Array.isArray(t) ? t : [t]).forEach(x => types.add(x)); }); }
    catch { fail(page.route, 'JSON-LD does not parse'); }
  }
  for (const t of ['Service', 'BreadcrumbList', 'FAQPage']) if (!types.has(t)) fail(page.route, `JSON-LD missing ${t}`);
  if (!html.includes('href="tel:+16614665919"')) fail(page.route, 'no tel link');
  if (!html.includes('href="/contact"')) fail(page.route, 'no /contact link');
}

// Legacy routes must not be prerendered any more
for (const old of ['services/web-design', 'services/ai-automations', 'services/crm-systems', 'services/custom-development', 'services/bakersfield']) {
  if (existsSync(resolve(DIST, old, 'index.html'))) fail(`/${old}`, 'legacy route still prerendered');
}

if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log(`OK: ${pages.length} service pages verified against the copy set`);
