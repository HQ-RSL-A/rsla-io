#!/usr/bin/env node
/**
 * Turn the service page copy files (docs/seo/service-pages/*.md) into
 * src/data/servicePages.generated.json, the single source both the React
 * MoneyPage template and scripts/prerender.mjs render from.
 *
 * The copy files are the source of truth. Never hand-edit the JSON.
 * Run: node scripts/build-service-copy.mjs   (also runs first in `npm run build`)
 */
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../docs/seo/service-pages');
const OUT = resolve(__dirname, '../src/data/servicePages.generated.json');
const SITE = 'https://rsla.io';

const LABELS = {
  '/services': 'Services',
  '/services/websites': 'Websites',
  '/services/websites/redesign': 'Redesign',
  '/services/seo': 'SEO',
  '/services/seo/local': 'Local SEO',
  '/services/seo/programmatic': 'Programmatic SEO',
  '/services/automations': 'Automations',
  '/services/crm': 'CRM',
  '/services/custom-builds': 'Custom builds',
  '/bakersfield': 'Bakersfield',
  '/bakersfield/websites': 'Websites',
  '/bakersfield/seo': 'SEO',
  '/bakersfield/automations': 'Automations',
  '/bakersfield/crm': 'CRM',
};

function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('missing front matter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { fm, body: m[2].split('\n## Build notes')[0] };
}

function parseBody(body) {
  const lines = body.split('\n');
  const page = { h1: '', lead: null, heroCta: null, proof: [], sections: [], faqHeading: '', faqs: [], finalCta: null };
  let pending = null;
  let section = null;
  let mode = 'body'; // body | faq | final
  let currentFaq = null;
  const ensureSection = (heading) => {
    section = { heading, blocks: [] };
    page.sections.push(section);
    return section;
  };

  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trimEnd();
    const t = s.trim();
    if (!t || t === '---') continue;

    if (t.startsWith('<!--')) {
      const hl = t.match(/highlight "([^"]+)"/);
      if (t.includes('hero subhead')) pending = { kind: 'lead', highlight: hl ? hl[1] : null };
      else if (t.includes('proof row')) pending = { kind: 'proof' };
      continue;
    }
    if (t.startsWith('# ')) { page.h1 = t.slice(2).trim(); continue; }
    if (t.startsWith('## ')) {
      const heading = t.slice(3).trim();
      if (/^final cta$/i.test(heading)) { mode = 'final'; continue; }
      if (/^questions/i.test(heading)) { mode = 'faq'; page.faqHeading = heading; continue; }
      mode = 'body';
      ensureSection(heading);
      continue;
    }
    if (t.startsWith('### ')) {
      currentFaq = { q: t.slice(4).trim(), a: '' };
      page.faqs.push(currentFaq);
      continue;
    }
    if (t.startsWith('[CTA]')) {
      const rest = t.slice(5).trim();
      const [lead, label] = rest.split('→').map(x => (x || '').trim());
      const cta = { lead: lead || '', label: label || 'Book a call' };
      if (!page.heroCta && page.sections.length === 0 && mode === 'body') { page.heroCta = cta; continue; }
      if (mode === 'final') { page.finalCta = { ...(page.finalCta || {}), label: cta.label }; continue; }
      (section || ensureSection(null)).blocks.push({ type: 'cta', ...cta });
      continue;
    }
    if (pending?.kind === 'lead') {
      page.lead = { text: t, highlight: pending.highlight };
      pending = null; continue;
    }
    if (pending?.kind === 'proof') {
      page.proof = t.split('·').map(x => x.trim()).filter(Boolean);
      pending = null; continue;
    }
    if (mode === 'faq') {
      if (currentFaq) currentFaq.a = currentFaq.a ? `${currentFaq.a} ${t}` : t;
      continue;
    }
    if (mode === 'final') {
      page.finalCta = { ...(page.finalCta || {}), text: page.finalCta?.text ? `${page.finalCta.text} ${t}` : t };
      continue;
    }
    if (/^\d+\. /.test(t)) {
      const sec = section || ensureSection(null);
      const last = sec.blocks[sec.blocks.length - 1];
      const item = t.replace(/^\d+\. /, '');
      if (last && last.type === 'ol') last.items.push(item);
      else sec.blocks.push({ type: 'ol', items: [item] });
      continue;
    }
    if (t.startsWith('"')) {
      const next = (lines[i + 1] || '').trim();
      let cite = '';
      if (next && !next.startsWith('#') && !next.startsWith('[') && !next.startsWith('"') && !next.startsWith('<')) { cite = next; i++; }
      (section || ensureSection(null)).blocks.push({ type: 'quote', text: t, cite });
      continue;
    }
    (section || ensureSection(null)).blocks.push({ type: 'p', text: t });
  }
  return page;
}

function breadcrumbFor(url) {
  const parts = url.split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', item: `${SITE}/` }];
  let acc = '';
  for (const p of parts) {
    acc += `/${p}`;
    crumbs.push({ name: LABELS[acc] || p, item: `${SITE}${acc}` });
  }
  return crumbs;
}

const files = readdirSync(SRC).filter(f => f.endsWith('.md') && !['README.md', 'tracker.md'].includes(f)).sort();
const pages = [];
for (const f of files) {
  const raw = readFileSync(resolve(SRC, f), 'utf-8');
  const { fm, body } = parseFrontMatter(raw);
  const parsed = parseBody(body);
  const url = fm.url;
  const group = url.startsWith('/bakersfield') ? 'bakersfield' : 'national';
  const parent = url.split('/').slice(0, -1).join('/') || '/';
  const links = (fm.internal_links || '').split(',').map(x => x.trim().split(' ')[0]).filter(Boolean);
  pages.push({
    file: f,
    route: url,
    group,
    parent: parent === '' ? '/' : parent,
    breadcrumb: breadcrumbFor(url),
    title: fm.title,
    meta: fm.meta,
    keyword: fm.keyword,
    canonical: `${SITE}${url}`,
    city: group === 'bakersfield' ? 'Bakersfield' : null,
    internalLinks: links,
    ...parsed,
  });
  if (!parsed.h1 || !parsed.lead || !parsed.heroCta || parsed.proof.length !== 3 || parsed.faqs.length < 3 || !parsed.finalCta?.text) {
    throw new Error(`${f}: parse incomplete ${JSON.stringify({ h1: !!parsed.h1, lead: !!parsed.lead, hero: !!parsed.heroCta, proof: parsed.proof.length, faqs: parsed.faqs.length, final: !!parsed.finalCta?.text })}`);
  }
}

writeFileSync(OUT, JSON.stringify(pages, null, 2) + '\n', 'utf-8');
console.log(`Wrote ${pages.length} service pages to src/data/servicePages.generated.json`);
