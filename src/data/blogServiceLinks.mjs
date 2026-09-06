/**
 * In-content links from indexed posts and case studies into the service pages.
 * Anchor text names the destination keyword. Imported by BlogInner, WorkInner,
 * and scripts/prerender.mjs so the static HTML carries the same links.
 */
const crm = { label: 'CRM systems set up by a GoHighLevel expert', to: '/services/crm' };
const crmLocal = { label: 'CRM setup in Bakersfield', to: '/bakersfield/crm' };
const automations = { label: 'AI automation agency for service businesses', to: '/services/automations' };
const automationsLocal = { label: 'AI automation in Bakersfield', to: '/bakersfield/automations' };
const seo = { label: 'SEO services for small businesses', to: '/services/seo' };
const seoLocal = { label: 'local SEO services', to: '/services/seo/local' };
const seoBako = { label: 'SEO company in Bakersfield', to: '/bakersfield/seo' };
const pseo = { label: 'programmatic SEO services', to: '/services/seo/programmatic' };
const websites = { label: 'website design for small businesses', to: '/services/websites' };
const websitesLocal = { label: 'web design in Bakersfield', to: '/bakersfield/websites' };
const redesign = { label: 'website redesign services', to: '/services/websites/redesign' };
const custom = { label: 'custom software development for small businesses', to: '/services/custom-builds' };
const bako = { label: 'marketing agency in Bakersfield', to: '/bakersfield' };

export const blogServiceLinks = {
  'go-high-level-pricing': [crm, automations],
  'what-is-go-high-level': [crm, crmLocal],
  'gohighlevel-vs-hubspot-comparison': [crm, automations],
  'gohighlevel-updates-2026': [crm, automations],
  'gohighlevel-workflow-automations-guide': [automations, crm, automationsLocal],
  'gohighlevel-funnel-tutorial-high-converting': [crm, websites],
  'gohighlevel-lead-follow-up-automation': [crm, automations, crmLocal],
  'gohighlevel-vs-jobber-home-service-crm': [crm, crmLocal, automationsLocal],
  'gohighlevel-for-restaurants-fill-tables': [crm, seoLocal],
  'google-business-profile-optimization-guide-2026': [seoLocal, seoBako, bako, websitesLocal],
  'how-to-rank-higher-on-google-maps-a-comprehensive-guide': [seoLocal, seoBako, websitesLocal, bako],
  'aeo-for-local-businesses': [seo, seoLocal, seoBako, bako],
  'med-spa-seo-what-actually-works': [seo, seoLocal, redesign, websitesLocal],
  'automate-client-intake-ai': [automations, crm, automationsLocal],
  'ai-marketing-stack-what-we-use': [automations, custom, pseo, websites],
  'claude-code-marketing-agency-workflow': [custom, automations, pseo, redesign],
  'claude-code-vs-cowork-vs-claude-app': [custom, automations],
  'anthropic-claude-products-guide': [custom, automations],
};

export const caseStudyServiceLinks = {
  'fieldshare-seo-website-rebrand': [redesign, seo, websites],
  'rsla-organic-growth': [seo, pseo, seoLocal],
  'ai-cold-email-personalization': [automations, custom],
  'notion-productivity-dashboard-anchor-safety': [custom, automations],
  'salon-marketing-automation-roi': [crm, automations, websites],
};

/** Old service slugs still stored in Sanity `relatedCapability` fields. */
export const legacyServiceSlugs = {
  'web-design': '/services/websites',
  'seo': '/services/seo',
  'ai-automations': '/services/automations',
  'crm-systems': '/services/crm',
  'custom-development': '/services/custom-builds',
  'search-visibility': '/services/seo',
  'websites': '/services/websites',
  'automations': '/services/automations',
  'crm': '/services/crm',
  'custom-builds': '/services/custom-builds',
};

export function serviceUrlFromCapability(slug) {
  if (!slug) return null;
  return legacyServiceSlugs[slug] || `/services/${slug}`;
}
