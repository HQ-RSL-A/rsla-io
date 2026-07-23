# rsla.io SEO Action Plan

**Based on:** SEMRush Site Audit, Organic Research, Backlink Analytics, On-Page SEO Checker
**Date:** March 25, 2026
**Current state:** Authority Score 8, Organic Traffic 15/mo, 119 keywords, 14 referring domains

---

## Current Situation (Honest Assessment)

The site is technically solid (98% health score, 94% AI search health) but essentially invisible in organic search. All meaningful traffic comes from one blog post about GoHighLevel updates. The backlink profile is almost nonexistent. There are zero commercial-intent keywords driving traffic.

**What's working:**
- Technical SEO foundation is clean (no 5xx, no 4xx, valid sitemap/robots, proper canonicals, full structured data)
- The GHL changelog post (`go-high-level-new-features-2025`) is ranking for 42 keywords and driving 100% of organic traffic
- AI search health is strong (94%, 11 cited pages)
- All pages have JSON-LD, OG, and Twitter Cards

**What's broken:**
- 45% of pages have only 1 internal link (orphan-like)
- 32 blog posts are missing from the sitemap entirely
- 12 industry pages missing from the sitemap
- 2 blog posts render as the homepage (broken Sanity queries)
- 3 key pages (/about, /services, /book-a-call) are unreachable without JavaScript
- Pre-rendered HTML has no navigation links, so non-JS crawlers can't discover pages
- /blog listing page has poor heading hierarchy
- Broken external link on the GHL pricing page
- /book-a-call is in the sitemap but is noindex (contradictory)
- 0 dofollow backlinks from external sites

---

## Phase 1: Technical Fixes (Do Today)

These are code changes that directly fix crawlability and indexing problems.

### 1.1 Fix 2 broken blog posts

**Pages:** `/blog/ai-lead-follow-up-system`, `/blog/answer-engine-optimization-aeo-guide`
**Problem:** These render as the homepage (wrong title, wrong canonical, wrong content). Sanity query is silently failing for these slugs.
**Fix:** Check if these slugs exist in Sanity. If not, either create the content or redirect to the correct URL. If they exist, debug why the GROQ query returns nothing.
**Impact:** These pages are 4 clicks deep AND broken. Google is indexing homepage duplicates.

### 1.2 Add navigation links to pre-rendered HTML

**Problem:** The pre-rendered content only includes page-specific content, not navigation. Non-JS crawlers (including SEMRush with JS disabled) can't discover /about, /services, or any page not directly linked from content.
**Fix:** Inject a `<nav>` element into the pre-rendered HTML with links to all main pages (Home, About, Services, How It Works, Work, Blog, Start Here).
**Impact:** Fixes the 3 orphaned sitemap pages (/about, /services, /book-a-call) and makes the full site crawlable without JS.

### 1.3 Fix the sitemap

**Current:** 47 URLs. Should be ~80+.
**Changes needed:**
- Add all 60 published blog posts (currently only 28)
- Add all 12 industry pages (/ai-for/*)
- Remove /book-a-call (noindex page shouldn't be in sitemap)
- Verify the sitemap generation script pulls ALL published Sanity content

### 1.4 Fix broken external link

**Page:** `/blog/go-high-level-pricing`
**Broken link:** `https://support.gohighlevel.com/` (returning error)
**Fix:** Update to the current GHL support URL or remove.

### 1.5 Fix /blog heading hierarchy

**Problem:** SEMRush flagged "poor heading hierarchy" on the blog listing page.
**Fix:** Ensure H1 > H2 > H3 order is correct on Blog.jsx.

### 1.6 Add word count to thin pages

**Pages:** `/how-it-works` (122 words), `/start-here` (133 words)
**Fix:** These are short by design (conversion pages), but adding 100 to 200 more words of context would help. Consider adding a brief paragraph explaining the process or a few FAQ items.

---

## Phase 2: Internal Linking Overhaul (This Week)

This is the highest-impact work after technical fixes. 42 pages have only 1 internal link.

### 2.1 Add "Related Posts" component to BlogInner

Add a section at the bottom of every blog post showing 3 related posts. Use Sanity categories to match related content. This alone turns every blog post from 1 internal link into 4.

### 2.2 Add "Related Case Studies" to blog posts

Where a blog post discusses a topic that has a matching case study, link to it. For example:
- GHL posts should link to the AdReviveAI, Field Service, Nonprofit, and Salon case studies
- Local SEO posts should link to Fieldshare and Spice on a Slice case studies
- Lead gen posts should link to Cold Email and Lead Response case studies

### 2.3 Add "Related Blog Posts" to case studies

Each case study should link to 2 to 3 relevant blog posts that expand on the topic.

### 2.4 Cross-link within topic clusters

**GHL Cluster** (your strongest content):
- `what-is-go-high-level` should link to pricing, workflow automations, funnel tutorial, and the changelog
- `go-high-level-pricing` should link to what-is-ghl, features, and the comparison posts
- All GHL posts should cross-reference each other where natural

**AI/Claude Cluster:**
- `what-is-claude-code-guide` should link to hooks, remote control, CLAUDE.md, MCP servers
- All Claude posts should link to the "how we use claude code" post

**Local SEO Cluster:**
- Google Maps ranking guide should link to GBP optimization guide and vice versa
- Both should link to case studies

### 2.5 Link industry pages from blog posts

Each /ai-for/* page should be linked from at least 2 to 3 relevant blog posts. Currently they have zero internal links.

---

## Phase 3: On-Page Optimization (This Week)

Based on SEMRush On-Page SEO Checker data. Prioritized by ranking potential.

### 3.1 GHL Changelog Post (Priority: HIGHEST, 42 keywords)

**URL:** `/blog/go-high-level-new-features-2025`
**Current rankings:** Position 3 to 90 for various "gohighlevel updates/changelog/news" queries
**Issues:**
- H1 and title don't contain date-specific keywords (the queries include "november 2025", "october 2025")
- Content is thin compared to competitors
- Missing semantic terms: "custom fields", "workflow action", "custom html css javascript", "featured releases"
**Actions:**
- Update title to include "GoHighLevel Updates & Changelog 2026" more prominently
- Add monthly sections with H2s containing month names (makes it match "gohighlevel updates [month] 2025" queries)
- Expand word count with more detail per update
- Add semantic terms from competitor analysis

### 3.2 GHL vs Jobber Post (Priority: HIGH, score 12.53)

**URL:** `/blog/gohighlevel-vs-jobber-home-service-crm`
**Target keyword:** "gohighlevel jobber integration" (position 47, volume 260)
**Issues:**
- H1 and title don't mention "integration"
- Missing semantic terms: "client data", "app marketplace", "bulk deploy"
**Actions:**
- Add "integration" to either H1 or a prominent H2
- Add a section about integration capabilities between the two platforms
- Include the missing semantic terms naturally

### 3.3 GHL Pricing Posts (Priority: MEDIUM)

**URLs:** `/blog/go-high-level-pricing` AND `/blog/gohighlevel-pricing-2026-cost-breakdown`
**Problem:** Two posts competing for the same keywords (keyword cannibalization)
**Target keywords:** "ghl pricing" (480 vol), "gohighlevel pricing" (2.9K vol), "go high level price" (390 vol)
**Issues on pricing-2026-cost-breakdown:**
- Target keyword "go high level price" missing from body, H1, title, and meta description
- Missing semantic terms: "saas mode", "agency pro plan", "highlevel price", "pricing plans", "14 days"
- Low word count vs competitors
- SEMRush suggests adding SoftwareApplication schema with aggregate rating
**Actions:**
- Decide which pricing post is the canonical one and redirect the other, OR differentiate them clearly (one for overview, one for deep comparison)
- Add missing semantic terms
- Add SoftwareApplication structured data
- Expand content depth

### 3.4 Niche CRM Posts (Priority: MEDIUM)

**Salon CRM** (`best-crm-hair-stylists-salon-owners`): Position 15 for "hair salon crm" (90 vol), position 20 for "salon crm" (210 vol)
**HVAC CRM** (`best-crm-for-hvac-companies`): Position 38 to 78 for various HVAC CRM queries
**Real Estate CRM** (`best-crm-solo-real-estate-agent`): Position 78 for "best estate agent crm" (50 vol)
**Actions:**
- Salon CRM post is closest to page 1. Focus on getting it from position 15 to 20 into top 10 by adding internal links and expanding content.
- HVAC and Real Estate posts need more work. They're in the sitemap gap (not included). Adding them to sitemap + internal links could boost significantly.

### 3.5 Restaurant Email Post (Priority: LOW)

**URL:** `/blog/restaurant-email-marketing-build-lists`
**Target:** "restaurants email list" (position 94, volume 170)
**Issues:** Keyword missing from body, H1, title, meta desc. Low word count. Missing 17 semantic terms.
**Actions:** Major rewrite needed. Consider if this keyword is worth pursuing vs. other opportunities.

---

## Phase 4: Backlink Strategy (Ongoing)

Current state: 14 referring domains, essentially 0 dofollow links, mostly spam redirects.

### 4.1 Immediate cleanup

- The old domain redirects (rslmediahub.com, rslmediahub.net, myrsla.com) are redirecting many old blog URLs to the homepage instead of the matching new URL. Fix the redirect mapping so link equity flows to the right pages.
- Old URLs like `/blog/complete-seo-audit-guide-16-essential-steps-to-boost-your-rankings` have real backlinks from citypcrepairs.com but redirect to homepage. Map these to the actual matching content.

### 4.2 Realistic backlink targets from SEMRush suggestions

The On-Page checker suggests acquiring backlinks from:
- **gohighlevel.com** and **canny.io** (GHL's feedback board) — get your GHL content cited/linked
- **ghlcentral.com**, **memberium.com** — GHL ecosystem sites
- **food.ee** — restaurant industry (for the restaurant content)

### 4.3 Backlink strategy (what will actually work)

Given the Authority Score of 8, you need to build from the ground up:

**Guest posting / content partnerships:**
- Reach out to GHL community sites (ghlcentral.com, gohighimpact.co) and offer to guest post about your GHL case studies
- Contribute to AI/automation blogs about your Claude Code workflows (genuinely unique content)

**HARO / Connectively / Featured:**
- Sign up for journalist query services. Your expertise in AI automation for small businesses is quotable.

**Case study link building:**
- Your case studies are your best link bait. "From 14 to 132 Google Reviews in 60 Days" is the kind of story local business publications pick up.

**DesignRush optimization:**
- You already have ~30 DesignRush listings but they're all nofollow. Still useful for brand signals and potential referral traffic. Make sure your profile is complete and up to date.

---

## Phase 5: Content Strategy Shift (Next 30 Days)

The fundamental problem: you rank for "what is GoHighLevel" queries but not for "I need someone to build AI automation for my business" queries.

### 5.1 Missing keyword categories

You have zero content targeting:
- "AI automation agency" / "AI marketing agency"
- "marketing automation consultant"
- "CRM setup service" / "GoHighLevel setup service"
- "business automation for [industry]"
- "hire AI developer for business"

These are the commercial-intent keywords that would actually bring in clients.

### 5.2 Recommended new content (commercial intent)

Create content targeting people ready to buy, not just learn:
- "How much does it cost to hire an AI automation agency" (pricing page alternative)
- "AI automation agency vs doing it yourself" (comparison content with commercial intent)
- "GoHighLevel setup service: what to expect and what it costs"
- "When to hire a marketing automation consultant" (buying guide)

### 5.3 Leverage the GHL content

The GHL content is ranking. Use it as a bridge:
- Add CTAs within the GHL posts: "Need help setting this up? Here's what we charge."
- Create a "GHL setup packages" page and link from all GHL content
- The GHL audience IS your target audience. They're small business owners who found GHL and need help implementing it.

---

## Priority Summary

| Priority | Task | Impact | Effort |
|---|---|---|---|
| P0 | Fix 2 broken blog posts | High | 30 min |
| P0 | Add nav to pre-rendered HTML | High | 1 hour |
| P0 | Fix sitemap (add all 60+ pages) | High | 1 hour |
| P0 | Fix broken external link | Low | 5 min |
| P1 | Internal linking overhaul (Related Posts component) | Very High | 3 to 4 hours |
| P1 | Cross-link topic clusters | High | 2 hours (Sanity) |
| P1 | Fix old domain redirect mapping | Medium | 1 hour |
| P2 | Optimize GHL changelog post | High | 2 hours (Sanity) |
| P2 | Fix GHL pricing cannibalization | Medium | 1 hour |
| P2 | Optimize GHL vs Jobber post | Medium | 1 hour (Sanity) |
| P2 | Push salon CRM post to top 10 | Medium | 1 hour (Sanity) |
| P2 | Fix blog heading hierarchy | Low | 15 min |
| P2 | Add words to thin pages | Low | 30 min |
| P3 | Create commercial-intent content | Very High | Ongoing |
| P3 | Backlink outreach | Very High | Ongoing |
| P3 | Add SoftwareApplication schema to pricing posts | Low | 30 min |

---

## What to Track

Run another SEMRush audit in 4 weeks to measure:
- Total indexed pages (should jump from ~47 to 80+)
- Orphaned pages (should drop to 0)
- Pages with only 1 internal link (should drop from 42 to under 10)
- Keyword positions (especially salon CRM, HVAC CRM, GHL changelog)
- New referring domains
- Organic traffic trend

Also check Google Search Console:
- Indexed page count
- Crawl stats (pages discovered vs indexed)
- Click-through rates on GHL content
