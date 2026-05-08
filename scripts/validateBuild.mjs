import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const SITE = 'https://rsla.io';

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  WARN: ${msg}`);
  warnings++;
}

function pass(msg) {
  console.log(`  OK: ${msg}`);
}

console.log('Validating build output...\n');

// ── Check 1: 404.html exists ────────────────────────────────────────────────

console.log('[1] 404.html');
const notFoundPath = resolve(DIST, '404.html');
if (existsSync(notFoundPath)) {
  const html = readFileSync(notFoundPath, 'utf-8');
  if (html.includes('noindex')) {
    pass('dist/404.html exists with noindex');
  } else {
    fail('dist/404.html exists but missing noindex meta tag');
  }
} else {
  fail('dist/404.html not found — catch-all rewrite will break');
}

// ── Check 2: Sitemap/prerender parity ───────────────────────────────────────

console.log('[2] Sitemap/prerender parity');
const sitemapPath = resolve(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('dist/sitemap.xml not found');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const locMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));

  let parity = 0;
  for (const url of sitemapUrls) {
    const path = url.replace(SITE, '') || '/';
    const filePath = path === '/'
      ? resolve(DIST, 'index.html')
      : resolve(DIST, path.replace(/^\//, ''), 'index.html');

    if (!existsSync(filePath)) {
      fail(`Sitemap URL ${path} has no pre-rendered file at ${filePath}`);
    } else {
      parity++;
    }
  }
  pass(`${parity}/${sitemapUrls.length} sitemap URLs have pre-rendered files`);

  // ── Check 3: No accidental noindex on sitemap pages ─────────────────────

  console.log('[3] No accidental noindex on sitemap pages');
  let noindexCount = 0;
  for (const url of sitemapUrls) {
    const path = url.replace(SITE, '') || '/';
    const filePath = path === '/'
      ? resolve(DIST, 'index.html')
      : resolve(DIST, path.replace(/^\//, ''), 'index.html');

    if (existsSync(filePath)) {
      const html = readFileSync(filePath, 'utf-8');
      if (html.includes('content="noindex')) {
        fail(`Sitemap URL ${path} has noindex — remove from sitemap or remove noindex`);
        noindexCount++;
      }
    }
  }
  if (noindexCount === 0) {
    pass('No sitemap pages have accidental noindex');
  }
}

// ── Check 4: Redirect destinations resolve ────────────────────────────────

console.log('[4] Redirect destinations resolve');
const vercelJsonPath = resolve(__dirname, '../vercel.json');
if (existsSync(vercelJsonPath)) {
  const config = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'));
  const redirects = config.redirects || [];

  let checked = 0;
  let broken = 0;
  for (const r of redirects) {
    const dest = r.destination;
    if (!dest || dest.includes(':') || dest.includes('*')) continue;
    if (dest.startsWith('http')) continue;

    const filePath = dest === '/'
      ? resolve(DIST, 'index.html')
      : resolve(DIST, dest.replace(/^\//, ''), 'index.html');

    checked++;
    if (!existsSync(filePath)) {
      warn(`Redirect ${r.source} -> ${dest} — destination has no pre-rendered file`);
      broken++;
    }
  }
  if (broken === 0) {
    pass(`${checked} redirect destinations verified`);
  }
}

// ── Summary ─────────────────────────────────────────────────────────────────

console.log(`\nValidation complete: ${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) {
  console.error('Build validation FAILED — fix errors before deploying.');
  process.exitCode = 1;
} else {
  console.log('Build validation PASSED.');
}
