import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

const SITE_URL = 'https://rsla.io';

async function generateLlmsTxt() {
  console.log('Generating llms.txt...');

  const blogPosts = await client.fetch(
    `*[_type == "blogPostV2" && status == "published" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt
    }`
  );

  const caseStudies = await client.fetch(
    `*[_type == "caseStudyV2" && status == "published" && defined(slug.current)] | order(priority asc) {
      title,
      "slug": slug.current,
      description
    }`
  );

  const lines = [
    '# RSL/A',
    '',
    '> RSL/A puts AI to work for small service businesses: automation, CRM, search, and websites, at a fixed price, with the numbers on a dashboard. Based in Bakersfield, CA, working in person across Kern County and remotely across the US and Canada.',
    '',
    '## Services',
    '',
    '- AI automations (/services/automations): the missed call that texts itself back, the follow up that runs on its own, the intake that fills your CRM. Nothing slips.',
    '- CRM systems (/services/crm): every lead, quote, and customer in one place you can run from your phone. Built on GoHighLevel.',
    '- Search visibility (/services/seo): when customers ask Google or ChatGPT who to call, your business is the answer. SEO, local SEO, and AI answers.',
    '- Websites (/services/websites): new sites and rebuilds that say what you do in one screen, load fast on a phone, and get found.',
    '- Custom builds (/services/custom-builds): internal tools built around how you work. When nothing off the shelf fits.',
    '- Bakersfield, CA (/bakersfield): websites, SEO, automation, and CRM for Kern County businesses, set up in person.',
    '',
    '## Blog Posts',
    '',
  ];

  for (const post of blogPosts) {
    const excerpt = post.excerpt ? `: ${post.excerpt}` : '';
    lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug})${excerpt}`);
    lines.push(`  LLM-optimized: ${SITE_URL}/api/llm/${post.slug}`);
  }

  lines.push('', '## Case Studies', '');

  for (const cs of caseStudies) {
    const desc = cs.description ? `: ${cs.description}` : '';
    lines.push(`- [${cs.title}](${SITE_URL}/work/${cs.slug})${desc}`);
    lines.push(`  LLM-optimized: ${SITE_URL}/api/llm/${cs.slug}`);
  }

  lines.push(
    '',
    '## Links',
    '',
    `- Website: ${SITE_URL}`,
    `- Blog: ${SITE_URL}/blog`,
    `- Case Studies: ${SITE_URL}/work`,
    `- Book a Call: ${SITE_URL}/book-a-call`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- RSS Feed: ${SITE_URL}/rss.xml`,
    ''
  );

  const output = lines.join('\n');
  const outputPath = resolve(__dirname, '../dist/llms.txt');
  writeFileSync(outputPath, output, 'utf-8');
  console.log(
    `llms.txt generated: ${blogPosts.length} blog posts, ${caseStudies.length} case studies`
  );
}

generateLlmsTxt().catch((err) => {
  console.warn('llms.txt generation skipped (non-fatal):', err.message || err);
});
