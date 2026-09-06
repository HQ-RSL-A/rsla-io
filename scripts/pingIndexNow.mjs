/**
 * pingIndexNow.mjs
 *
 * Reads the generated sitemap.xml and submits all URLs to IndexNow.
 * IndexNow pings Bing, Yandex, Naver, and Seznam simultaneously.
 *
 * Runs automatically as part of `npm run build`.
 * Can also run standalone: node scripts/pingIndexNow.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INDEXNOW_KEY = '42f4e2d222a8441d91b82a1d06d0db72';
const HOST = 'rsla.io';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_PATH = resolve(__dirname, '../dist/sitemap.xml');

async function pingIndexNow() {
  // Only a Vercel production build may ping. A local build would submit URLs
  // that are not live yet (or not live at all), and Bing crawls them as 404s.
  if (process.env.VERCEL_ENV !== 'production' && !process.argv.includes('--force')) {
    console.log('IndexNow skipped: not a Vercel production build (pass --force to ping anyway)');
    return;
  }
  // Read sitemap and extract URLs
  let sitemap;
  try {
    sitemap = readFileSync(SITEMAP_PATH, 'utf-8');
  } catch {
    console.warn('IndexNow skipped: sitemap.xml not found (run sitemap generation first)');
    return;
  }

  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

  if (urls.length === 0) {
    console.warn('IndexNow skipped: no URLs found in sitemap');
    return;
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`IndexNow pinged: ${urls.length} URLs submitted (HTTP ${res.status})`);
    } else {
      const body = await res.text();
      console.warn(`IndexNow warning: HTTP ${res.status} — ${body}`);
    }
  } catch (err) {
    // Non-fatal: don't break the build if IndexNow is down
    console.warn(`IndexNow skipped (network error): ${err.message}`);
  }
}

pingIndexNow();
