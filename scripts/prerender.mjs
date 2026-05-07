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
import { portableTextToMarkdown } from '../api/lib/portableTextToMarkdown.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const SITE = 'https://rsla.io';

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

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
<li><a href="/services">Services</a></li>
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

  p = p.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`);
  p = p.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(description)}" />`
  );

  if (keywords) {
    if (p.includes('<meta name="keywords"')) {
      p = p.replace(/<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${esc(keywords)}" />`);
    } else {
      p = p.replace('</head>', `<meta name="keywords" content="${esc(keywords)}" />\n</head>`);
    }
  }

  p = p.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  p = p.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`);
  p = p.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(canonical)}" />`);

  if (ogImage) {
    p = p.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(ogImage)}" />`);
    p = p.replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${esc(ogImage)}" />`);
  }

  p = p.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  p = p.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);

  p = p.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${esc(canonical)}" />`);

  // Robots meta — emit noindex for pages flagged noIndex, remove any existing robots meta otherwise
  if (noIndex) {
    if (p.match(/<meta name="robots"[^>]*\/>/)) {
      p = p.replace(/<meta name="robots"[^>]*\/>/, `<meta name="robots" content="noindex, follow" />`);
    } else {
      p = p.replace('</head>', `<meta name="robots" content="noindex, follow" />\n</head>`);
    }
  } else {
    p = p.replace(/<meta name="robots"[^>]*\/>\s*/g, '');
  }

  if (jsonLd) {
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const scripts = schemas.map(s => `<script type="application/ld+json" data-seo-jsonld>${escapeJsonLd(s)}</script>`).join('\n');
    p = p.replace('</head>', `${scripts}\n</head>`);
  }

  p = p.replace('<div id="root"></div>', `<div id="root"><div id="prerender">${siteNav}${html}</div></div>`);

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
  return marked.parse(md);
}

// ── Static Pages ──────────────────────────────────────────────────────────────

function homeContent() {
  return {
    title: 'RSL/A | The trusted AI growth partner for B2B companies',
    description: "We build your website, get it found on Google and ChatGPT, and automate what's slowing you down. Custom websites and AI systems for fast-moving B2B companies.",
    canonical: SITE,
    keywords: 'AI growth partner, custom B2B website, AI website agency, SEO for B2B, AI automation, ChatGPT visibility',
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'Organization',
        name: 'RSL/A', alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
        url: SITE, logo: `${SITE}/images/logo/lockup-nobg.webp`,
        description: "The trusted AI growth partner for fast-moving B2B companies. We build your website, get it found on Google and ChatGPT, and automate what's slowing you down.",
        founder: { '@type': 'Person', name: 'Rahul Lalia', jobTitle: 'Founder & CEO' },
        sameAs: [
          'https://www.instagram.com/rahul.lalia/',
          'https://www.linkedin.com/in/rahullalia/',
          'https://www.youtube.com/@rahul_lalia',
          'https://www.tiktok.com/@rahul_lalia',
          'https://x.com/rahul_lalia',
        ],
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'RSL/A', alternateName: ['RSLA', 'RSL/A', 'RSL A'], url: SITE },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What types of businesses do you work with?', acceptedAnswer: { '@type': 'Answer', text: 'We work with B2B companies and service businesses doing $500K+ in revenue who want to systematize their marketing and operations with AI. If you rely on leads, appointments, or repeat customers to grow, we can help.' } },
          { '@type': 'Question', name: 'How long does it take to see results?', acceptedAnswer: { '@type': 'Answer', text: 'Most clients see measurable results within 30 to 60 days. Websites launch in 2 to 4 weeks. Search visibility campaigns start generating impressions within the first month. AI automation systems go live in 2 to 3 weeks.' } },
          { '@type': 'Question', name: 'Do you lock clients into long-term contracts?', acceptedAnswer: { '@type': 'Answer', text: 'No. We work on a month-to-month basis after the initial build. We believe in earning your business every month. If we are not delivering, you should not be stuck.' } },
          { '@type': 'Question', name: 'What platforms and tools do you use?', acceptedAnswer: { '@type': 'Answer', text: 'We build custom websites on React and Next.js, use GoHighLevel for CRM and automation, n8n and Make for workflow automation, and Claude and GPT for AI systems. We pick the right tool for each job.' } },
          { '@type': 'Question', name: 'How is RSL/A different from other agencies?', acceptedAnswer: { '@type': 'Answer', text: 'We build the entire system, not just one piece. Website, search visibility, AI automations, CRM, and reporting, all connected. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.' } },
        ],
      },
    ],
    html: `<main>
<h1>The trusted AI growth partner for fast-moving B2B companies.</h1>
<p><a href="/contact">Book a Free Call</a> | <a href="/work">See Our Work</a></p>

<section><h2>What We Build</h2>
<article><h3>Websites</h3>
<p>New builds and full rebuilds. Fast, custom-designed, SEO-ready websites built on React and Next.js.</p></article>
<article><h3>Search Visibility</h3>
<p>Rankings on Google, ChatGPT, Perplexity, and Claude. SEO, AEO, and content systems that compound over time.</p></article>
<article><h3>AI Automations</h3>
<p>n8n, Make, and custom AI agents that replace manual work. Lead follow-up, proposals, content, and reporting on autopilot.</p></article>
<article><h3>CRM Systems</h3>
<p>GoHighLevel pipelines, workflows, and integrations. One system managing leads, bookings, and communication.</p></article>
<article><h3>Custom Development</h3>
<p>SaaS products, MVPs, internal tools, and APIs. Full-stack builds from prototype to production.</p></article>
</section>

<section><h2>By the Numbers</h2>
<ul><li>40+ clients served</li><li>$2.1M+ revenue generated</li><li>11 case studies</li><li>98% client retention</li></ul>
</section>

<section><h2>What Clients Say</h2>
<blockquote><p>I recently hired Rahul to revamp our company website, and I couldn't be more thrilled with the results! Their expertise and dedication transformed my site by restructuring it, fixing critical errors, and significantly boosting its performance. Thanks to their outstanding work on on-page SEO and ongoing SEO efforts, my website has seen a remarkable increase in organic traffic and a substantial improvement in qualified inbound lead generation.</p><cite>Sid S., Account Executive, SBC</cite></blockquote>
<blockquote><p>Working with Rahul on my GoHighLevel setup was an excellent experience. He was extremely knowledgeable, responsive, and efficient from start to finish. Rahul quickly understood what I needed and structured my GHL account properly. Pipelines, automations, workflows, integrations, and overall system flow.</p><cite>Curtis H., CEO/Founder, AdReviveAI</cite></blockquote>
<blockquote><p>Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule. Highly recommend.</p><cite>Chris K., CEO/Co-Founder, Fieldshare</cite></blockquote>
<blockquote><p>I tried for months to rent my salon space and nothing worked. After Rahul and RSL/A, in just a few months both my rooms were filled. Now I don't stress about rent anymore.</p><cite>Laiz C., CEO, Casagrande Salon</cite></blockquote>
<blockquote><p>Rahul does a stellar job on setting up GHL accounts. He is an expert and gave me immense knowledge about the platform. Would love to work with him again. Highly recommend anyone who wants an expert on Go High Level.</p><cite>Parminder S., CEO/Founder, Chauffeur on Demand</cite></blockquote>
</section>

<section><h2>About the Founder</h2>
<p>I have spent the better part of five years in the trenches of marketing, automation, and business infrastructure. Started in analytics. Got laid off. Built an agency from nothing. And along the way, I watched founders with real talent suffocate under work that never should have touched their hands.</p>
<p>That became the only question worth answering: how do you build systems that actually run a business, not just look good in a demo?</p>
<p>I put everything out there. The strategies, the tools, the exact workflows. You can learn all of it from my content. But knowing how it works and actually building it so it holds under pressure and scales without breaking? That demands precision. That is what RSL/A exists to do.</p>
<p>— Rahul Lalia, Founder, RSL/A</p>
</section>

<section><h2>Frequently Asked Questions</h2>
<dl>
<dt>What types of businesses do you work with?</dt><dd>We work with B2B companies and service businesses doing $500K+ in revenue who want to systematize their marketing and operations with AI. If you rely on leads, appointments, or repeat customers to grow, we can help.</dd>
<dt>How long does it take to see results?</dt><dd>Most clients see measurable results within 30 to 60 days. Websites launch in 2 to 4 weeks. Search visibility campaigns start generating impressions within the first month. AI automation systems go live in 2 to 3 weeks.</dd>
<dt>Do you lock clients into long-term contracts?</dt><dd>No. We work on a month-to-month basis after the initial build. We believe in earning your business every month. If we are not delivering, you should not be stuck.</dd>
<dt>What platforms and tools do you use?</dt><dd>We build custom websites on React and Next.js, use GoHighLevel for CRM and automation, n8n and Make for workflow automation, and Claude and GPT for AI systems. We pick the right tool for each job.</dd>
<dt>How is RSL/A different from other agencies?</dt><dd>We build the entire system, not just one piece. Website, search visibility, AI automations, CRM, and reporting, all connected. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.</dd>
<dt>Do you offer white-label services for other agencies?</dt><dd>Yes. We partner with agencies who need AI automation, CRM buildouts, or technical infrastructure they cannot build in-house. Reach out and we can discuss your setup.</dd>
<dt>What does the onboarding process look like?</dt><dd>It starts with a strategy call where we audit your current setup. Then we deliver a custom roadmap within 48 hours. Once approved, we start building. Most clients are fully live within 2 to 4 weeks.</dd>
</dl>
</section>

<section><h2>Ready to put AI to work?</h2>
<p><a href="/#contact">Let's Talk</a></p>
</section>
</main>`,
  };
}

function aboutContent() {
  return {
    title: 'About Rahul Lalia & RSL/A | AI Growth Agency',
    description: 'Meet Rahul Lalia, founder of RSL/A. Five years in marketing, automation, and business infrastructure, building systems that actually run businesses.',
    canonical: `${SITE}/about`,
    keywords: 'Rahul Lalia, RSL/A founder, AI automation expert, marketing automation consultant, business systems builder',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Person',
      name: 'Rahul Lalia', jobTitle: 'Founder & CEO',
      url: `${SITE}/about`, image: `${SITE}/images/rahul.webp`,
      description: 'Founder of RSL/A. Builds AI growth systems for B2B companies. Five years in marketing, automation, and business infrastructure.',
      worksFor: { '@type': 'Organization', name: 'RSL/A', url: SITE },
      sameAs: [
        'https://www.linkedin.com/in/rahullalia/',
        'https://www.instagram.com/rahul.lalia/',
        'https://www.youtube.com/@rahul_lalia',
        'https://www.tiktok.com/@rahul_lalia',
        'https://github.com/rahullalia',
      ],
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
<p>So I started asking a different question. What if AI could handle all the stuff that founders should not be doing manually? Not theoretical AI. Not "we will build you a chatbot" AI. Practical, measured, actually-useful-for-your-business AI. That became the whole thing.</p>
</section>

<section><h2>What I actually do</h2>
<p>I show founders how to put AI to work in their business. Then I build it for them.</p>
<p>The teaching part is free. I post the workflows, the tools, the exact systems. No gatekeeping. If you can build it yourself after watching my content, I genuinely want that for you.</p>
<p>But here is the thing. There is a difference between knowing what to build and building it right. A system that works for 10 leads breaks at 500. An AI bot that sounds great in a demo falls apart with real customers. The gap between a prototype and a production system is where most founders get stuck. That is where RSL/A comes in. My team and I are the ones who build the production version. The one that actually scales, actually handles edge cases, and actually shows you the numbers so you know it is working.</p>
</section>

<section><h2>Why I am different</h2>
<p>I came from analytics. That matters.</p>
<p>Most people in this space show you a demo and call it done. I show you a dashboard. Real numbers. What the AI system did this week, how many leads it handled, how many meetings it booked, what the conversion rate was. Because if you cannot measure it, it is just a toy. And founders do not need toys. They need infrastructure.</p>
</section>

<p><a href="/work">See what we have built</a></p>

<section><h2>Words I Like</h2>
<blockquote><p>What a privilege to be tired from work you once begged the universe for. What a privilege to feel overwhelmed by growth you used to dream about. What a privilege to be challenged by a life you created on purpose. What a privilege to outgrow things you used to settle for.</p><cite>Aryan Sachdeva, via Medium</cite></blockquote>
</section>
</main>`,
  };
}

function servicesContent() {
  return {
    title: 'Local SEO Services & AI Marketing for Small Business | RSL/A',
    description: 'Local SEO services, custom web design, AI automation, and CRM systems for small businesses. End-to-end systems that get you found and keep you growing.',
    canonical: `${SITE}/services`,
    keywords: 'local seo services, local seo for small business, web design agency, AI automation, CRM setup, marketing agency, local seo packages',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'ProfessionalService',
      name: 'RSL/A', url: `${SITE}/services`,
      description: 'End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that has done it across SMBs and enterprise.',
      provider: { '@type': 'Organization', name: 'RSL/A', url: SITE },
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'AI Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Websites', description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Search Visibility', description: 'Rankings on Google, ChatGPT, Perplexity, and Claude.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automations', description: 'n8n, Make, and custom scripts that replace manual work.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CRM Systems', description: 'GoHighLevel pipelines, workflows, and integrations.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Development', description: 'SaaS products, MVPs, internal tools, APIs.' } },
        ],
      },
    },
    html: `<main>
<h1>What we build for B2B companies.</h1>
<p>We do not do "marketing." We build AI infrastructure for founders. Here is what that actually means.</p>

<section id="lead-generation"><h2>Lead Gen: Stop paying for clicks. Start paying for customers.</h2>
<h3>The Problem</h3>
<p>Most founders either boost posts and hope for the best, or they hire an agency that shows them impressions and reach numbers. Neither gets you customers.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Targeting that learns:</strong> Your campaigns learn which audiences convert and shift budget toward them automatically. No manual bid adjustments.</li>
<li><strong>Creative testing at scale:</strong> We test dozens of ad variations simultaneously. AI identifies the winners and kills the losers before they waste your money.</li>
<li><strong>Pipeline integration:</strong> Every qualified lead flows directly into your CRM. Tagged, scored, and ready for follow-up. No spreadsheets, no manual entry.</li>
<li><strong>Real-time dashboards:</strong> You see exactly what your ad spend is producing. Not vanity metrics. Revenue metrics.</li>
</ul>
<p><em>$600 in ad spend turned into $36,000 in closed revenue in 45 days. That is a 60x return. Not because of magic creative. Because the AI system optimized faster than any human could.</em></p>
</section>

<section id="automations"><h2>Zero Manual Work: Your business should not stop working when you do.</h2>
<h3>The Problem</h3>
<p>A lead messages you at 11 PM. You see it at 8 AM. By then they have already talked to two of your competitors. You lost the deal because you were sleeping. That is not a business problem. That is an infrastructure problem.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Conversational bots:</strong> Not the robotic "please select an option" kind. Actual AI that understands context, qualifies leads, answers questions, and books meetings. At 2 AM. At 2 PM. Whenever.</li>
<li><strong>Workflow automations:</strong> Lead comes in, gets tagged, gets the right follow-up sequence, gets routed to the right person. Automatically. You do not touch it.</li>
<li><strong>Customer service AI:</strong> Handle the 80% of customer questions that are the same thing asked slightly differently. Your team focuses on the 20% that actually need a human.</li>
<li><strong>Database reactivation:</strong> Got a list of cold contacts collecting dust? AI wakes them up. Personalized outreach at scale, not mass blasts.</li>
</ul>
<p><em>We built an AI chat system for an e-commerce brand that cut manual customer service hours by 80%. And the customers rated the experience higher than when humans were handling it.</em></p>
</section>

<section id="operations"><h2>Operations: Stop managing tools. Let AI manage your business.</h2>
<h3>The Problem</h3>
<p>You are paying for Calendly. And Mailchimp. And some CRM you barely use. And a website builder. And a texting platform. And maybe two more things you forgot about. None of them talk to each other. You are the integration layer. That is expensive. Not just the subscriptions. Your time.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Unified pipeline:</strong> Every lead, every deal, every customer in one place. AI tells you what needs attention today, not a spreadsheet you forgot to update.</li>
<li><strong>Intelligent follow ups:</strong> The system knows when someone has not responded and sends the right nudge at the right time. Not a generic "just checking in" email. Something contextual.</li>
<li><strong>Automated reporting:</strong> Stop building reports manually. Your dashboard updates in real time. Revenue, pipeline, conversion rates. All of it.</li>
<li><strong>Calendar and booking integration:</strong> One link, one system, no double bookings, no "let me check my availability" back and forth.</li>
</ul>
<p><em>We reactivated a dead database of 13,000 cold contacts and booked 42 qualified appointments in one week. Not by emailing everyone the same thing. By using AI to personalize outreach based on what we knew about each contact.</em></p>
</section>

<section id="digital-presence"><h2>Digital Presence: Your website should work as hard as you do.</h2>
<h3>The Problem</h3>
<p>You have a website. It looks okay. But it is basically a digital business card that does not do anything. No one finds it on Google. The few people who do visit do not convert. And you have no idea why because there is no data.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Conversion-focused design:</strong> Every page built around one goal: getting the visitor to take the next step. Tested layouts and copy that improve over time.</li>
<li><strong>SEO infrastructure:</strong> Content strategy informed by AI research. We target the searches your ideal clients are actually making, not vanity keywords.</li>
<li><strong>Performance tracking:</strong> You know exactly where visitors come from, what they do, and why they leave. No guessing.</li>
<li><strong>Content engine:</strong> AI-assisted content creation for blogs, case studies, and landing pages that drive organic traffic consistently.</li>
</ul>
</section>

<section><h2>Local Services</h2>
<ul><li><a href="/services/bakersfield">Bakersfield, CA</a></li></ul>
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
<p>Pick a time that works for you. Whether it is onboarding, a strategy check-in, or a support call, we will make sure you are covered.</p>
<p>To schedule a call, please visit this page in a browser with JavaScript enabled, or contact us directly at <a href="mailto:hello@rsla.io">hello@rsla.io</a>.</p>
</main>`,
  };
}

function contactContent() {
  return {
    title: 'Book a free growth mapping call | RSL/A',
    description: "Book a free 30-minute growth mapping call. We'll audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle. No pitch, just answers.",
    canonical: `${SITE}/contact`,
    keywords: 'AI strategy call, growth mapping call, AI consultation, marketing audit, automation consultation, free strategy session',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact RSL/A',
      url: `${SITE}/contact`,
      description: 'Book a free 30-minute growth mapping call with RSL/A.',
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
    },
    html: `<main>
<h1>Book a free growth mapping call.</h1>
<p>30 minutes. We audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle. No pitch, just answers.</p>
<p>To book, please visit this page in a browser with JavaScript enabled, or email us at <a href="mailto:hello@rsla.io">hello@rsla.io</a>.</p>
</main>`,
  };
}

// Service detail pages (5 service categories matching src/data/serviceData.js)
const SERVICE_DETAILS = {
  'web-design': {
    title: 'Web Design',
    headline: 'Websites That Win Business',
    description: 'Custom B2B web design and website redesign services. React and Next.js builds that convert visitors into leads. Get a website that works as hard as you do.',
    metaTitle: 'Custom Web Design Agency | RSL/A',
    metaDescription: 'Custom B2B web design and website redesign services. React and Next.js builds that convert visitors into leads. Get a website that works as hard as you do.',
    keywords: 'custom web design, B2B website design, website redesign, React website, Next.js website, conversion-focused design',
    features: [
      'Custom React and Next.js builds from scratch',
      'Conversion copy and Figma design included',
      'Mobile-first, performance-optimized, SEO-ready',
      'Headless CMS integration (Sanity, Contentful)',
      'Full redesigns that identify and fix conversion blockers',
    ],
    caseStudies: [
      { href: '/work/fieldshare-seo-website-rebrand', title: 'FieldShare SEO and Website Rebrand', metric: '3x organic traffic in 90 days' },
      { href: '/work/adreviveai-saas-build', title: 'AdRevive AI SaaS Build', metric: '0 to production in 6 weeks' },
    ],
    faqs: [
      { q: 'What platforms do you build on?', a: 'We build primarily in React and Next.js. Most client sites ship on Vercel with a Sanity or headless CMS backend. If you have an existing stack we can work within it.' },
      { q: 'How long does a website project take?', a: 'A standard marketing site takes 4 to 6 weeks from kickoff to launch. Larger builds with custom functionality run 8 to 12 weeks. We give you a firm timeline before we start.' },
      { q: 'Do you handle copywriting and design too?', a: 'Yes. We write conversion copy, design in Figma, and hand off a production-ready site. You don\'t need a separate designer or copywriter.' },
      { q: 'What if I already have a site and just want a redesign?', a: 'Redesigns are a big part of what we do. We audit your current site, identify what\'s hurting conversions, and rebuild from there. Sometimes that\'s a full rebuild; sometimes it\'s targeted changes to key pages.' },
    ],
  },
  'seo': {
    title: 'SEO',
    headline: 'Get Found. Get Chosen.',
    description: 'Local SEO services and answer engine optimization for small businesses. We rank you in search and AI answers so the right customers find you first.',
    metaTitle: 'Local SEO Services for Small Business | RSL/A',
    metaDescription: 'Local SEO services and answer engine optimization for small businesses. We rank you in search and AI answers so the right customers find you first.',
    keywords: 'local seo services, local seo for small business, answer engine optimization, technical seo, google business profile, AEO',
    features: [
      'Local SEO and Google Business Profile optimization',
      'Answer engine optimization (AEO) for ChatGPT, Perplexity, and Google AI Overviews',
      'Technical SEO audit: Core Web Vitals, crawlability, schema markup',
      'Content strategy targeting searches your buyers actually make',
      'Citation building and review strategy',
    ],
    caseStudies: [
      { href: '/work/seo-content-marketing-automation', title: 'SEO and Content Marketing Automation', metric: '220% increase in organic sessions' },
      { href: '/work/local-seo-reputation-management', title: 'Local SEO and Reputation Management', metric: 'Top 3 map pack in 60 days' },
      { href: '/work/fieldshare-seo-website-rebrand', title: 'FieldShare SEO and Website Rebrand', metric: '3x organic traffic in 90 days' },
    ],
    faqs: [
      { q: 'What is answer engine optimization and why does it matter?', a: 'AEO is the practice of structuring your content so AI tools like ChatGPT, Perplexity, and Google\'s AI Overviews cite you as a source. As more searches end without a click, showing up in AI answers is how you stay visible. We optimize both traditional search and AI-generated answers.' },
      { q: 'How quickly will I see results from local SEO?', a: 'Most clients see measurable movement in Google Business Profile rankings within 30 to 60 days. Organic keyword rankings typically move at 90 to 180 days depending on how competitive your market is.' },
      { q: 'Do you handle Google Business Profile?', a: 'Yes. GBP optimization is a core part of local SEO. We handle the full setup or audit, category selection, citation building, review strategy, and ongoing posting.' },
      { q: 'What does technical SEO cover?', a: 'Core Web Vitals, crawlability, indexing, schema markup, site speed, internal linking, and fixing anything that\'s telling Google to look elsewhere. We run a full audit at the start of every engagement.' },
    ],
  },
  'ai-automations': {
    title: 'AI Automations',
    headline: 'Automate the Work. Keep the Margin.',
    description: 'AI automation agency specializing in n8n, Make, and custom AI agents. Automate lead response, onboarding, ops, and marketing workflows without adding staff.',
    metaTitle: 'AI Automation Agency | n8n and Make Workflows | RSL/A',
    metaDescription: 'AI automation agency specializing in n8n, Make, and custom AI agents. Automate lead response, onboarding, ops, and marketing workflows without adding staff.',
    keywords: 'AI automation agency, workflow automation, n8n automation, Make automation, AI agents, business process automation',
    features: [
      'n8n and Make (Integromat) workflow automation',
      'Custom AI agents for lead qualification and response',
      'Sales, onboarding, ops, and marketing automation',
      'CRM integration and data routing',
      'Full documentation and optional maintenance retainers',
    ],
    caseStudies: [
      { href: '/work/ai-lead-response-autoresponder', title: 'AI Lead Response Autoresponder', metric: 'Response time from 4 hours to 90 seconds' },
      { href: '/work/ai-cold-email-personalization', title: 'AI Cold Email Personalization', metric: '3x reply rate on outbound sequences' },
      { href: '/work/field-service-operations-automation', title: 'Field Service Operations Automation', metric: '12 hours of weekly admin eliminated' },
    ],
    faqs: [
      { q: 'What tools do you use to build automations?', a: 'We build primarily in n8n and Make (Integromat) for workflow automation. For AI-native agents we use LangChain, OpenAI function calling, and Anthropic Claude depending on the use case. The right tool depends on what you\'re trying to automate.' },
      { q: 'How long does a typical automation project take?', a: 'Straightforward workflows (lead routing, notification systems) take 1 to 2 weeks. Multi-step AI agents with custom logic take 3 to 6 weeks. We scope it before we start so there are no surprises.' },
      { q: 'What kinds of work can you automate?', a: 'Lead response, appointment booking, CRM data entry, invoice follow-up, content repurposing, customer onboarding, reporting, and internal ops workflows are the most common. If you\'re doing it manually and it\'s repetitive, it\'s probably automatable.' },
      { q: 'Do I need to know how to maintain these automations after you build them?', a: 'No. We document everything and offer maintenance retainers if you want us to keep them running. If you want to manage them yourself, we\'ll train your team before handoff.' },
    ],
  },
  'crm-systems': {
    title: 'CRM Systems',
    headline: 'One System. Every Lead, Every Client.',
    description: 'GoHighLevel setup, CRM configuration, and ongoing management by a certified GHL consultant. Stop losing leads to slow follow-up and disconnected systems.',
    metaTitle: 'GoHighLevel Setup and CRM Service | RSL/A',
    metaDescription: 'GoHighLevel setup, CRM configuration, and ongoing management by a certified GHL consultant. Stop losing leads to slow follow-up and disconnected systems.',
    keywords: 'GoHighLevel setup, CRM setup service, GoHighLevel consultant, GHL implementation, CRM management, marketing automation',
    features: [
      'Full GoHighLevel account configuration and pipeline setup',
      'Automated follow-up sequences via email and SMS',
      'Calendar integration and lead capture forms',
      'Data migration from HubSpot, Salesforce, Keap, and spreadsheets',
      'Team training and optional ongoing management retainer',
    ],
    caseStudies: [
      { href: '/work/nonprofit-crm-volunteer-automation', title: 'Nonprofit CRM and Volunteer Automation', metric: '60% reduction in admin time' },
      { href: '/work/salon-marketing-automation-roi', title: 'Salon Marketing Automation ROI', metric: '2.4x revenue from existing client base' },
    ],
    faqs: [
      { q: 'Why GoHighLevel and not HubSpot or Salesforce?', a: 'GoHighLevel is purpose-built for service businesses and agencies. It combines CRM, email, SMS, pipelines, booking, websites, and reporting in one platform at a fraction of the cost of enterprise tools. For most of our clients it replaces 4 or 5 separate subscriptions.' },
      { q: 'What does a GoHighLevel setup project include?', a: 'Full account configuration, pipeline setup, automated follow-up sequences, calendar integration, lead capture forms, and a training session for your team. We build it around your actual sales process, not a generic template.' },
      { q: 'Can you migrate us from another CRM?', a: 'Yes. We\'ve migrated clients from HubSpot, Salesforce, Keap, and spreadsheets. Data migration depends on how clean your existing records are but we handle the full process.' },
      { q: 'Do you offer ongoing management after setup?', a: 'Yes. Monthly management retainers cover system maintenance, new automation builds, reporting, and optimization. Most clients stay on retainer because the system keeps growing as the business does.' },
    ],
  },
  'custom-development': {
    title: 'Custom Development',
    headline: 'Build What Doesn\'t Exist Yet.',
    description: 'Custom software development for SaaS, MVPs, and internal tools. Ship your first version in weeks, not months. Full-stack React, Node.js, and API builds.',
    metaTitle: 'Custom Software and SaaS Development | RSL/A',
    metaDescription: 'Custom software development for SaaS, MVPs, and internal tools. Ship your first version in weeks, not months. Full-stack React, Node.js, and API builds.',
    keywords: 'custom software development, SaaS development, MVP development, internal tools, API development, full-stack development',
    features: [
      'SaaS MVPs and client-facing portals',
      'Internal ops tools and data dashboards',
      'API integrations and workflow applications',
      'React, Next.js, Node.js, Python, PostgreSQL, Supabase',
      'Post-launch support retainers and feature additions',
    ],
    caseStudies: [
      { href: '/work/adreviveai-saas-build', title: 'AdRevive AI SaaS Build', metric: '0 to production in 6 weeks' },
      { href: '/work/notion-productivity-dashboard-anchor-safety', title: 'Notion Productivity Dashboard for Anchor Safety', metric: '100% ops visibility in one dashboard' },
    ],
    faqs: [
      { q: 'What kind of projects do you take on?', a: 'SaaS MVPs, client-facing portals, internal ops tools, API integrations, data dashboards, and workflow applications. We\'re best suited for projects where you need to move fast and ship something production-ready, not a prototype.' },
      { q: 'What\'s your tech stack?', a: 'React and Next.js on the frontend, Node.js and Python on the backend, PostgreSQL and Supabase for databases, and Vercel for hosting. We pick the right tool for the project rather than forcing everything into one stack.' },
      { q: 'How fast can you ship an MVP?', a: 'Well-scoped MVPs with clear requirements typically ship in 4 to 8 weeks. The biggest variable is scope clarity at the start. We run a discovery session before any build to make sure we both know exactly what\'s being built.' },
      { q: 'What happens after launch?', a: 'We offer post-launch support retainers for bug fixes, feature additions, and infrastructure management. Most clients move to a retainer because there\'s always a next phase once users start giving feedback.' },
    ],
  },
};

function serviceDetailContent(slug) {
  const s = SERVICE_DETAILS[slug];
  if (!s) return null;

  const featuresHtml = s.features.map(f => `<li>${esc(f)}</li>`).join('\n');
  const caseStudiesHtml = s.caseStudies.map(cs =>
    `<li><a href="${esc(cs.href)}">${esc(cs.title)}</a> — ${esc(cs.metric)}</li>`
  ).join('\n');
  const faqHtml = s.faqs.map(f =>
    `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`
  ).join('\n');

  return {
    route: `/services/${slug}`,
    title: s.metaTitle,
    description: s.metaDescription,
    canonical: `${SITE}/services/${slug}`,
    keywords: s.keywords,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.title,
        description: s.metaDescription,
        provider: { '@type': 'Organization', name: 'RSL/A', url: SITE },
        url: `${SITE}/services/${slug}`,
        areaServed: { '@type': 'Country', name: 'US' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: s.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
    html: `<main>
<nav aria-label="Breadcrumb"><a href="/services">Services</a> / ${esc(s.title)}</nav>
<h1>${esc(s.headline)}</h1>
<p>${esc(s.description)}</p>

<section>
<h2>What we offer</h2>
<ul>
${featuresHtml}
</ul>
</section>

<section>
<h2>Related case studies</h2>
<ul>
${caseStudiesHtml}
</ul>
</section>

<section>
<h2>Frequently asked questions</h2>
<dl>
${faqHtml}
</dl>
</section>

<p><a href="/contact">Start a project</a> | <a href="/services">All Services</a></p>
</main>`,
  };
}

// City hub pages
const CITY_DATA = {
  bakersfield: {
    metaTitle: 'Marketing Agency Bakersfield CA | RSL/A',
    metaDescription: 'RSL/A is a digital marketing agency based in Bakersfield, CA. Web design, SEO, and online growth for Kern County businesses.',
    keywords: 'marketing agency bakersfield, web design bakersfield, bakersfield seo, digital marketing bakersfield ca, seo bakersfield, bakersfield web design, website design bakersfield, search engine optimization bakersfield ca',
    canonical: 'https://rsla.io/services/bakersfield',
    headline: 'Digital marketing that works for Bakersfield businesses.',
    subheadline: 'Based right here in Bakersfield - we build websites and run SEO for local businesses ready to grow online.',
    intro: 'Bakersfield is one of the fastest-growing metros in California, and the competition for online visibility is real. Whether you\'re in the 661, near the Westside, or out in Kern County, your customers are searching Google before they call anyone. A strong web presence is no longer optional - it\'s the difference between being found and being invisible.',
    whyLocal: 'RSL/A is built in Bakersfield. Not a remote agency that lists the city on a page to rank - we\'re actually here. That means we understand the market, the pace, and what Bakersfield businesses are up against. We don\'t need a discovery call to understand your geography.',
    industries: [
      'Agriculture and farming',
      'Oil and energy',
      'Healthcare and medical',
      'Professional services and law firms',
      'Restaurants and hospitality',
      'Construction and home services',
      'Auto dealerships and repair shops',
    ],
    serviceHighlights: [
      { slug: 'web-design', name: 'Web Design', desc: 'Custom React and Next.js websites built for conversion, speed, and brand credibility.' },
      { slug: 'seo', name: 'SEO', desc: 'Local SEO, Google Business Profile, and answer engine optimization for Kern County businesses.' },
    ],
    faqs: [
      { q: 'Do you only work with Bakersfield businesses?', a: 'No. Our clients are primarily national, but we\'re based in Bakersfield and actively working to help local businesses get online visibility. If you\'re in Kern County, we know your market and can hit the ground running.' },
      { q: 'What does a website cost for a local Bakersfield business?', a: 'Most small business websites fall in the $2,500 to $6,000 range depending on scope. If you need e-commerce, booking systems, or custom functionality, it goes up from there. We\'ll give you a straight number after one conversation.' },
      { q: 'Can you help with Google Business Profile and local search?', a: 'Yes. Local SEO - including Google Business Profile optimization - is part of our SEO service. For Bakersfield businesses, showing up in the local pack is often more valuable than ranking on page one organically.' },
      { q: 'How do we get started?', a: 'Fill out the contact form or book a call directly. We\'ll talk through where you are, what you need, and whether it\'s a fit. No hard pitch, no long sales process - just a direct conversation.' },
    ],
  },
};

function cityHubContent(slug) {
  const c = CITY_DATA[slug];
  if (!c) return null;

  const industriesHtml = c.industries.map(i => `<li>${esc(i)}</li>`).join('\n');
  const servicesHtml = c.serviceHighlights.map(s =>
    `<li><a href="/services/${esc(s.slug)}">${esc(s.name)}</a> — ${esc(s.desc)}</li>`
  ).join('\n');
  const faqHtml = c.faqs.map(f =>
    `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`
  ).join('\n');

  return {
    route: `/services/${slug}`,
    title: c.metaTitle,
    description: c.metaDescription,
    canonical: c.canonical,
    keywords: c.keywords,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'RSL/A',
        url: c.canonical,
        description: c.metaDescription,
        provider: { '@type': 'Organization', name: 'RSL/A', url: SITE },
        areaServed: {
          '@type': 'City',
          name: 'Bakersfield',
          containedInPlace: { '@type': 'AdministrativeArea', name: 'Kern County, California' },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
    html: `<main>
<nav aria-label="Breadcrumb"><a href="/services">Services</a> / Bakersfield</nav>
<h1>${esc(c.headline)}</h1>
<p>${esc(c.subheadline)}</p>
<p>${esc(c.intro)}</p>

<section>
<h2>Services for Bakersfield businesses</h2>
<ul>
${servicesHtml}
</ul>
</section>

<section>
<h2>Industries we serve in Kern County</h2>
<ul>
${industriesHtml}
</ul>
</section>

<section>
<h2>Frequently asked questions</h2>
<dl>
${faqHtml}
</dl>
</section>

<p>${esc(c.whyLocal)}</p>
<p><a href="/contact">Book a free call</a> | <a href="/services">All Services</a></p>
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
    title: 'Insider Newsletter | RSL/A',
    description: 'Get weekly automation insights delivered to your inbox.',
    canonical: `${SITE}/insider`,
    noIndex: true,
    html: `<main>
<h1>Automate smarter every week.</h1>
<p>Real automation strategies, case studies, and AI tools delivered straight to your inbox every week.</p>
<ul>
<li>Case studies saving clients $20K to $136K annually</li>
<li>Actionable automation tips you can use today</li>
<li>Tool recommendations from real implementations</li>
</ul>
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
<p>Marketing &amp; AI Automation Expert</p>
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
    return `<li><article><h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>${excerpt}<p>${date}${cats ? ` — ${esc(cats)}` : ''}</p></article></li>`;
  }).join('\n');

  return {
    title: 'Blog: AI Marketing, Automation & Growth Insights | RSL/A',
    description: 'Practical guides on GoHighLevel, Claude AI, marketing automation, local SEO, and AI-powered growth strategies. Written by practitioners, not theorists.',
    canonical: `${SITE}/blog`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Blog', url: `${SITE}/blog`,
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
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
<p>Insights on marketing automation, AI systems, local SEO, and strategies to scale your operations without overhead.</p>
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
    title: 'AI Automation Case Studies: Real Client Results | RSL/A',
    description: 'Real results from real clients. See how RSL/A uses AI automation, custom websites, and CRM systems to drive measurable growth for B2B companies.',
    canonical: `${SITE}/work`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Case Studies', url: `${SITE}/work`,
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
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
<p>We don't sell promises. We sell engineered outcomes. Here is the proof.</p>
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

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: post.title,
      description,
      datePublished: post.publishedAt,
      ...(dateModified && { dateModified }),
      ...(wordCount > 0 && { wordCount }),
      ...(ogImage && { image: ogImage }),
      author: { '@type': 'Person', name: post.author?.name || 'Rahul Lalia' },
      publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/images/logo/lockup-nobg.webp` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.tldr', '.key-takeaways'] },
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
      author: { '@type': 'Person', name: 'Rahul Lalia' },
      publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/images/logo/lockup-nobg.webp` } },
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
        author->{ name },
        categories[]->{ name, "slug": slug.current },
        seo { metaTitle, metaDescription, keywords, socialImage { asset-> } },
        faqSchema
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

  // Service detail pages (one per service slug)
  for (const slug of ['web-design', 'seo', 'ai-automations', 'crm-systems', 'custom-development']) {
    const page = serviceDetailContent(slug);
    if (page) {
      writePage(page.route, inject(template, page));
      count++;
    }
  }

  // City hub pages
  for (const slug of ['bakersfield']) {
    const page = cityHubContent(slug);
    if (page) {
      writePage(page.route, inject(template, page));
      count++;
    }
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

  console.log(`Pre-rendered ${count} pages (${staticPages.length} static, 5 service detail, 1 city hub, 2 listings, ${blogPosts.length} blog posts, ${caseStudies.length} case studies, ${leadMagnets.length} lead magnets)`);
}

main().catch((err) => {
  console.error('ERROR: Pre-render FAILED:', err.message || err);
  console.error('Site will work as a normal SPA but has NO pre-rendered HTML for SEO.');
  process.exitCode = 1;
});
