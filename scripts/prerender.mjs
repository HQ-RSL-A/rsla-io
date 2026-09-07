/**
 * Pre-render static HTML for all pages (indexed and non-indexed).
 *
 * Runs after `vite build`. For each page:
 * 1. Reads the built dist/index.html as template (has all hashed script/link tags)
 * 2. Replaces meta tags (title, description, OG, Twitter, canonical) with page-specific values
 * 3. Injects semantic HTML content into <div id="root">...</div>
 * 4. Writes to the correct filesystem path (e.g., dist/about/index.html)
 *
 * Vercel serves filesystem files before rewrites, so pre-rendered pages
 * get served directly. React's createRoot().render() replaces the injected
 * content when JS loads — users see normal SPA behavior.
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { portableTextToMarkdown } from '../api/lib/portableTextToMarkdown.mjs';
import { globalSchemas, businessRef, websiteRef, founderRef } from '../src/lib/structuredData.mjs';
import { blogServiceLinks, caseStudyServiceLinks, serviceUrlFromCapability } from '../src/data/blogServiceLinks.mjs';
import { PHONE_TEL, PHONE_DISPLAY, KERN_TOWNS } from '../src/data/serviceConstants.mjs';
import { generateFaqSchema } from '../src/lib/faqSchema.mjs';

const servicePages = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/servicePages.generated.json'), 'utf-8'));

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const SITE = 'https://rsla.io';

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

// ── Global Structured Data (included on every page) ──────────────────────────

// Global entity graph (Organization #business, WebSite #website, Person #rahul) is imported
// from src/lib/structuredData.mjs and shared with the client (src/components/Seo.jsx), so the
// prerendered HTML and the hydrated DOM can never drift.

// ── Utilities ─────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const siteNav = `<nav aria-label="Main navigation"><ul>
<li><a href="/">Home</a></li>
<li><a href="/about">About</a></li>
<li><a href="/services">Services</a>
<ul>
<li><a href="/services/automations">AI automations</a></li>
<li><a href="/services/crm">CRM systems</a></li>
<li><a href="/services/seo">Search visibility</a>
<ul><li><a href="/services/seo/local">Local SEO</a></li><li><a href="/services/seo/programmatic">Programmatic SEO</a></li></ul></li>
<li><a href="/services/websites">Websites</a>
<ul><li><a href="/services/websites/redesign">Website redesign</a></li></ul></li>
<li><a href="/services/custom-builds">Custom builds</a></li>
<li><a href="/bakersfield">Bakersfield, CA</a>
<ul><li><a href="/bakersfield/websites">Web design in Bakersfield</a></li><li><a href="/bakersfield/seo">SEO in Bakersfield</a></li><li><a href="/bakersfield/automations">AI automation in Bakersfield</a></li><li><a href="/bakersfield/crm">CRM setup in Bakersfield</a></li></ul></li>
</ul>
</li>
<li><a href="/work">Case Studies</a></li>
<li><a href="/blog">Blog</a></li>
</ul></nav>`;

// Escape JSON-LD for safe embedding inside <script> tags.
// Prevents </script> breakout and HTML comment tricks even if content contains user-sourced strings.
function escapeJsonLd(schema) {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function inject(tmpl, { title, description, canonical, jsonLd, html, ogImage, keywords, noIndex }) {
  let p = tmpl;

  // All content replacements use function-form (() => value) so `$` sequences in the
  // injected value (e.g. "Save $$$", "$2,500", a stray "$&") are inserted literally.
  // A plain string replacement treats `$$`, `$&`, `` $` ``, `$'` as special and corrupts output.
  p = p.replace(/<title>.*?<\/title>/, () => `<title>${esc(title)}</title>`);
  p = p.replace(
    /<meta name="description" content="[^"]*" \/>/,
    () => `<meta name="description" content="${esc(description)}" />`
  );

  if (keywords) {
    if (p.includes('<meta name="keywords"')) {
      p = p.replace(/<meta name="keywords" content="[^"]*" \/>/, () => `<meta name="keywords" content="${esc(keywords)}" />`);
    } else {
      p = p.replace('</head>', () => `<meta name="keywords" content="${esc(keywords)}" />\n</head>`);
    }
  }

  p = p.replace(/<meta property="og:title" content="[^"]*" \/>/, () => `<meta property="og:title" content="${esc(title)}" />`);
  p = p.replace(/<meta property="og:description" content="[^"]*" \/>/, () => `<meta property="og:description" content="${esc(description)}" />`);
  p = p.replace(/<meta property="og:url" content="[^"]*" \/>/, () => `<meta property="og:url" content="${esc(canonical)}" />`);

  if (ogImage) {
    p = p.replace(/<meta property="og:image" content="[^"]*" \/>/, () => `<meta property="og:image" content="${esc(ogImage)}" />`);
    p = p.replace(/<meta name="twitter:image" content="[^"]*" \/>/, () => `<meta name="twitter:image" content="${esc(ogImage)}" />`);
  }

  p = p.replace(/<meta name="twitter:title" content="[^"]*" \/>/, () => `<meta name="twitter:title" content="${esc(title)}" />`);
  p = p.replace(/<meta name="twitter:description" content="[^"]*" \/>/, () => `<meta name="twitter:description" content="${esc(description)}" />`);

  p = p.replace(/<link rel="canonical" href="[^"]*" \/>/, () => `<link rel="canonical" href="${esc(canonical)}" />`);

  // Robots meta — emit noindex for pages flagged noIndex, remove any existing robots meta otherwise
  if (noIndex) {
    if (p.match(/<meta name="robots"[^>]*\/>/)) {
      p = p.replace(/<meta name="robots"[^>]*\/>/, () => `<meta name="robots" content="noindex, follow" />`);
    } else {
      p = p.replace('</head>', () => `<meta name="robots" content="noindex, follow" />\n</head>`);
    }
  } else {
    p = p.replace(/<meta name="robots"[^>]*\/>\s*/g, '');
  }

  const allSchemas = [
    ...(noIndex ? [] : globalSchemas),
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
  ];
  if (allSchemas.length) {
    const scripts = allSchemas.map(s => `<script type="application/ld+json" data-seo-jsonld>${escapeJsonLd(s)}</script>`).join('\n');
    // Function replacement so `$` sequences in JSON-LD (e.g. priceRange "$$$") are inserted
    // literally. A string replacement would treat `$$`, `$&`, etc. as special and corrupt them.
    p = p.replace('</head>', () => `${scripts}\n</head>`);
  }

  // Function replacement so dollar amounts in prerendered body copy (e.g. "$2,500", "save $$$")
  // are inserted literally rather than interpreted as replacement-pattern tokens.
  p = p.replace('<div id="root"></div>', () => `<div id="root"><div id="prerender">${siteNav}${html}</div></div>`);

  return p;
}

function writePage(route, content) {
  const filePath = route === '/'
    ? resolve(DIST, 'index.html')
    : resolve(DIST, route.replace(/^\//, ''), 'index.html');
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ptToHtml(blocks) {
  if (!blocks) return '';
  const md = portableTextToMarkdown(blocks);
  if (!md) return '';
  // Sanitize before this HTML is injected into the prerendered <div id="prerender">.
  // marked does NOT strip inline HTML, and the site CSP allows script-src 'unsafe-inline',
  // so a Portable Text body containing literal <script>/<img onerror=...> would otherwise
  // execute in the browser (it runs during initial HTML parse, before React replaces the div).
  // Allow only the formatting tags marked emits; default schemes drop javascript:/data: URLs.
  return sanitizeHtml(marked.parse(md), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
    },
  });
}

// ── Static Pages ──────────────────────────────────────────────────────────────

function homeContent() {
  return {
    title: 'RSL/A | We put AI to work for small service businesses',
    description: "Automation, CRM, SEO, and websites for small service businesses. Fixed price, real numbers on a dashboard, in person in Bakersfield and remote across the US.",
    canonical: SITE,
    keywords: 'AI automation agency, GoHighLevel expert, small business SEO, small business website design, marketing agency Bakersfield',
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What types of businesses do you work with?', acceptedAnswer: { '@type': 'Answer', text: 'One person and small service businesses: the trades, clinics, salons, restaurants, agencies, and the professional services firms that run on referrals. Most are in Kern County or work with us remotely from anywhere in the US and Canada. Nonprofits and B2B companies are welcome too, on the same process.' } },
          { '@type': 'Question', name: 'How long does it take to see results?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on what we build. A website launches in four to six weeks. A CRM or a single automation goes live in one to three weeks. SEO takes three to six months for the first real movement and closer to a year to compound. We say which on the first call and report what moved each month.' } },
          { '@type': 'Question', name: 'Do you lock clients into long-term contracts?', acceptedAnswer: { '@type': 'Answer', text: 'No. Builds are a fixed project price. Ongoing work, such as SEO, automation upkeep, or CRM management, is month to month after the build and you can stop any time. If it is not paying for itself, you should not be paying for it.' } },
          { '@type': 'Question', name: 'What platforms and tools do you use?', acceptedAnswer: { '@type': 'Answer', text: 'Websites are hand coded on React and Next.js. CRM and follow up run on GoHighLevel. Workflows run in n8n or Make, with an AI agent where a step needs judgment. We pick the tool that fits the job and your existing stack, and we do not make you switch software to get there.' } },
          { '@type': 'Question', name: 'How is RSL/A different from other agencies?', acceptedAnswer: { '@type': 'Answer', text: 'Two things. Rahul came from analytics, so you get a dashboard with your real leads, calls, rankings, and costs instead of a monthly report of impressions. And we diagnose before we sell: a business with no follow up system needs a CRM more than it needs ads, and we say so even when it is the smaller job.' } },
        ],
      },
    ],
    html: `<main>
<h1>Only you know what your time is worth. We put AI to work to get it back.</h1>
<p>Automation, CRM, search, and websites for small service businesses. Fixed price, and the numbers on a dashboard.</p>
<p><a href="/contact">Book a call</a> | <a href="/work">See the work</a></p>

<section><h2>Five things we build</h2>
<p>Automation first, because that is where the hours go. Then a CRM so nothing slips, search so customers find you, a website that says what you do in one screen, and the internal tool nobody sells. Each is a fixed price with its own page.</p>
<article><h3><a href="/services/automations">AI automations</a></h3>
<p>The missed call that texts itself back, the follow up that runs on its own, the intake that fills your CRM. Nothing slips.</p></article>
<article><h3><a href="/services/crm">CRM systems</a></h3>
<p>Every lead, quote, and customer in one place you can run from your phone. Built on GoHighLevel.</p></article>
<article><h3><a href="/services/seo">Search visibility</a></h3>
<p>When customers ask Google or ChatGPT who to call, your business is the answer. SEO, local SEO, and AI answers.</p></article>
<article><h3><a href="/services/websites">Websites</a></h3>
<p>New sites and rebuilds that say what you do in one screen, load fast on a phone, and get found.</p></article>
<article><h3><a href="/services/custom-builds">Custom builds</a></h3>
<p>Internal tools built around how you work: trackers, dashboards, quote builders. When nothing off the shelf fits.</p></article>
</section>

<section><h2>Three numbers from the work</h2>
<ul><li>204 keywords ranked on our own domain in 6 months, with no ad spend</li><li>Two salon suites filled from $600 in ads, worth $36K a year in rent</li><li>1,200 personalized emails a day from one 3 step automation</li></ul>
</section>

<section><h2>What clients say</h2>
<blockquote><p>I recently hired Rahul to revamp our company website, and I couldn't be more thrilled with the results! Their expertise and dedication transformed my site by restructuring it, fixing critical errors, and significantly boosting its performance. Thanks to their outstanding work on on-page SEO and ongoing SEO efforts, my website has seen a remarkable increase in organic traffic and a substantial improvement in qualified inbound lead generation.</p><cite>Sid S., Account Executive, SBC</cite></blockquote>
<blockquote><p>Working with Rahul on my GoHighLevel setup was an excellent experience. He was extremely knowledgeable, responsive, and efficient from start to finish. Rahul quickly understood what I needed and structured my GHL account properly. Pipelines, automations, workflows, integrations, and overall system flow.</p><cite>Curtis H., CEO/Founder, AdReviveAI</cite></blockquote>
<blockquote><p>Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule. Highly recommend.</p><cite>Chris K., CEO/Co-Founder, Fieldshare</cite></blockquote>
<blockquote><p>I tried for months to rent my salon space and nothing worked. After Rahul and RSL/A, in just a few months both my rooms were filled. Now I don't stress about rent anymore.</p><cite>Laiz C., CEO, Casagrande Salon</cite></blockquote>
<blockquote><p>Rahul does a stellar job on setting up GHL accounts. He is an expert and gave me immense knowledge about the platform. Would love to work with him again. Highly recommend anyone who wants an expert on Go High Level.</p><cite>Parminder S., CEO/Founder, Chauffeur on Demand</cite></blockquote>
</section>

<section><h2>About the founder</h2>
<p>Five years in marketing, automation, and business infrastructure. Started in analytics. Got laid off. Built an agency from nothing. And along the way, I watched owners with real talent suffocate under admin that never should have touched their hands.</p>
<p>That became the only question worth answering: how do you build systems that actually run a business, not just look good in a demo?</p>
<p>I put everything out there. The tools, the exact workflows, the numbers. You can learn all of it from my content. But knowing how it works and building it so it still runs at 500 leads instead of 10? That is the part you hire us for.</p>
<p>Rahul Lalia, Founder, RSL/A</p>
</section>

<section><h2>Frequently asked questions</h2>
<dl>
<dt>What types of businesses do you work with?</dt><dd>One person and small service businesses: the trades, clinics, salons, restaurants, agencies, and the professional services firms that run on referrals. Most are in Kern County or work with us remotely from anywhere in the US and Canada. Nonprofits and B2B companies are welcome too, on the same process.</dd>
<dt>How long does it take to see results?</dt><dd>It depends on what we build. A website launches in four to six weeks. A CRM or a single automation goes live in one to three weeks. SEO takes three to six months for the first real movement and closer to a year to compound. We say which on the first call and report what moved each month.</dd>
<dt>Do you lock clients into long-term contracts?</dt><dd>No. Builds are a fixed project price. Ongoing work, such as SEO, automation upkeep, or CRM management, is month to month after the build and you can stop any time. If it is not paying for itself, you should not be paying for it.</dd>
<dt>What platforms and tools do you use?</dt><dd>Websites are hand coded on React and Next.js. CRM and follow up run on GoHighLevel. Workflows run in n8n or Make, with an AI agent where a step needs judgment. We pick the tool that fits the job and your existing stack, and we do not make you switch software to get there.</dd>
<dt>How is RSL/A different from other agencies?</dt><dd>Two things. Rahul came from analytics, so you get a dashboard with your real leads, calls, rankings, and costs instead of a monthly report of impressions. And we diagnose before we sell: a business with no follow up system needs a CRM more than it needs ads, and we say so even when it is the smaller job.</dd>
</dl>
</section>

<section><h2>Book a free 30 minute call.</h2>
<p>Tell us what is not working. We will tell you what we would build first, what it would cost, and whether it is worth it.</p>
<p><a href="/contact">Book a call</a></p>
</section>
</main>`,
  };
}

function aboutContent() {
  return {
    title: 'About Rahul Lalia, founder of RSL/A',
    description: 'Meet Rahul Lalia, founder of RSL/A. Five years in marketing, automation, and business infrastructure, building systems that actually run businesses.',
    canonical: `${SITE}/about`,
    keywords: 'Rahul Lalia, RSL/A founder, AI automation expert, marketing automation consultant, business systems builder',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${SITE}/about`,
      mainEntity: founderRef,
    },
    html: `<main>
<h1>"What a privilege to be tired from work you once begged the universe for..."</h1>

<section><h2>How it started</h2>
<p>I started my career in marketing analytics. Numbers, dashboards, attribution models. I was the guy staring at spreadsheets while everyone else was making the creative decisions.</p>
<p>Then I got laid off.</p>
<p>And honestly? It was the best thing that happened to me. Because it forced me to build something on my own.</p>
<p>I started an agency. The classic social media marketing agency thing. Posting content, running accounts, doing the hustle. But I kept noticing the same pattern with every client I worked with.</p>
<p>They were not struggling because they lacked talent. They were drowning in manual work.</p>
<p>Following up with leads at midnight. Copy-pasting between three different tools. Losing deals because they forgot to reply. Running ads with zero tracking. Paying for five different software subscriptions that did not talk to each other.</p>
<p>And you know what? Most of the "solutions" out there made it worse. More tools, more complexity, more things to manage.</p>
<p>So I started asking a different question. What if AI could handle all the stuff that owners should not be doing manually? Not theoretical AI. Not "we will build you a chatbot" AI. Practical, measured, actually-useful-for-your-business AI. That became the whole thing.</p>
</section>

<section><h2>What I actually do</h2>
<p>I show owners how to put AI to work in their business. Then I build it for them.</p>
<p>The teaching part is free. I post the workflows, the tools, the exact systems. No gatekeeping. If you can build it yourself after watching my content, I genuinely want that for you.</p>
<p>But here is the thing. There is a difference between knowing what to build and building it right. A system that works for 10 leads breaks at 500. An AI bot that sounds great in a demo falls apart with real customers. The gap between a prototype and a production system is where most owners get stuck. That is where RSL/A comes in. My team and I are the ones who build the production version. The one that actually scales, actually handles edge cases, and actually shows you the numbers so you know it is working.</p>
</section>

<section><h2>Why I am different</h2>
<p>I came from analytics. That matters.</p>
<p>Most people in this space show you a demo and call it done. I show you a dashboard. Real numbers. What the AI system did this week, how many leads it handled, how many meetings it booked, what the conversion rate was. Because if you cannot measure it, it is just a toy. And owners do not need toys. They need infrastructure.</p>
</section>

<p><a href="/work">See what we have built</a></p>

<section><h2>Words I like</h2>
<blockquote><p>What a privilege to be tired from work you once begged the universe for. What a privilege to feel overwhelmed by growth you used to dream about. What a privilege to be challenged by a life you created on purpose. What a privilege to outgrow things you used to settle for.</p><cite>Aryan Sachdeva, via Medium</cite></blockquote>
</section>
</main>`,
  };
}

function servicesContent() {
  const offers = [
    ['AI automations', '/services/automations', 'The missed call that texts itself back, the follow up that runs on its own, the intake that fills your CRM. Nothing slips.'],
    ['CRM systems', '/services/crm', 'Every lead, quote, and customer in one place you can run from your phone. Built on GoHighLevel.'],
    ['Search visibility', '/services/seo', 'When customers ask Google or ChatGPT who to call, your business is the answer. SEO, local SEO, and AI answers.'],
    ['Websites', '/services/websites', 'New sites and rebuilds that say what you do in one screen, load fast on a phone, and get found.'],
    ['Custom builds', '/services/custom-builds', 'Internal tools built around how you work: trackers, dashboards, quote builders. When nothing off the shelf fits.'],
  ];
  return {
    title: 'What we build for small service businesses | RSL/A',
    description: 'AI automation, CRM systems, search visibility, websites, and custom builds for solopreneurs and small service businesses. Fixed price, real numbers, one call to start.',
    canonical: `${SITE}/services`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@id': `${SITE}/#business`,
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Services',
        itemListElement: offers.map(([name, path, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: `${SITE}${path}`, description } })),
      },
    },
    html: `<main>
<h1>What we build for small service businesses.</h1>
<p>Automation first, because that is where the hours go. Then getting found, a website that says what you do, a CRM that catches every lead, and the tools nobody sells. Fixed price, real numbers, one call to start.</p>
<ul>
${offers.map(([name, path, description]) => `<li><a href="${path}"><strong>${esc(name)}</strong></a>: ${esc(description)}</li>`).join('\n')}
</ul>
<section><h2>Based in Bakersfield, CA</h2>
<p><a href="/bakersfield">Websites, SEO, automation, and CRM for Kern County businesses</a></p>
</section>
<section><h2>Not sure where to start?</h2>
<p>Book a free 30 minute call. We will tell you what to build first and what it would cost.</p>
<p><a href="/contact">Book a free call</a></p>
</section>
</main>`,
  };
}

// ── Previously-Unrendered Pages (legal, contact, utility) ─────────────────────

function privacyContent() {
  return {
    title: 'Privacy Policy | RSL/A',
    description: 'RSL/A privacy policy. How we collect, use, and protect your information.',
    canonical: `${SITE}/privacy-policy`,
    noIndex: true,
    html: `<main>
<h1>Privacy Policy</h1>
<p><strong>Effective Date:</strong> February 2026</p>
<p>This Privacy Policy ("Policy") describes how RSL/A ("Company," "we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website at rsla.io (the "Site"), engage our services, or interact with us through any channel, including email, SMS, social media, or third-party platforms.</p>
<p>We operate primarily in the United States and Canada and serve clients internationally. This Policy is designed to comply with applicable privacy laws including the California Consumer Privacy Act (CCPA/CPRA), the Canadian Personal Information Protection and Electronic Documents Act (PIPEDA), and other applicable data protection regulations worldwide.</p>
<p>By using our Site, engaging our services, or providing us with your personal information, you acknowledge that you have read and understood this Policy and consent to the collection, use, and disclosure of your information as described herein.</p>

<h2>1. Information We Collect</h2>
<h3>1.1 Information You Provide Directly</h3>
<p>When you use our Site, submit inquiries, book a call, subscribe to our newsletter, engage our services, or communicate with us, you may voluntarily provide:</p>
<ul>
<li><strong>Contact Information:</strong> Name, email address, phone number, mailing address, company name, job title.</li>
<li><strong>Payment and Billing Information:</strong> Credit or debit card details, billing address, and transaction records, processed securely through third-party payment processors (we do not store full card numbers on our servers).</li>
<li><strong>Business Information:</strong> Industry, marketing goals, budget, website URLs, brand assets, login credentials for platforms you grant us access to.</li>
<li><strong>Communications:</strong> Content of emails, SMS messages, chat messages, phone calls, and any files or documents you share with us.</li>
<li><strong>Newsletter and Marketing Preferences:</strong> Email address and communication preferences when you subscribe to our mailing list or opt in to marketing communications.</li>
<li><strong>User-Generated Content:</strong> Testimonials, reviews, feedback, or other content you submit to us or authorize us to use.</li>
</ul>
<h3>1.2 Information Collected Automatically</h3>
<p>When you visit our Site, certain information is collected automatically through cookies, pixels, and similar tracking technologies:</p>
<ul>
<li><strong>Device and Browser Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, and language preferences.</li>
<li><strong>Usage Data:</strong> Pages visited, time spent on each page, referring URL, links clicked, scroll depth, and navigation paths.</li>
<li><strong>Location Data:</strong> Approximate geographic location derived from your IP address.</li>
<li><strong>Cookies and Tracking Technologies:</strong> We use first-party and third-party cookies, web beacons, and pixels. See Section 10 (Cookie Policy) for full details.</li>
</ul>
<h3>1.3 Information from Third Parties</h3>
<p>We may receive information about you from third-party sources, including:</p>
<ul>
<li>Analytics providers (such as Google Analytics)</li>
<li>Advertising platforms (such as Google Ads and Meta)</li>
<li>CRM and marketing automation platforms</li>
<li>Publicly available sources (business directories, social media profiles, public records)</li>
<li>Referral partners or other clients who provide your contact information with your knowledge</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect for the following purposes:</p>
<ul>
<li><strong>Service Delivery:</strong> To provide, manage, and deliver the services you engage us for.</li>
<li><strong>Communication:</strong> To respond to inquiries, send project updates, schedule calls, and provide customer support.</li>
<li><strong>Billing and Payments:</strong> To process transactions, issue invoices, and maintain financial records.</li>
<li><strong>Marketing:</strong> To send promotional emails, newsletters, and marketing materials. You can opt out at any time.</li>
<li><strong>SMS and Text Messaging:</strong> To send appointment reminders, service updates, and promotional messages (with your express consent).</li>
<li><strong>Analytics and Improvement:</strong> To analyze Site usage, measure campaign performance, and improve our services.</li>
<li><strong>AI Processing:</strong> To use artificial intelligence tools to generate content, analyze data, build automations, and optimize deliverables on your behalf.</li>
<li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and enforceable governmental requests.</li>
<li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, security risks, and technical issues.</li>
</ul>

<h2>3. How We Share Your Information</h2>
<p><strong>We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.</strong></p>
<p>We may share your information in the following circumstances:</p>
<ul>
<li><strong>Service Providers and Vendors:</strong> We share information with third-party platforms and tools that help us deliver our services.</li>
<li><strong>AI and Machine Learning Providers:</strong> Information may be processed by AI service providers (such as Anthropic and OpenAI).</li>
<li><strong>Payment Processors:</strong> Payment information is transmitted directly to our payment processor (Stripe).</li>
<li><strong>Analytics Providers:</strong> We share usage data with analytics services (such as Google Analytics).</li>
<li><strong>Legal Requirements:</strong> We may disclose your information if required by law.</li>
<li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
<li><strong>With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
</ul>

<h2>4. Artificial Intelligence and Automation</h2>
<p>We use artificial intelligence ("AI") and machine learning tools as a core part of how we deliver services. This includes content generation, data analysis, workflow automation, chatbot interactions, and campaign optimization.</p>
<p>AI providers we use include, but are not limited to, Anthropic (Claude) and OpenAI (ChatGPT). Your information may be processed through these platforms to fulfill the services you have engaged us for.</p>
<p>We take reasonable steps to limit the personal information shared with AI providers to what is necessary for the task at hand.</p>
<p>AI-generated outputs are reviewed by our team before delivery. We do not guarantee that AI-generated content is free from errors.</p>

<h2>5. Third-Party Services and Platforms</h2>
<p>We use the following third-party services to operate our business and deliver services:</p>
<ul>
<li>Stripe — Payment processing and billing</li>
<li>GoHighLevel — CRM, SMS messaging, email marketing, booking, and automation</li>
<li>Kit (ConvertKit) — Email newsletter and subscriber management</li>
<li>Google Analytics — Website analytics and usage tracking</li>
<li>Google Ads — Advertising and conversion tracking</li>
<li>Meta (Facebook/Instagram) — Advertising and conversion tracking</li>
<li>Vercel — Website hosting and deployment</li>
<li>Sanity — Content management system</li>
<li>Anthropic (Claude) — AI content generation, data analysis, and automation</li>
<li>OpenAI (ChatGPT) — AI content generation, data analysis, and automation</li>
<li>Notion — Project management and internal documentation</li>
<li>GitHub — Code hosting and version control</li>
<li>Supabase — Database and backend services</li>
<li>Calendly / GHL Calendar — Appointment scheduling</li>
<li>Instagram Messaging API (Meta) — Automated DM responses to followers who interact with our Instagram content. Collects Instagram user IDs, message content, and email addresses voluntarily provided through DM conversations.</li>
</ul>
<h3>Instagram DM Automation</h3>
<p>We operate an automated messaging system that sends direct messages to Instagram users who interact with our content (such as commenting a keyword on a post or replying to a story). When you interact with our Instagram account in this way, we may collect your Instagram user ID, username, message content, and any information you voluntarily provide in the DM conversation (such as your email address). This data is stored securely and used solely to deliver the requested resource and track engagement with our content. You can request deletion of your data at any time by contacting <a href="mailto:team@rsla.io">team@rsla.io</a>.</p>

<h2>6. SMS and Text Messaging</h2>
<p>By providing your phone number and opting in to receive text messages from RSL/A, you expressly consent to receive recurring SMS and MMS messages. Consent is not a condition of purchasing any goods or services. You can opt out at any time by replying STOP. Reply HELP for assistance. Your mobile phone number and SMS consent data will not be shared with or sold to third parties for marketing purposes.</p>

<h2>7. Data Retention</h2>
<ul>
<li><strong>Client Data:</strong> Retained for the duration of the business relationship and for up to 3 years after.</li>
<li><strong>Billing Records:</strong> Retained for up to 7 years as required by tax and accounting regulations.</li>
<li><strong>Marketing Data:</strong> Retained until you opt out or request deletion.</li>
<li><strong>Website Analytics:</strong> Retained according to the data retention settings of the analytics provider.</li>
<li><strong>SMS Consent Records:</strong> Retained for as long as you remain opted in, plus a reasonable period afterward.</li>
</ul>

<h2>8. Data Security</h2>
<p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information, including HTTPS/TLS encryption, PCI-DSS compliant payment processing via Stripe, access controls, and regular review of data handling practices.</p>

<h2>9. Children's Privacy</h2>
<p>Our Site and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. Contact us at team@rsla.io if you believe a child has provided us with personal information.</p>

<h2>10. Cookie Policy</h2>
<p>We use strictly necessary cookies, performance and analytics cookies, functional cookies, and marketing and advertising cookies. Non-essential cookies require your affirmative consent before they are placed on your device. You can manage cookies through our cookie consent banner or your browser settings.</p>

<h2>11. Your Privacy Rights</h2>
<h3>11.1 Rights for All Users</h3>
<p>Access, correction, deletion, opt-out of marketing, and withdrawal of consent.</p>
<h3>11.2 California Residents (CCPA/CPRA)</h3>
<p>Right to know, right to delete, right to correct, right to opt-out of sale or sharing, right to non-discrimination, and right to limit use of sensitive personal information. We do not sell your personal information.</p>
<h3>11.3 Canadian Residents (PIPEDA)</h3>
<p>Right to know, access, correct, withdraw consent, and file complaints with the Office of the Privacy Commissioner of Canada.</p>
<h3>11.4 European Economic Area, UK, and Other International Users</h3>
<p>Data portability, restriction of processing, right to object, and right to lodge a complaint with your local data protection authority.</p>

<h2>12. Do Not Track Signals</h2>
<p>Our Site does not currently respond to DNT browser signals, but we respect your cookie preferences as set through our cookie consent banner.</p>

<h2>13. Third-Party Links</h2>
<p>Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.</p>

<h2>14. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will update the "Effective Date" at the top of this page when we make material changes.</p>

<h2>15. Contact Us</h2>
<p>RSL/A — Privacy Inquiries: <a href="mailto:team@rsla.io">team@rsla.io</a></p>
<p>Last updated: February 2026</p>
</main>`,
  };
}

function termsContent() {
  return {
    title: 'Terms & Conditions | RSL/A',
    description: 'RSL/A terms and conditions for services and website usage.',
    canonical: `${SITE}/terms`,
    noIndex: true,
    html: `<main>
<h1>Terms &amp; Conditions</h1>
<p><strong>Effective Date:</strong> February 2026</p>
<p>These Terms and Conditions ("Terms") govern your access to and use of the website, services, and products provided by RSL/A ("Company," "we," "us," or "our"). By accessing or using our website at rsla.io (the "Site") or engaging our services, you agree to be bound by these Terms.</p>
<p>These Terms should be read together with our <a href="/privacy-policy">Privacy Policy</a>.</p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing or using the Site, submitting any inquiry, booking a call, subscribing to our newsletter, or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>

<h2>2. Definitions</h2>
<ul>
<li><strong>"Services"</strong> means any professional services provided by RSL/A, including marketing, automation, website development, CRM implementation, local SEO, paid advertising, AI automation, content creation, and consulting.</li>
<li><strong>"Client"</strong> or <strong>"you"</strong> means any individual or entity that accesses the Site, submits an inquiry, or engages our Services.</li>
<li><strong>"Deliverables"</strong> means the final work product created specifically for you as part of an engagement.</li>
<li><strong>"Service Agreement"</strong> means any separate proposal, statement of work, contract, or written agreement for a specific engagement.</li>
<li><strong>"Content"</strong> means all text, images, graphics, videos, code, data, and other materials available on or through the Site.</li>
</ul>

<h2>3. Services Provided</h2>
<p>RSL/A provides marketing, automation, website development, CRM implementation, local SEO, paid advertising, AI automation, content creation, and related professional services. The specific scope, timeline, deliverables, and pricing will be outlined in a separate Service Agreement.</p>

<h2>4. Client Responsibilities</h2>
<p>Provide accurate information, respond to requests in a reasonable timeframe, ensure materials do not infringe on third-party rights, maintain confidentiality of shared credentials, and comply with all applicable laws.</p>

<h2>5. Payment Terms</h2>
<p>All fees specified in the applicable Service Agreement. Setup fees and deposits are due before work commences. Monthly retainers are billed in advance. Payments processed via Stripe in USD. Late payments incur 1.5% per month.</p>

<h2>6. No Refund Policy</h2>
<p>ALL SALES ARE FINAL. RSL/A DOES NOT OFFER REFUNDS UNDER ANY CIRCUMSTANCES. All payments are non-refundable, including setup fees, deposits, monthly retainers, and project fees.</p>

<h2>7. Cancellation and Termination</h2>
<p>Monthly retainer Services may be cancelled with 30 days written notice. Project-based Services may be cancelled at any time with written notice, but no refund will be issued for work already completed or fees already paid. We may terminate any engagement immediately for breach of Terms, non-payment, or unethical conduct.</p>

<h2>8. No Guarantees and Disclaimer of Warranties</h2>
<p>WE DO NOT GUARANTEE ANY SPECIFIC RESULTS, OUTCOMES, OR RETURN ON INVESTMENT FROM OUR SERVICES. THE SITE AND ALL SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</p>

<h2>9. Use of Artificial Intelligence</h2>
<p>We use AI tools including Anthropic (Claude), OpenAI (ChatGPT), and others to generate content, analyze data, build automations, and deliver Services. By engaging our Services, you acknowledge and consent to the use of AI tools. AI-generated outputs are reviewed by our team but are not guaranteed to be error-free.</p>

<h2>10. Intellectual Property</h2>
<p>Upon receipt of full payment, you will own the final Deliverables created specifically for you. We retain ownership of all pre-existing materials, templates, frameworks, methodologies, processes, tools, and the RSL/A brand. We reserve the right to display completed work in our portfolio and case studies unless otherwise agreed in writing.</p>

<h2>11. Confidentiality</h2>
<p>Both parties agree to keep confidential any proprietary or sensitive information disclosed during the course of an engagement. Confidentiality obligations survive termination for 2 years.</p>

<h2>12. Indemnification</h2>
<p>You agree to indemnify and hold harmless RSL/A from claims arising from your use of the Site or Services, breach of these Terms, or infringement of third-party rights.</p>

<h2>13. Limitation of Liability</h2>
<p>RSL/A SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU IN THE THREE MONTHS PRECEDING THE EVENT.</p>

<h2>14. Force Majeure</h2>
<p>Neither party shall be liable for failure or delay due to circumstances beyond their reasonable control.</p>

<h2>15. Acceptable Use of the Site</h2>
<p>Do not use the Site for unlawful purposes, attempt unauthorized access, use automated scrapers without consent, interfere with Site integrity, upload malware, or copy Site content without permission.</p>

<h2>16. Third-Party Platforms and Services</h2>
<p>Our Services may involve third-party platforms including GoHighLevel, Stripe, Vercel, Sanity, Google Analytics, and Meta. We are not responsible for their availability, performance, or policies.</p>

<h2>17. SMS and Text Messaging</h2>
<p>By opting in, you consent to receive recurring automated text messages. Consent is not a condition of purchase. Reply STOP to opt out. Reply HELP for assistance. Standard message and data rates may apply.</p>

<h2>18. Dispute Resolution</h2>
<p>Informal resolution first (30 days). If unresolved, binding arbitration under AAA rules in the State of New York. Class action waiver applies.</p>

<h2>19. Governing Law</h2>
<p>These Terms shall be governed by the laws of the State of New York, United States.</p>

<h2>20. Severability</h2>
<p>If any provision is found invalid, the remaining provisions continue in full force and effect.</p>

<h2>21. Entire Agreement</h2>
<p>These Terms, together with our Privacy Policy and any applicable Service Agreement, constitute the entire agreement between you and RSL/A.</p>

<h2>22. Amendments</h2>
<p>We reserve the right to modify these Terms at any time. Continued use constitutes acceptance.</p>

<h2>23. Contact Information</h2>
<p>RSL/A — Legal Inquiries: <a href="mailto:team@rsla.io">team@rsla.io</a></p>
<p>Last updated: February 2026</p>
</main>`,
  };
}

function disclaimerContent() {
  return {
    title: 'Disclaimer | RSL/A',
    description: 'RSL/A disclaimer regarding website content, services, results, and professional advice.',
    canonical: `${SITE}/disclaimer`,
    noIndex: true,
    html: `<main>
<h1>Disclaimer</h1>
<p><strong>Effective Date:</strong> February 2026</p>
<p>This Disclaimer applies to the website at rsla.io (the "Site"), all content published on it, and any services provided by RSL/A ("Company," "we," "us," or "our").</p>

<h2>1. General Information Only</h2>
<p>The content on this Site is provided for general informational and educational purposes only. Nothing on this Site constitutes professional advice, whether legal, financial, tax, medical, or otherwise.</p>

<h2>2. No Guarantees of Results</h2>
<p>We do not guarantee any specific results, outcomes, or return on investment from our services or from applying the information shared on this Site. Any results, metrics, or performance data referenced in our content are specific to those particular clients and circumstances and should not be interpreted as a promise or guarantee of what you will achieve.</p>

<h2>3. Case Studies and Testimonials</h2>
<p>Case studies and testimonials represent the experiences of specific clients. They are not guarantees of future performance. Individual results will vary. We may have received compensation from the individuals featured, as they were paying clients.</p>

<h2>4. Blog and Educational Content</h2>
<p>Content may become outdated. Strategies that worked for one business may not work for another. Mention of specific tools or services does not constitute an endorsement.</p>

<h2>5. AI-Generated Content</h2>
<p>Some content on this Site may be created or assisted by artificial intelligence tools, including Anthropic (Claude) and OpenAI (ChatGPT). AI-generated content is reviewed by our team but we do not guarantee it is free from errors, inaccuracies, or omissions.</p>

<h2>6. Third-Party Links, Tools, and References</h2>
<p>This Site may contain links to third-party websites. We do not control, endorse, or assume responsibility for any third-party content.</p>

<h2>7. Affiliate and Referral Disclosure</h2>
<p>Some links on this Site may be affiliate or referral links. This does not affect the price you pay and does not influence our recommendations.</p>

<h2>8. Not Professional Advice</h2>
<p>Nothing on this Site should be construed as legal advice, financial or investment advice, tax advice, or medical or health advice. We provide marketing, automation, and technology services only.</p>

<h2>9. Errors and Omissions</h2>
<p>We do not warrant that the Site content is complete, correct, or current. We reserve the right to make corrections at any time without notice.</p>

<h2>10. Limitation of Liability</h2>
<p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, RSL/A SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM YOUR USE OF OR RELIANCE ON THE CONTENT OF THIS SITE.</p>

<h2>11. Changes to This Disclaimer</h2>
<p>We may update this Disclaimer from time to time. Continued use constitutes acceptance.</p>

<h2>12. Contact Us</h2>
<p>RSL/A — General Inquiries: <a href="mailto:team@rsla.io">team@rsla.io</a></p>
<p>Last updated: February 2026</p>
</main>`,
  };
}

function accessibilityContent() {
  return {
    title: 'Accessibility Statement | RSL/A',
    description: 'RSL/A commitment to digital accessibility and WCAG compliance.',
    canonical: `${SITE}/accessibility`,
    noIndex: true,
    html: `<main>
<h1>Accessibility Statement</h1>
<p><strong>Effective Date:</strong> February 2026</p>
<p>RSL/A is committed to making our website at rsla.io (the "Site") accessible to all users, including individuals with disabilities.</p>

<h2>1. Our Commitment</h2>
<p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as published by the World Wide Web Consortium (W3C).</p>

<h2>2. Accessibility Measures</h2>
<ul>
<li><strong>Semantic HTML:</strong> Proper heading structures, landmarks, and semantic elements.</li>
<li><strong>Keyboard Navigation:</strong> Core navigation and interactive elements are keyboard-operable.</li>
<li><strong>Color Contrast:</strong> Sufficient color contrast ratios to meet WCAG AA standards.</li>
<li><strong>Alt Text:</strong> Descriptive alternative text for meaningful images.</li>
<li><strong>Responsive Design:</strong> Works across devices and supports browser zoom up to 200%.</li>
<li><strong>Focus Indicators:</strong> Visible focus indicators for keyboard users.</li>
<li><strong>Link Purpose:</strong> Link purpose determinable from link text or context.</li>
</ul>

<h2>3. Known Limitations</h2>
<ul>
<li><strong>Third-Party Embeds:</strong> Some embedded content may not be fully accessible.</li>
<li><strong>PDF Documents:</strong> Some downloadable documents may not be fully optimized for screen readers.</li>
<li><strong>Animations:</strong> Some scroll-triggered animations may present challenges for users with motion sensitivities. We respect the prefers-reduced-motion media query where technically feasible.</li>
<li><strong>Older Content:</strong> Some older content may not fully meet current accessibility standards.</li>
</ul>

<h2>4. Third-Party Content</h2>
<p>We select third-party tools with accessibility in mind but cannot guarantee all third-party content meets WCAG 2.1 AA standards.</p>

<h2>5. Feedback and Contact</h2>
<p>RSL/A — Accessibility Feedback: <a href="mailto:team@rsla.io">team@rsla.io</a></p>
<p>When reporting an accessibility issue, please include the URL, a description of the problem, and the assistive technology you are using.</p>

<h2>6. Continuous Improvement</h2>
<p>Accessibility is an ongoing effort. We regularly review our Site and update our practices as standards evolve.</p>

<h2>7. Conformance Status</h2>
<p>We aim to conform to WCAG 2.1 Level AA based on self-assessment, with plans for periodic third-party audits.</p>
<p>Last updated: February 2026</p>
</main>`,
  };
}

function bookCallContent() {
  return {
    title: 'Book a Call | RSL/A',
    description: 'Schedule a call with RSL/A. Existing clients can book onboarding, strategy, and support sessions.',
    canonical: `${SITE}/book-a-call`,
    noIndex: true,
    html: `<main>
<h1>Book your session.</h1>
<p>Pick a time. Onboarding, strategy check ins, and support calls all book here.</p>
<p>To schedule a call, please visit this page in a browser with JavaScript enabled, or contact us directly at <a href="mailto:hello@rsla.io">hello@rsla.io</a>.</p>
</main>`,
  };
}

function contactContent() {
  return {
    title: 'Book a free 30 minute call | RSL/A',
    description: "Book a free 30 minute call with RSL/A. Tell us what is not working and we will tell you what we would build first and what it would cost. No pitch.",
    canonical: `${SITE}/contact`,
    keywords: 'free consultation, marketing agency call, Bakersfield, automation, CRM, SEO, websites',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${SITE}/contact`,
      name: 'Contact RSL/A',
      url: `${SITE}/contact`,
      description: 'Book a free 30 minute call with RSL/A.',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#business` },
    },
    html: `<main>
<h1>Book a free 30 minute call.</h1>
<p>30 minutes. Tell us what is not working. We will tell you what we would build first, what it would cost, and whether it is worth it. No pitch.</p>
<p>To book, please visit this page in a browser with JavaScript enabled, or email us at <a href="mailto:hello@rsla.io">hello@rsla.io</a>.</p>
</main>`,
  };
}

// Service detail pages (5 service categories matching src/data/serviceData.js)
// ── Service and Bakersfield money pages (from src/data/servicePages.generated.json) ──


// Real images the React visuals render, so the static HTML carries them too. Alt text matches the components.
const PAGE_IMAGES = {
  '/services/websites': [
    { src: '/images/portfolio/fieldshare-after.jpg', alt: 'Fieldshare website homepage, a field management platform for oil and gas' },
    { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website homepage, a public relations agency' },
    { src: '/images/process/design.jpg', alt: 'Design: website layouts being sketched and reviewed on screen' },
    { src: '/images/process/launch.jpg', alt: 'Launch: the finished website open on a phone and a laptop' },
  ],
  '/services/websites/redesign': [
    { src: '/images/portfolio/fieldshare-before.jpg', alt: "Fieldshare's homepage before the redesign" },
    { src: '/images/portfolio/fieldshare-after.jpg', alt: "Fieldshare's homepage after the redesign" },
    { src: '/images/process/build.jpg', alt: 'Build: code for a client website open in an editor' },
  ],
  '/bakersfield': [
    { src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A' },
    { src: '/images/process/onboarding.jpg', alt: 'First call: a notebook and laptop on a desk during a client kickoff' },
  ],
  '/bakersfield/websites': [
    { src: '/images/portfolio/fieldshare-after.jpg', alt: 'Fieldshare website homepage, a field management platform for oil and gas' },
    { src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A' },
    { src: '/images/process/launch.jpg', alt: 'Launch: the finished website open on a phone and a laptop' },
  ],
  '/bakersfield/seo': [{ src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A' }],
  '/bakersfield/automations': [{ src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A' }],
  '/bakersfield/crm': [{ src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A' }],
};

function inlineToHtml(text) {
  const parts = [];
  let last = 0;
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    parts.push(esc(text.slice(last, m.index)));
    const [, label, href] = m;
    const external = /^https?:/.test(href);
    parts.push(`<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(label)}</a>`);
    last = m.index + m[0].length;
  }
  parts.push(esc(text.slice(last)));
  return parts.join('');
}

function relatedServicesHtml(links, intro) {
  if (!links || !links.length) return '';
  return `<aside aria-label="Related services"><p><strong>${esc(intro)}</strong></p><ul>${links.map(l => `<li><a href="${esc(l.to)}">${esc(l.label)}</a></li>`).join('')}</ul></aside>`;
}

function moneyPageContent(page) {
  const isLocal = Boolean(page.city);
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: page.h1, description: page.meta, url: page.canonical, provider: businessRef,
    areaServed: isLocal
      ? [{ '@type': 'City', name: 'Bakersfield', containedInPlace: { '@type': 'AdministrativeArea', name: 'Kern County, California' } }, ...KERN_TOWNS.slice(1).map(name => ({ '@type': 'City', name }))]
      : { '@type': 'Country', name: 'US' },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: page.breadcrumb.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
  };
  const faqSchema = generateFaqSchema(page.faqs);

  const crumbs = page.breadcrumb.map((c, i) => i === page.breadcrumb.length - 1
    ? `<span aria-current="page">${esc(c.name)}</span>`
    : `<a href="${esc(c.item.replace(SITE, '') || '/')}">${esc(c.name)}</a>`).join(' / ');
  const lead = page.lead ? esc(page.lead.text) : '';
  const ctaHtml = (label, lead) => `${lead ? `<p>${inlineToHtml(lead)}</p>` : ''}<p><a href="/contact">${esc(label)}</a> · <a href="${PHONE_TEL}">Call ${PHONE_DISPLAY}</a></p>`;
  const images = (PAGE_IMAGES[page.route] || []).map(i => `<figure><img src="${i.src}" alt="${esc(i.alt)}" loading="lazy" /></figure>`).join('');

  const sections = page.sections.map(sec => {
    const blocks = sec.blocks.map(b => {
      if (b.type === 'p' && b.title) return `<h3>${esc(b.title)}</h3><p>${inlineToHtml(b.text)}</p>`;
      if (b.type === 'p' && b.link) return `<p><a href="${esc(b.link.to)}">${esc(b.link.label)}</a>: ${inlineToHtml(b.text)}</p>`;
      if (b.type === 'p') return `<p>${inlineToHtml(b.text)}</p>`;
      if (b.type === 'ol') return `<ol>${b.items.map(it => `<li>${it.title ? `<strong>${esc(it.title)}</strong> ` : ''}${inlineToHtml(it.text)}</li>`).join('')}</ol>`;
      if (b.type === 'quote') return `<blockquote><p>${esc(b.text)}</p>${b.cite ? `<cite>${esc(b.cite)}</cite>` : ''}</blockquote>`;
      if (b.type === 'cta') return `<p><strong>${inlineToHtml(b.lead)}</strong> <a href="/contact">${esc(b.label)}</a></p>`;
      return '';
    }).join('\n');
    return `<section>${sec.heading ? `<h2>${esc(sec.heading)}</h2>` : ''}\n${blocks}</section>`;
  }).join('\n');

  const faqs = `<section><h2>${esc(page.faqHeading || 'Questions people ask')}</h2>${page.faqs.map(f => `<h3>${esc(f.q)}</h3><p>${inlineToHtml(f.a)}</p>`).join('')}</section>`;

  return {
    route: page.route,
    title: page.title,
    description: page.meta,
    canonical: page.canonical,
    jsonLd: [serviceSchema, breadcrumbSchema, faqSchema],
    html: `<main>
<nav aria-label="Breadcrumb">${crumbs}</nav>
<h1>${esc(page.h1)}</h1>
<p class="lead">${lead}</p>
${ctaHtml(page.heroCta.label, page.heroCta.lead)}
${images}
<ul class="proof">${page.proof.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
${sections}
${faqs}
<section><h2>${esc(page.finalCta.text)}</h2>${ctaHtml(page.finalCta.label, '')}</section>
</main>`,
  };
}

function bookingConfirmedContent() {
  return {
    title: 'Booking Confirmed | RSL/A',
    description: 'Your call has been booked. Check your inbox for meeting details.',
    canonical: `${SITE}/booking-confirmed`,
    noIndex: true,
    html: `<main>
<h1>You are all set.</h1>
<p>Your call has been booked.</p>
<p>Check your inbox for a calendar invite with the meeting details.</p>
<p><a href="/">Back to Home</a></p>
</main>`,
  };
}

function insiderContent() {
  return {
    title: 'The Insider: one thing every Tuesday | RSL/A',
    description: 'One thing a week, short enough to set up the same day: an automation, a Google Business Profile fix, a follow up sequence, a tool worth paying for.',
    canonical: `${SITE}/insider`,
    noIndex: true,
    html: `<main>
<h1>Every Tuesday, I send one thing you can use that day to make your business more money.</h1>
<p>One thing a week, short enough to set up the same day: an automation, a Google Business Profile fix, a follow up sequence, a tool worth paying for.</p>
<p>No spam, unsubscribe anytime. <a href="/privacy-policy">Privacy Policy</a></p>
<p>To subscribe, please visit this page in a browser or contact us at <a href="mailto:team@rsla.io">team@rsla.io</a>.</p>
</main>`,
  };
}

function rahulContent() {
  return {
    title: 'Rahul Lalia | RSL/A',
    description: 'Connect with Rahul Lalia, Founder & CEO of RSL/A.',
    canonical: `${SITE}/rahul`,
    noIndex: true,
    html: `<main>
<h1>Rahul Lalia</h1>
<p>Founder &amp; CEO, RSL/A</p>
<p>Puts AI to work for service businesses</p>
<ul>
<li><a href="/rahul.vcf">Save My Info (vCard)</a></li>
<li><a href="tel:+16466413173">Call: +1 (646) 641-3173</a></li>
<li><a href="mailto:lalia@rsla.io">Email: lalia@rsla.io</a></li>
<li><a href="https://rsla.io">Website: rsla.io</a></li>
</ul>
<h2>Social</h2>
<ul>
<li><a href="https://www.linkedin.com/in/rahullalia/">LinkedIn</a></li>
<li><a href="https://www.instagram.com/rahul.lalia/">Instagram</a></li>
<li><a href="https://www.tiktok.com/@rahul_lalia">TikTok</a></li>
<li><a href="https://www.youtube.com/@rahul_lalia">YouTube</a></li>
<li><a href="https://github.com/rahullalia">GitHub</a></li>
</ul>
</main>`,
  };
}

function sidContent() {
  return {
    title: 'Siddharth Rodrigues | RSL/A',
    description: 'Connect with Siddharth Rodrigues, Co-Founder & CTO of RSL/A.',
    canonical: `${SITE}/sid`,
    noIndex: true,
    html: `<main>
<h1>Siddharth Rodrigues</h1>
<p>Co-Founder &amp; CTO, RSL/A</p>
<p>Software Development &amp; AI Systems Expert</p>
<ul>
<li><a href="/sid.vcf">Save My Info (vCard)</a></li>
<li><a href="tel:+919356252711">Call: +91 93562 52711</a></li>
<li><a href="mailto:sid@rsla.io">Email: sid@rsla.io</a></li>
<li><a href="https://rsla.io">Website: rsla.io</a></li>
</ul>
<h2>Social</h2>
<ul>
<li><a href="https://www.linkedin.com/in/dorddis/">LinkedIn</a></li>
<li><a href="https://github.com/dorddis/">GitHub</a></li>
</ul>
</main>`,
  };
}

function notFoundContent() {
  return {
    title: 'Page Not Found | RSL/A',
    description: 'This page does not exist.',
    canonical: SITE,
    noIndex: true,
    html: `<main>
<h1>404</h1>
<h2>This page does not exist.</h2>
<p>Whatever you were looking for is not here. It may have moved, or it might never have existed. Let us get you somewhere useful.</p>
<ul>
<li><a href="/">Back to Home</a></li>
<li><a href="/work">Case Studies</a></li>
<li><a href="/blog">Blog</a></li>
</ul>
</main>`,
  };
}

// ── Dynamic Page Builders ─────────────────────────────────────────────────────

function blogListingContent(posts) {
  const postItems = posts.map(p => {
    const date = formatDate(p.publishedAt);
    const cats = (p.categories || []).map(c => c.name).join(', ');
    const excerpt = p.excerpt ? `<p>${esc(p.excerpt)}</p>` : '';
    return `<li><article><h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>${excerpt}<p>${date}${cats ? `, ${esc(cats)}` : ''}</p></article></li>`;
  }).join('\n');

  return {
    title: 'GoHighLevel, AI automation, and local SEO guides | RSL/A',
    description: 'Guides on GoHighLevel, Claude, automation, and local SEO, written from the work we do for clients: what we set up, what it cost, and what moved.',
    canonical: `${SITE}/blog`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Blog', url: `${SITE}/blog`,
      isPartOf: websiteRef,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/blog/${p.slug}`,
          name: p.title,
        })),
      },
    },
    html: `<main>
<h1>Our blog.</h1>
<p>Guides on GoHighLevel, Claude, automation, and local SEO, from the work we do for clients.</p>
<ul>${postItems}</ul>
</main>`,
  };
}

function workListingContent(caseStudies) {
  const featured = caseStudies.filter(cs => cs.featured);
  const rest = caseStudies.filter(cs => !cs.featured);

  function renderCsList(list) {
    return list.map(cs => {
      const metrics = (cs.metrics || []).slice(0, 3).map(m => `${esc(m.value)} ${esc(m.label)}`).join(' | ');
      return `<li><article><h3><a href="/work/${esc(cs.slug)}">${esc(cs.title)}</a></h3>${cs.tag ? `<p>${esc(cs.tag)}</p>` : ''}${cs.description ? `<p>${esc(cs.description)}</p>` : ''}${metrics ? `<p>${metrics}</p>` : ''}</article></li>`;
    }).join('\n');
  }

  return {
    title: 'Case studies: websites, SEO, automation, and CRM | RSL/A',
    description: 'Five case studies with the numbers: two salon suites filled from $600 in ads, a blank domain to 204 keywords in 6 months, a rebuild now cited by ChatGPT.',
    canonical: `${SITE}/work`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Case Studies', url: `${SITE}/work`,
      isPartOf: websiteRef,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: caseStudies.map((cs, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/work/${cs.slug}`,
          name: cs.title,
        })),
      },
    },
    html: `<main>
<h1>Our work.</h1>
<p>Each one has the numbers in it, including what did not work.</p>
${featured.length ? `<section><h2>Featured Case Studies</h2><ul>${renderCsList(featured)}</ul></section>` : ''}
${rest.length ? `<section><h2>All Case Studies</h2><ul>${renderCsList(rest)}</ul></section>` : ''}
</main>`,
  };
}

function blogPostContent(post) {
  const title = post.seo?.metaTitle ? `${post.seo.metaTitle} | RSL/A` : `${post.title} | RSL/A`;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const canonical = `${SITE}/blog/${post.slug}`;
  const ogImage = post.seo?.socialImage?.asset?.url || post.featuredImage?.asset?.url || null;
  const dateModified = post.updatedAt || post.updatedAtFallback || null;

  const wordCount = (post.body || []).reduce((count, block) => {
    if (block._type === 'block') {
      return count + (block.children || []).reduce((c, child) => c + (child.text || '').split(/\s+/).filter(Boolean).length, 0);
    }
    return count;
  }, 0);

  const firstCategoryName = (post.categories || [])[0]?.name || null;

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: post.seo?.metaTitle || post.title,
      description,
      datePublished: post.publishedAt,
      ...(dateModified && { dateModified }),
      ...(wordCount > 0 && { wordCount }),
      ...(ogImage && { image: ogImage }),
      ...(post.seo?.targetKeyphrase && { keywords: post.seo.targetKeyphrase }),
      ...(firstCategoryName && { articleSection: firstCategoryName }),
      author: post.author?.name && post.author.name !== 'Rahul Lalia'
        ? { '@type': 'Person', name: post.author.name, ...(post.author.role && { jobTitle: post.author.role }), ...(post.author.linkedin && { sameAs: post.author.linkedin }) }
        : founderRef,
      publisher: businessRef,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog`, name: 'RSL/A Blog' },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.tldr', '.key-takeaways'] },
      ...(post.relatedCapability && {
        mentions: {
          '@type': 'Service',
          name: post.relatedCapability.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          url: `${SITE}${serviceUrlFromCapability(post.relatedCapability)}`,
        },
      }),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 2, name: post.title },
      ],
    },
  ];

  if (post.faqSchema?.length) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: post.faqSchema.map(f => ({
        '@type': 'Question', name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  if (post.steps?.length) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: post.title,
      description,
      step: post.steps.map((s, i) => ({
        '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text,
      })),
    });
  }

  const bodyHtml = ptToHtml(post.body);
  const date = formatDate(post.publishedAt);
  const firstCat = (post.categories || [])[0];

  const keyTakeawaysHtml = post.keyTakeaways?.length
    ? `<section class="key-takeaways" aria-label="Key takeaways"><h2>Key Takeaways</h2><ul>${post.keyTakeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>`
    : '';

  const bottomLineHtml = post.bottomLine
    ? `<section class="bottom-line" aria-label="The bottom line"><h2>The Bottom Line</h2><p>${esc(post.bottomLine)}</p></section>`
    : '';

  return {
    route: `/blog/${post.slug}`,
    title,
    description,
    canonical,
    ogImage,
    jsonLd,
    html: `<main><article>
<nav aria-label="Breadcrumb"><a href="/blog">Blog</a>${firstCat ? ` / ${esc(firstCat.name)}` : ''}</nav>
<header>
<h1>${esc(post.title)}</h1>
<p><time datetime="${post.publishedAt}">${date}</time>${post.author?.name ? ` — By ${esc(post.author.name)}` : ''}</p>
${post.pullQuote ? `<p class="tldr"><strong>TL;DR:</strong> ${esc(post.pullQuote)}</p>` : ''}
</header>
${keyTakeawaysHtml}
${bodyHtml}
${bottomLineHtml}
${relatedServicesHtml(blogServiceLinks[post.slug], 'If this is the problem you are solving, we do the work:')}
</article></main>`,
  };
}

function caseStudyContent(cs) {
  const title = cs.seo?.metaTitle ? `${cs.seo.metaTitle} | RSL/A` : `${cs.title} | RSL/A`;
  const description = cs.seo?.metaDescription || cs.tldr || cs.description || '';
  const canonical = `${SITE}/work/${cs.slug}`;
  const ogImage = cs.seo?.socialImage?.asset?.url || cs.featuredImage?.asset?.url || null;

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: cs.title,
      description,
      datePublished: cs.publishedAt,
      ...(cs.updatedAt && { dateModified: cs.updatedAt }),
      ...(ogImage && { image: ogImage }),
      author: founderRef,
      publisher: businessRef,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Case Studies', item: `${SITE}/work` },
        { '@type': 'ListItem', position: 2, name: cs.title },
      ],
    },
  ];

  const bodyHtml = ptToHtml(cs.content);

  const metricsHtml = (cs.metrics || []).map(m =>
    `<li><strong>${esc(m.value)}</strong> ${esc(m.label)}</li>`
  ).join('');

  const takeawaysHtml = (cs.keyTakeaways || []).map((t, i) =>
    `<li>${esc(t)}</li>`
  ).join('');

  return {
    route: `/work/${cs.slug}`,
    title,
    description,
    canonical,
    ogImage,
    jsonLd,
    html: `<main><article>
<h1>${esc(cs.title)}</h1>
${cs.tag ? `<p>${esc(cs.tag)}</p>` : ''}
${cs.description ? `<p><em>${esc(cs.description)}</em></p>` : ''}
${metricsHtml ? `<section><h2>Key Metrics</h2><ul>${metricsHtml}</ul></section>` : ''}
${cs.tldr ? `<section><h2>TL;DR</h2><p>${esc(cs.tldr)}</p></section>` : ''}
${cs.problemStatement ? `<section><h2>The Problem</h2><p>${esc(cs.problemStatement)}</p></section>` : ''}
${cs.solutionApproach ? `<section><h2>The Solution</h2><p>${esc(cs.solutionApproach)}</p></section>` : ''}
${cs.resultsOutcome ? `<section><h2>The Results</h2><p>${esc(cs.resultsOutcome)}</p></section>` : ''}
${bodyHtml}
${takeawaysHtml ? `<section><h2>Key Takeaways</h2><ol>${takeawaysHtml}</ol></section>` : ''}
${relatedServicesHtml(caseStudyServiceLinks[cs.slug], 'The services behind this result:')}
</article></main>`,
  };
}

function leadMagnetContent(lm) {
  const title = lm.seoTitle || `${lm.title} | RSL/A`;
  const description = lm.seoDescription || lm.description || '';
  const benefitsHtml = (lm.benefits || []).map(b => `<li>${esc(b)}</li>`).join('\n');

  return {
    route: `/r/${lm.slug}`,
    title,
    description,
    canonical: `${SITE}/r/${lm.slug}`,
    noIndex: true,
    html: `<main>
<h1>${esc(lm.title)}</h1>
${lm.tagline ? `<p>${esc(lm.tagline)}</p>` : ''}
${lm.description ? `<p>${esc(lm.description)}</p>` : ''}
${benefitsHtml ? `<ul>${benefitsHtml}</ul>` : ''}
<p>Enter your name and email to get instant access.</p>
</main>`,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Pre-rendering pages...');

  const template = readFileSync(resolve(DIST, 'index.html'), 'utf-8');

  // Fetch all dynamic content from Sanity
  const [blogPosts, caseStudies, leadMagnets] = await Promise.all([
    client.fetch(`
      *[_type == "blogPostV2" && status == "published" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        excerpt,
        pullQuote,
        keyTakeaways,
        bottomLine,
        publishedAt,
        updatedAt,
        "updatedAtFallback": _updatedAt,
        body,
        featuredImage { asset-> },
        author->{ name, role, linkedin },
        categories[]->{ name, "slug": slug.current },
        seo { metaTitle, metaDescription, keywords, targetKeyphrase, socialImage { asset-> } },
        faqSchema,
        steps,
        relatedCapability
      }
    `),
    client.fetch(`
      *[_type == "caseStudyV2" && status == "published" && defined(slug.current)] | order(priority asc) {
        title,
        "slug": slug.current,
        tag,
        description,
        metrics,
        featured,
        category,
        content,
        tldr,
        problemStatement,
        solutionApproach,
        resultsOutcome,
        keyTakeaways,
        industry,
        timeframe,
        servicesUsed,
        publishedAt,
        "updatedAt": _updatedAt,
        featuredImage { asset-> },
        seo { metaTitle, metaDescription, keywords, socialImage { asset-> } },
        faqSchema
      }
    `),
    client.fetch(`
      *[_type == "leadMagnet" && status == "published" && defined(slug.current)] {
        title,
        "slug": slug.current,
        description,
        tagline,
        benefits,
        seoTitle,
        seoDescription
      }
    `),
  ]);

  let count = 0;

  // Static pages
  const staticPages = [
    { route: '/', ...homeContent() },
    { route: '/about', ...aboutContent() },
    { route: '/services', ...servicesContent() },
    { route: '/contact', ...contactContent() },
    { route: '/privacy-policy', ...privacyContent() },
    { route: '/terms', ...termsContent() },
    { route: '/disclaimer', ...disclaimerContent() },
    { route: '/accessibility', ...accessibilityContent() },
    { route: '/book-a-call', ...bookCallContent() },
    { route: '/booking-confirmed', ...bookingConfirmedContent() },
    { route: '/insider', ...insiderContent() },
    { route: '/rahul', ...rahulContent() },
    { route: '/sid', ...sidContent() },
    { route: '/404', ...notFoundContent() },
  ];

  for (const page of staticPages) {
    writePage(page.route, inject(template, page));
    count++;
  }

  // 404.html at dist root for Vercel's catch-all rewrite and native 404 handling
  writeFileSync(resolve(DIST, '404.html'), inject(template, notFoundContent()), 'utf-8');

  // Service pages and Bakersfield pages, rendered from the copy set
  for (const page of servicePages) {
    writePage(page.route, inject(template, moneyPageContent(page)));
    count++;
  }

  // Blog listing
  writePage('/blog', inject(template, blogListingContent(blogPosts)));
  count++;

  // Work listing
  writePage('/work', inject(template, workListingContent(caseStudies)));
  count++;

  // Individual blog posts
  for (const post of blogPosts) {
    const page = blogPostContent(post);
    writePage(page.route, inject(template, page));
    count++;
  }

  // Individual case studies
  for (const cs of caseStudies) {
    const page = caseStudyContent(cs);
    writePage(page.route, inject(template, page));
    count++;
  }

  // Lead magnet pages
  for (const lm of leadMagnets) {
    const page = leadMagnetContent(lm);
    writePage(page.route, inject(template, page));
    count++;
  }

  console.log(`Pre-rendered ${count} pages (${staticPages.length} static, ${servicePages.length} service and Bakersfield pages, 2 listings, ${blogPosts.length} blog posts, ${caseStudies.length} case studies, ${leadMagnets.length} lead magnets)`);
}

main().catch((err) => {
  console.error('ERROR: Pre-render FAILED:', err.message || err);
  console.error('Site will work as a normal SPA but has NO pre-rendered HTML for SEO.');
  process.exitCode = 1;
});
