# rsla.io SEO Audit - April 30, 2026

**Data sources:** SEMRush Domain Overview, SEMRush Site Audit, SEMRush Backlinks Overview, GA4 (GSC integration), Google Analytics MCP
**Previous audit:** March 25, 2026 (see seoActionPlan.md)

---

## Performance Snapshot

| Metric | March 2026 | April 2026 | Change |
|--------|-----------|-----------|--------|
| Authority Score | 8 | 7 | -1 |
| Organic Traffic (SEMRush) | 15/mo | ~80 clicks/mo | +433% |
| Ranking Keywords | 119 | 151 | +27% |
| Total Impressions (5mo) | N/A | 81,065 | baseline |
| Site-wide CTR | N/A | 0.18% | critically low |
| Pages with 1 internal link | 42 | 46 | worse |

---

## What Was Fixed Since March Audit

- Sitemap now includes all published posts, case studies, and industry pages
- Pre-rendered HTML has navigation links for non-JS crawlers
- Broken blog posts (ai-lead-follow-up-system, answer-engine-optimization-aeo-guide) resolved
- 33 legacy URL 301 redirects added
- Page titles and meta descriptions optimized for top pages
- Service detail pages noIndexed (thin content)
- FAQ schema added to homepage React component
- BlogPosting schema enriched with dateModified and image
- Instagram handle inconsistency fixed
- og:locale added site-wide
- Tracking consolidated to GTM-only (GA4 + Meta Pixel)
- Conversion tracking added (booking_confirmed, newsletter_subscribe, cta_click)

---

## Critical Finding: 213K+ Impressions, 210 Clicks

The site's biggest problem is not ranking - it's CTR. Six posts account for 213,000+ impressions but only 210 clicks (0.10% CTR).

| Page | Impressions | Clicks | CTR | Position |
|------|------------|--------|-----|----------|
| /blog/go-high-level-pricing | 88,225 | 21 | 0.02% | 8.4 |
| /blog/claude-code-vs-cowork-vs-claude-app | 70,201 | 90 | 0.13% | 7.6 |
| /blog/go-high-level-new-features-2025 | 55,032 | 38 | 0.07% | 5.9 |
| /blog/gohighlevel-pricing-2026-cost-breakdown | 20,528 | 1 | 0.005% | 7.3 |
| /blog/claude-code-remote-control-guide | 12,283 | 15 | 0.12% | 7.3 |
| /blog/anthropic-claude-products-guide | 3,837 | 45 | 1.17% | 6.1 |

**Root cause:** Titles and meta descriptions are not compelling enough to win clicks from page 1. These pages are already ranking well (position 5-8) but nobody clicks.

---

## Tier 1: Do This Week

### 1.1 Rewrite title tags and meta descriptions for top 5 posts

This is the single highest-ROI action. Even a 1% CTR improvement on the GHL Pricing post = 880 new clicks/month.

**GHL Pricing post:**
- Current title is generic. Add specific prices ($97/$297/$497) and current year.
- Meta description should include a comparison hook or savings angle.

**GHL New Features post:**
- URL slug says "2025" but content covers 2026. Rename slug, set up 301.
- Add prominent "last updated" date. Add monthly anchors.

**Claude Code vs Cowork post:**
- 70K impressions, 0.13% CTR. Meta description should be more decisive.
- Example: "Code for terminal. Cowork for desktop. Chat for conversation. 30-second decision guide."

**GHL Pricing 2026 Cost Breakdown:**
- 20K impressions, 1 click. May be cannibalizing the main pricing post.
- Decision needed: merge into one authoritative post or differentiate clearly.

**Claude Code Remote Control:**
- 12K impressions at position 7.3. Title/meta refresh could push CTR above 1%.

### 1.2 Add internal links to the 46 orphaned pages

Nearly half the site has only 1 internal link. Priority targets:

| Page | Impressions | Position | Internal Links |
|------|------------|----------|---------------|
| /blog/salon-appointment-reminder-automation | 1,052 | 7.8 | 1 |
| /blog/salon-client-retention-automated-strategies | 729 | 7.5 | 1 |
| /blog/why-marketing-isnt-working-automation-gap | 491 | 9.1 | 1 |
| /blog/cost-of-manual-lead-follow-up | 177 | 4.7 | 1 |

Each needs 3-5 contextual links from related blog posts and case studies.

### 1.3 Remove /blog/answer-engine-optimization-aeo-guide from sitemap

Returns a 301 redirect. Has no title/meta/OG/structured data at the destination. Either fix the redirect destination or remove from sitemap.

---

## Tier 2: Do This Month

### 2.1 Update GHL pricing post URL

Rename from `/blog/go-high-level-pricing` to include "2026". Add a rich pricing comparison table. Set up 301 from old URL. Target "gohighlevel pricing 2026" (7,970 impressions, position 5.7).

### 2.2 Update GHL updates post URL

Same treatment. Add month-by-month anchors with structured data. Target "gohighlevel changelog [month] 2026" queries where already ranking position 2-4.

### 2.3 Rewrite GHL vs HubSpot comparison

462 impressions at position 33. High-intent comparison query. Needs side-by-side feature tables, pricing comparison, and clear recommendation to reach page 1.

### 2.4 Fix www to non-www redirect

Both versions are being crawled. Canonicals are set correctly, but a proper 301 redirect from www to non-www at DNS/server level reduces wasted crawl budget.

### 2.5 Build internal link clusters

**GHL cluster:** pricing, features, comparisons, industry guides should all cross-link.
**Claude cluster:** all Claude posts should link to each other.
**Vertical clusters:** salon/restaurant/contractor posts should link to matching case studies.

---

## Tier 3: Next 30-60 Days

### 3.1 Create "B2B Marketing Automation" pillar page

Core agency offering with zero search visibility. Target "B2B marketing automation agency", "AI marketing automation for B2B". Link to all 6 case studies.

### 3.2 Refresh underperforming vertical content

| Post | Impressions | Position | Action |
|------|------------|----------|--------|
| salon CRM | 303 | 18.3 | Expand content, add internal links |
| HVAC CRM | 271 | 50.7 | Major rewrite |
| real estate CRM | low | 78+ | Major rewrite |

### 3.3 Launch backlink acquisition

Current state: ~14 referring domains, 91% low-quality. Biggest barrier to competitive terms.

**Tactics:**
- Guest posts on GHL-adjacent blogs (ghlcentral.com, gohighimpact.co)
- Agency directory listings (Clutch, DesignRush, GoodFirms)
- Case study co-marketing with clients
- Linkable assets (the GHL changelog is natural link bait)
- HARO/Connectively for journalist quotes

### 3.4 Expand "GoHighLevel for [industry]" series

Write new posts for dental, HVAC, law firms, contractors. Low competition, high buying intent. Each should link to corresponding case study if one exists.

### 3.5 Backlink disavow

Review Singapore/Moldova spam domains in SEMRush Backlink Audit. Export disavow list. Upload to GSC Disavow Tool.

---

## Striking Distance Keywords

Already ranking position 5-15, achievable page 1 with title/meta refresh + internal links:

| Query | Impressions | Position | Current Clicks |
|-------|------------|----------|---------------|
| gohighlevel pricing 2026 | 7,970 | 5.7 | 1 |
| gohighlevel updates 2026 | 2,430 | 5.2 | 0 |
| gohighlevel ai features 2026 | 524 | 6.8 | 0 |
| best crm for hair extension businesses | 404 | 7.7 | 0 |
| crm for hair salon | 303 | 18.3 | 0 |
| gohighlevel vs hubspot | 462 | 33.2 | 0 |
| what is go high level | 147 | 25.6 | 0 |
| cost of manual lead follow-up | 177 | 4.7 | 0 |

---

## Zero-Click Pages (Content Exists, Failing to Convert)

These pages have impressions and decent positions but zero clicks. Title/meta rewrite alone could fix them:

| Page | Impressions | Position |
|------|------------|----------|
| /blog/salon-appointment-reminder-automation | 1,052 | 7.8 |
| /blog/salon-client-retention-automated-strategies | 729 | 7.5 |
| /blog/why-marketing-isnt-working-automation-gap | 491 | 9.1 |
| /blog/cost-of-manual-lead-follow-up | 177 | 4.7 |
| /blog/automate-real-estate-lead-nurturing | 515 | 15.0 |

---

## Site Audit Issues (Remaining)

**Errors:**
- 2 pages with structured data markup errors (check /services)
- 4 pages with title tags over 60 characters

**Warnings:**
- 46 pages with only 1 internal link
- 5 orphaned sitemap pages
- www/non-www duplication (canonicals set, no 301)

**Clean:** No broken links, no missing titles/metas, no 4xx/5xx, fast load times, valid sitemap/robots.txt, proper HTTPS, all pages have JSON-LD + OG + Twitter Cards.

---

## Metrics to Track

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|--------------|--------------|
| Organic CTR | 0.18% | 1%+ | 2%+ |
| Organic clicks/month | ~80 | 200 | 300+ |
| Pages with 1 internal link | 46 | <20 | <10 |
| Referring domains | ~14 | 25 | 50 |
| Key events in GA4 | 0 | tracking live | measuring ROI |

---

## UTM Traffic (for reference)

| Source | First seen | Sessions | Engagement |
|--------|-----------|----------|------------|
| ig / social | March 14 | 26 | 81% |
| email-signature / email | April 20 | 11 | 91% |
| linkedin / bio_personal | April 18 | 3 | 67% |

All UTM traffic lands on the homepage. Instagram dropped off after April 7.

---

## Google Search Console Coverage (April 30, 2026)

### Indexing Trend

| Date | Indexed | Not Indexed | Daily Impressions |
|------|---------|-------------|-------------------|
| Jan 30 | 38 | 213 | ~1,200 |
| Feb 24 | 60 | 200 | ~2,000 |
| Mar 10 | 69 | 161 | 7,681 |
| Mar 16 | 69 | 158 | **10,492** (peak) |
| Apr 4 | 66 | 179 | 2,767 |
| Apr 13 | 66 | 174 | 5,544 |
| Apr 20 | **53** | 188 | 3,569 |
| Apr 26 | **52** | 179 | 2,773 |

**Index count dropped from 69 to 52 in April.** 17 pages that were previously indexed are no longer. This needs investigation - check GSC to identify which specific pages were de-indexed and why.

**Impressions peaked mid-March at 10,492/day** then declined to ~2,700/day by late April. The decline correlates with the index count drop.

### Coverage Breakdown

| Status | Count | Action |
|--------|-------|--------|
| **Crawled - currently not indexed** | **131** | Critical. Google crawled these pages but chose not to index them. Likely thin content, duplicate content, or low perceived value. Investigate which pages and why. |
| Discovered - currently not indexed | 13 | Google found URLs but hasn't crawled them yet. These will resolve on their own or need internal links to signal importance. |
| Soft 404 | 12 | Pages returning 200 but Google interprets as error pages. Likely industry pages (/ai-for/*) or old URLs with minimal content. Fix by adding substantial content or properly 404/redirecting. |
| Page with redirect | 11 | Expected. Legacy 301 redirects we added. No action needed. |
| Excluded by noindex | 9 | Expected. Service detail pages + legal pages. No action needed. |
| Alternate page with canonical | 2 | Expected. www vs non-www. No action needed. |
| Blocked by robots.txt | 1 | Investigate which page and whether it should be blocked. |

### Critical Issue: 131 Crawled But Not Indexed

This is the single biggest indexing problem. Google visited 131 pages and decided they weren't worth indexing. Common causes:

1. **Thin content** - pages with very little unique text (industry pages, service detail pages)
2. **Duplicate/near-duplicate content** - multiple pages targeting the same topic
3. **Low internal link equity** - pages with only 1 internal link don't signal importance
4. **Crawl budget waste** - Google is spending budget crawling pages it won't index

**Action plan:**
- Pull the full list of "Crawled - currently not indexed" URLs from GSC
- Categorize them: which are blog posts, industry pages, case studies, or junk URLs?
- For valuable content: add internal links, expand thin content, improve titles
- For junk URLs: noindex or 404 them so Google stops wasting crawl budget
- For industry pages (/ai-for/*): expand from template pages to 800+ word unique content

### Soft 404 Investigation Needed

12 pages are being treated as soft 404s. These are likely:
- Industry pages (/ai-for/*) with boilerplate template content
- Old legacy URLs that return the SPA shell but no real content
- Pages where the React hydration fails and Google sees an empty shell

**Action:** Pull the list from GSC, fix each one by either adding real content or returning a proper 404 status code.

### Key Takeaway

The site went from 38 indexed pages in January to 69 in March (great progress from sitemap and technical fixes), but has since dropped back to 52. The 131 crawled-but-not-indexed pages suggest Google is evaluating the site's content quality more critically. The priority is:

1. Fix the 12 soft 404s (these actively hurt the site's quality signals)
2. Investigate the 17 de-indexed pages (what changed?)
3. Address the 131 crawled-not-indexed pages by improving content quality and internal linking
4. Stop the impressions decline by improving CTR on existing rankings
