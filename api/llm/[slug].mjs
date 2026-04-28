import { createClient } from '@sanity/client';
import { portableTextToMarkdown } from '../lib/portableTextToMarkdown.mjs';
import { createRateLimiter, checkRateLimit } from '../lib/rateLimit.mjs';

const rateLimiter = createRateLimiter(30, '1 m');

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

const blogQuery = `*[_type == "blogPostV2" && status == "published" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  "authorName": author->name,
  "categories": categories[]->name,
  body,
  faqSchema
}`;

const caseStudyQuery = `*[_type in ["caseStudy", "caseStudyV2"] && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  clientName,
  tag,
  description,
  metrics,
  tldr,
  problemStatement,
  solutionApproach,
  resultsOutcome,
  content,
  faqSchema,
  industry,
  servicesUsed
}`;

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildBlogMarkdown(data) {
  const parts = [];

  parts.push(`# ${data.title}`);
  parts.push('');
  if (data.excerpt) {
    parts.push(`> ${data.excerpt}`);
    parts.push('');
  }
  if (data.authorName) parts.push(`**Author:** ${data.authorName}`);
  if (data.publishedAt) parts.push(`**Published:** ${formatDate(data.publishedAt)}`);
  if (data.categories?.length) parts.push(`**Categories:** ${data.categories.join(', ')}`);
  parts.push(`**Source:** https://rsla.io/blog/${data.slug}`);
  parts.push('');
  parts.push('---');
  parts.push('');

  if (data.body) {
    parts.push(portableTextToMarkdown(data.body));
  }

  if (data.faqSchema?.length) {
    parts.push('');
    parts.push('## Frequently Asked Questions');
    parts.push('');
    for (const faq of data.faqSchema) {
      parts.push(`**Q: ${faq.question}**`);
      parts.push(`A: ${faq.answer}`);
      parts.push('');
    }
  }

  return parts.join('\n').trim();
}

function buildCaseStudyMarkdown(data) {
  const parts = [];

  parts.push(`# ${data.title}`);
  parts.push('');
  if (data.description) {
    parts.push(`> ${data.description}`);
    parts.push('');
  }
  if (data.clientName) parts.push(`**Client:** ${data.clientName}`);
  if (data.tag) parts.push(`**Service:** ${data.tag}`);
  if (data.industry) parts.push(`**Industry:** ${data.industry}`);
  parts.push(`**Source:** https://rsla.io/work/${data.slug}`);
  parts.push('');

  if (data.metrics?.length) {
    parts.push('## Key Metrics');
    parts.push('');
    for (const m of data.metrics) {
      parts.push(`- **${m.value}**: ${m.label}`);
    }
    parts.push('');
  }

  if (data.tldr) {
    parts.push('## TL;DR');
    parts.push('');
    parts.push(data.tldr);
    parts.push('');
  }

  if (data.problemStatement) {
    parts.push('## The Problem');
    parts.push('');
    parts.push(data.problemStatement);
    parts.push('');
  }

  if (data.solutionApproach) {
    parts.push('## The Solution');
    parts.push('');
    parts.push(data.solutionApproach);
    parts.push('');
  }

  if (data.resultsOutcome) {
    parts.push('## The Results');
    parts.push('');
    parts.push(data.resultsOutcome);
    parts.push('');
  }

  if (data.content) {
    parts.push('---');
    parts.push('');
    parts.push(portableTextToMarkdown(data.content));
  }

  if (data.faqSchema?.length) {
    parts.push('');
    parts.push('## Frequently Asked Questions');
    parts.push('');
    for (const faq of data.faqSchema) {
      parts.push(`**Q: ${faq.question}**`);
      parts.push(`A: ${faq.answer}`);
      parts.push('');
    }
  }

  return parts.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed.');
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const { success } = await checkRateLimit(rateLimiter, `llm:${ip}`);
  if (!success) {
    return res.status(429).send('Too many requests. Please try again later.');
  }

  const { slug } = req.query;

  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug) || slug.length > 200) {
    return res.status(400).send('Invalid slug.');
  }

  try {
    // Try blog post first (more content, higher likelihood)
    let data = await client.fetch(blogQuery, { slug });
    if (data) {
      const markdown = buildBlogMarkdown(data);
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(markdown);
    }

    // Then try case study
    data = await client.fetch(caseStudyQuery, { slug });
    if (data) {
      const markdown = buildCaseStudyMarkdown(data);
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(markdown);
    }

    return res.status(404).send('Content not found.');
  } catch (err) {
    console.error('LLM API error:', err);
    return res.status(500).send('Failed to fetch content.');
  }
}
