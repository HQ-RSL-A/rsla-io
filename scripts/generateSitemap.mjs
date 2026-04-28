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

const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
  { path: '/services', priority: '0.9' },
  { path: '/work', priority: '0.8' },
  { path: '/blog', priority: '0.8' },
  { path: '/contact', priority: '0.9' },
];

async function generateSitemap() {
  console.log('Generating sitemap...');

  // Fetch all published V2 blog slugs
  const blogSlugs = await client.fetch(
    `*[_type == "blogPostV2" && status == "published" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
      "slug": slug.current,
      publishedAt,
      updatedAt
    } | order(publishedAt desc)`
  );

  // Fetch all published V2 case study slugs
  const caseSlugs = await client.fetch(
    `*[_type == "caseStudyV2" && status == "published" && defined(slug.current)]{
      "slug": slug.current,
      publishedAt
    } | order(publishedAt desc)`
  );

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    // Static routes
    ...staticRoutes.map(({ path, priority }) => ({
      loc: `${SITE_URL}${path}`,
      lastmod: today,
      priority,
      changefreq: ['/', '/blog', '/work'].includes(path) ? 'weekly' : 'monthly',
    })),
    // Blog posts
    ...blogSlugs.map(({ slug, publishedAt, updatedAt }) => ({
      loc: `${SITE_URL}/blog/${slug}`,
      lastmod: (updatedAt || publishedAt || today).split('T')[0],
      priority: '0.6',
      changefreq: 'monthly',
    })),
    // Case studies
    ...caseSlugs.map(({ slug, publishedAt }) => ({
      loc: `${SITE_URL}/work/${slug}`,
      lastmod: publishedAt ? publishedAt.split('T')[0] : today,
      priority: '0.7',
      changefreq: 'monthly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
      .map(
        ({ loc, lastmod, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      )
      .join('\n')}
</urlset>`;

  const outputPath = resolve(__dirname, '../dist/sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs (${staticRoutes.length} static, ${blogSlugs.length} blog, ${caseSlugs.length} case studies)`);
}

generateSitemap().catch((err) => {
  console.error('ERROR: Sitemap generation FAILED:', err.message || err);
  process.exitCode = 1;
});
