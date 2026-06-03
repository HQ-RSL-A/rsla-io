/**
 * Single source of truth for the global structured-data entity graph.
 *
 * These two nodes (the business + the website) are the backbone of the site's
 * schema graph. They are emitted on every indexed page, two ways:
 *   1. Prerender (static HTML Google crawls first) — scripts/prerender.mjs imports
 *      these and injects them via inject().
 *   2. Client (hydrated DOM) — src/components/Seo.jsx imports these and re-injects
 *      them on every route so the hydrated DOM matches the prerendered HTML.
 *
 * Because both layers import the SAME objects, the prerendered and client-rendered
 * graphs can never drift. Page-specific nodes (BlogPosting, Service, FAQPage, etc.)
 * reference these by their stable @id: #business and #website.
 *
 * Pure ESM, no imports — so Node (prerender) and Vite (client) can both load it.
 */

export const SITE = 'https://rsla.io';

/** Stable @id references for page-level nodes to link into the graph. */
export const businessRef = { '@id': `${SITE}/#business` };
export const websiteRef = { '@id': `${SITE}/#website` };
export const founderRef = { '@id': `${SITE}/#rahul` };

/** The organization, typed as LocalBusiness + ProfessionalService (both are Organization subtypes). */
export const organizationNode = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE}/#business`,
  name: 'RSL/A',
  alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
  url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}/images/logo/lockup-nobg.webp`, width: 400, height: 100 },
  image: `${SITE}/images/logo/lockup-nobg.webp`,
  description: "The trusted AI growth partner for fast-moving B2B companies. We build your website, get it found on Google and ChatGPT, and automate what's slowing you down.",
  email: 'hello@rsla.io',
  telephone: '+1-661-466-5919',
  priceRange: '$$$',
  founder: { '@id': `${SITE}/#rahul` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bakersfield',
    addressRegion: 'CA',
    postalCode: '93301',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 35.3733, longitude: -119.0187 },
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
  ],
  knowsAbout: ['AI Automation', 'Web Development', 'Search Engine Optimization', 'Answer Engine Optimization', 'GoHighLevel CRM', 'Marketing Automation', 'Local SEO', 'Content Marketing'],
  sameAs: [
    'https://www.instagram.com/rahul.lalia/',
    'https://www.linkedin.com/in/rahullalia/',
    'https://www.youtube.com/@rahul_lalia',
    'https://www.tiktok.com/@rahul_lalia',
    'https://x.com/rahul_lalia',
  ],
};

/** The website, published by the business. */
export const websiteNode = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: 'RSL/A',
  alternateName: ['RSLA', 'RSL/A', 'RSL A'],
  url: SITE,
  publisher: { '@id': `${SITE}/#business` },
};

/** The founder, as a first-class Person entity referenced across the site (author, ProfilePage). */
export const personNode = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#rahul`,
  name: 'Rahul Lalia',
  jobTitle: 'Founder & CEO',
  url: `${SITE}/about`,
  image: `${SITE}/images/rahul.webp`,
  description: 'Founder of RSL/A. Builds AI growth systems for B2B companies. Five years in marketing, automation, and business infrastructure.',
  worksFor: { '@id': `${SITE}/#business` },
  knowsAbout: ['AI Automation', 'Marketing Automation', 'GoHighLevel CRM', 'Search Engine Optimization', 'Answer Engine Optimization', 'Web Development'],
  sameAs: [
    'https://www.linkedin.com/in/rahullalia/',
    'https://www.instagram.com/rahul.lalia/',
    'https://www.youtube.com/@rahul_lalia',
    'https://www.tiktok.com/@rahul_lalia',
    'https://x.com/rahul_lalia',
    'https://github.com/rahullalia',
  ],
};

/** All global nodes, emitted on every indexed page (prerender + client). */
export const globalSchemas = [organizationNode, websiteNode, personNode];
