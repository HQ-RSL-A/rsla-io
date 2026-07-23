# SEO Implementation Plan

**Created:** April 30, 2026
**Data sources:** April 2026 SEO Audit, March 2026 Action Plan, GSC Analysis, Blog Triage Table, Keyword Research (198 keywords), Content Plan
**Goal:** Rank organically, improve CTR, drive lead bookings
**Relevant topics only:** Claude/AI, websites, SEO/AEO/GEO, GoHighLevel

---

## The Problem in One Sentence

The site has 213,000+ impressions per month but converts 0.18% of them to clicks because titles and meta descriptions are weak, half the pages have no internal links, and there's zero commercial-intent content connecting "I found this blog" to "I want to hire this agency."

---

## Phase 1: Kill Dead Weight

**Why first:** Every low-quality page dilutes the site's quality signals. Google crawled 131 pages and chose not to index them. Removing junk content tells Google "index what's left, it's all good."

**Timeline:** Do before anything else.

### Posts to Delete/Archive (25 posts)

These have zero clicks, no authority, and fall outside the Claude/AI/SEO/GHL filter. Set status to `archived` in Sanity (which adds noindex). Add 301 redirects where a relevant keeper post exists.

#### GHL Verticals Without Client Experience (6)

| Slug | Impressions | Position | Redirect To |
|------|------------|----------|-------------|
| best-crm-for-hvac-companies-2026 | 844 | 44.6 | /blog/what-is-go-high-level |
| automate-quote-follow-ups-contractors | 383 | 14.2 | /blog/gohighlevel-workflow-automations-guide |
| best-crm-solo-real-estate-agent-2026 | 367 | 16.7 | /blog/what-is-go-high-level |
| automate-real-estate-lead-nurturing | 301 | 21.7 | /blog/gohighlevel-lead-follow-up-automation |
| gohighlevel-for-home-services-guide-2026 | 0 | -- | /blog/what-is-go-high-level |
| gohighlevel-sms-marketing-setup | 0 | -- | /blog/gohighlevel-workflow-automations-guide |

#### Salon Posts Covered by Keeper Hub (5)

One salon hub post is kept (best-crm-hair-stylists-salon-owners). These are redundant.

| Slug | Impressions | Position | Redirect To |
|------|------------|----------|-------------|
| salon-appointment-reminder-automation | 1,052 | 7.8 | /blog/best-crm-hair-stylists-salon-owners |
| gohighlevel-for-salons-setup-guide | 147 | 6.8 | /blog/best-crm-hair-stylists-salon-owners |
| gohighlevel-vs-vagaro-salon-comparison | 134 | 7.8 | /blog/best-crm-hair-stylists-salon-owners |
| salon-client-retention-automated-strategies | 729 | 7.5 | /blog/best-crm-hair-stylists-salon-owners |
| get-more-salon-reviews-automated | 83 | 7.3 | /blog/best-crm-hair-stylists-salon-owners |

#### Restaurant Posts Covered by Keeper Hub (3)

One restaurant hub post is kept (gohighlevel-for-restaurants-fill-tables). These are redundant.

| Slug | Impressions | Position | Redirect To |
|------|------------|----------|-------------|
| restaurant-email-marketing-build-lists | 455 | 36.0 | /blog/gohighlevel-for-restaurants-fill-tables |
| get-more-restaurant-reviews-google-yelp | 150 | 13.5 | /blog/gohighlevel-for-restaurants-fill-tables |
| restaurant-sms-marketing-fill-slow-nights | 41 | 7.6 | /blog/gohighlevel-for-restaurants-fill-tables |

#### Generic / Off-Topic (8)

| Slug | Impressions | Position | Redirect To |
|------|------------|----------|-------------|
| cold-emails-not-getting-replies-fix | 1,002 | 10.5 | none (no relevant keeper) |
| top-no-code-tools-for-marketers-2026 | 443 | 6.8 | none |
| why-am-i-losing-leads-5-signs | 350 | 10.9 | none |
| why-marketing-isnt-working-automation-gap | 491 | 9.1 | none |
| complete-seo-audit-guide | 102 | 22.1 | none |
| cost-of-manual-lead-follow-up | 84 | 5.6 | /blog/lead-response-time-how-fast |
| ai-marketing-automation-2026 | 47 | 29.5 | none |
| boost-support-with-conversational-ai | 24 | 9.0 | none |

#### Future-Dated Posts to Cancel (3)

These are scheduled but not yet live. Cancel before they publish.

| Slug | Scheduled Date | Why Cancel |
|------|---------------|------------|
| google-gemini-for-business-pricing-guide | Mar 31 | Generic Gemini pricing. Not Claude, not core. |
| google-gemini-marketing-prompts | Apr 21 | Generic prompts listicle. Not authority zone. |
| best-ai-tools-service-business-marketing | Apr 28 | Generic tools roundup. Not authority zone. |

### Posts to Consolidate (3)

Merge unique content into the keeper post, then 301 redirect the old URL.

| Slug | Impressions | Merge Into | What to Keep |
|------|------------|------------|-------------|
| gohighlevel-vs-keap-crm-comparison | 903 | gohighlevel-vs-hubspot-comparison | Keap pricing data, feature comparison table |
| gohighlevel-email-sequences-convert | 509 | gohighlevel-workflow-automations-guide | Email sequence setup steps, template examples |
| go-high-level-for-real-estate-agents | 744 | what-is-go-high-level | Real estate use case section |

**Phase 1 net result:** Site goes from ~60 live posts to ~32 focused, relevant posts. Google stops wasting crawl budget on 25+ low-quality pages.

---

## Phase 2: Fix CTR on Existing Rankings

**Why second:** These pages are already on page 1. They already have 213K+ monthly impressions. The only thing between impressions and clicks is the title and meta description that appears in search results. This is the single highest-ROI work.

**Timeline:** Immediately after Phase 1.

### Priority A: Page 1 Rankings with Catastrophic CTR (5 posts)

These posts rank position 5-8 with massive impressions but near-zero clicks. Rewrite title tags and meta descriptions in Sanity. Each rewrite should include specific numbers, current year, and a reason to click.

| # | Slug | Impressions | Clicks | CTR | Position | Action |
|---|------|------------|--------|-----|----------|--------|
| 1 | go-high-level-pricing | 88,225 | 21 | 0.02% | 8.4 | Add specific prices ($97/$297/$497) and "2026" to title. Meta should promise a comparison or cost breakdown. |
| 2 | claude-code-vs-cowork-vs-claude-app | 70,201 | 90 | 0.13% | 7.6 | Make meta more decisive. Something like: "Code for terminal. Cowork for background tasks. Chat for conversation. 30-second guide." |
| 3 | go-high-level-new-features-2025 | 55,032 | 38 | 0.07% | 5.9 | URL says 2025 but content covers 2026. Rename slug to 2026, 301 from old URL. Add "Updated [Month] 2026" to title. |
| 4 | claude-code-remote-control-guide | 12,283 | 15 | 0.12% | 7.3 | Sharpen meta. Emphasize the unique angle (controlling Claude Code remotely). |
| 5 | anthropic-claude-products-guide | 3,837 | 45 | 1.17% | 6.1 | Already best CTR of the group. Minor refinement. Focus on internal links to boost position. |

**Expected impact:** If CTR improves from 0.02-0.13% to even 1%, that's:
- GHL pricing: 88K imp x 1% = 880 clicks/month (currently 21)
- Claude comparison: 70K imp x 1% = 700 clicks/month (currently 90)
- GHL updates: 55K imp x 1% = 550 clicks/month (currently 38)
- Total potential: ~2,100+ clicks/month from 3 posts alone

### Priority B: Striking Distance Keywords (Position 5-15)

These are close to page 1 or barely on page 1. Title/meta rewrites plus internal links can push them into click range.

| # | Slug | Key Query | Impressions | Position | Action |
|---|------|-----------|------------|----------|--------|
| 6 | gohighlevel-vs-jobber-home-service-crm | "gohighlevel vs jobber" | 1,550 | 7.3 | Sharpen meta. Add "integration" to H2. |
| 7 | what-is-go-high-level | "what is go high level" | 2,371 | 13.3 | Needs to move from page 2 to page 1. Expand content, add internal links. |
| 8 | gohighlevel-vs-hubspot-comparison | "gohighlevel vs hubspot" | 1,701 | 15.6 | Absorb Keap content (Phase 1 consolidation). Add feature tables. |
| 9 | gohighlevel-lead-follow-up-automation | "gohighlevel automation" | 1,181 | 10.4 | Edge of page 1. Internal links + meta refresh. |
| 10 | gohighlevel-workflow-automations-guide | "gohighlevel workflows" | 992 | 12.2 | Absorb email sequences content. Expand. |
| 11 | gohighlevel-funnel-tutorial-high-converting | "gohighlevel funnel" | 983 | 11.7 | Close to page 1. Internal links from other GHL posts. |

---

## Phase 3: Rewrite Keeper Posts with Experience Injection

**Why third:** Phases 1-2 are metadata and structural changes. This phase is full content rewrites using the `/blogEngine` interview process. Order is by traffic potential.

**Timeline:** 2-3 posts per week. Each post goes through the full pipeline: interview, outline, draft, voice audit, Sanity update, image generation, publish, cross-link.

### Batch 1: GHL Money Posts (4 posts)

These drive the most impressions and target your highest-value audience (small business owners looking for GHL help).

| Order | Slug | Why First |
|-------|------|-----------|
| 1 | go-high-level-pricing | 88K impressions. The #1 money keyword. Needs real pricing experience, comparison tables, recommendation. |
| 2 | go-high-level-new-features-2025 (rename to 2026) | 55K impressions. Position 5.9. Add monthly sections with H2s. Make it the definitive changelog. |
| 3 | what-is-go-high-level | Foundational pillar. Every other GHL post links here. Absorb RE agents content from consolidation. |
| 4 | gohighlevel-vs-hubspot-comparison | Absorb Keap content. Become "GHL vs The Competition" hub. Side-by-side feature tables. |

### Batch 2: Claude/AI Posts (5 posts)

Your growth bet. Claude content is emerging with good positions and you have genuine daily-use authority.

| Order | Slug | Why |
|-------|------|-----|
| 5 | claude-code-vs-cowork-vs-claude-app | 70K impressions at position 7.6. Your second-biggest traffic opportunity. Needs decisive product recommendations. |
| 6 | claude-code-remote-control-guide | 12K impressions at position 7.3. Niche feature with zero competition. |
| 7 | what-is-claude-code-guide | Foundational pillar for Claude cluster. Every Claude post links here. |
| 8 | anthropic-claude-products-guide | Best CTR (1.17%). Already working. Expand and strengthen. |
| 9 | claude-code-marketing-agency-workflow | STRONGEST personal experience post. How RSL/A actually runs on Claude. |

### Batch 3: GHL Practical Guides (4 posts)

| Order | Slug | Why |
|-------|------|-----|
| 10 | gohighlevel-vs-jobber-home-service-crm | Position 7.3. Real comparison experience. Add integration section. |
| 11 | gohighlevel-lead-follow-up-automation | Position 10.4. Core GHL functionality. |
| 12 | gohighlevel-workflow-automations-guide | Position 12.2. Absorb email sequences content. |
| 13 | gohighlevel-funnel-tutorial-high-converting | Position 11.7. Conversion-focused. |

### Batch 4: Remaining Keepers (13 posts)

| Order | Slug | Category |
|-------|------|----------|
| 14 | best-crm-hair-stylists-salon-owners | GHL vertical (has client experience) |
| 15 | gohighlevel-for-restaurants-fill-tables | GHL vertical (has client experience) |
| 16 | how-to-rank-higher-on-google-maps | Local SEO |
| 17 | google-business-profile-optimization-guide-2026 | Local SEO |
| 18 | lead-response-time-how-fast | AI/Automation |
| 19 | ai-replacing-google-traffic | AEO |
| 20 | openclaw-ai-assistant-security-lessons | Claude/AI |
| 21 | claude-code-vs-cursor-vs-github-copilot | Claude/AI comparison |
| 22 | mcp-servers-explained-ai-integrations | Claude/AI |
| 23 | claude-md-file-ai-context-guide | Claude/AI |
| 24 | claude-code-hooks-automation-guide | Claude/AI |
| 25 | ai-coding-agents-productivity-panic | Claude/AI opinion |
| 26 | anthropic-computer-use-guide | Claude/AI |

### Batch 5: Future-Dated Keepers (5 posts)

These are scheduled in Sanity. Rewrite before they go live.

| Slug | Scheduled | Category |
|------|-----------|----------|
| ai-marketing-stack-what-we-use | Mar 17 | AI (personal experience) |
| aeo-for-local-businesses | Mar 24 | AEO + Local SEO |
| ai-lead-follow-up-system | Apr 7 | AI automation |
| gemini-vs-chatgpt-vs-claude-for-business | Apr 14 | AI comparison |
| automate-client-intake-ai | May 5 | AI automation |

---

## Phase 4: New Content Production

**Why fourth:** Fix what exists before creating more. But this is where long-term organic growth comes from.

### 4A: Commercial-Intent Content (Missing Entirely)

The site ranks for "what is GHL" but not for "I need someone to set up GHL for me." These posts bridge information to lead booking.

| Post Title | Target Keywords | Volume | Why |
|-----------|----------------|--------|-----|
| GoHighLevel Setup Service: What It Costs and What You Get | "gohighlevel setup service", "ghl setup cost" | Low but high buying intent | Direct service page. Links from all GHL content. |
| AI Automation Agency vs Doing It Yourself | "ai automation agency", "ai marketing agency" | ~500+ combined | Comparison content with commercial intent. Positions RSL/A as the answer. |
| When to Hire a Marketing Automation Consultant | "marketing automation consultant" | ~300+ | Buying guide. Captures people ready to pay. |

### 4B: Claude/Anthropic Content Plan (from content-plan.md)

29 posts planned with full keyword research. Publishing order by tier:

**Month 1 - Quick Wins (KD under 25, rank fast):**

| Post | Primary Keyword | Volume | KD |
|------|----------------|--------|-----|
| Post 0: Anthropic Has 5 Different Claude Products (anchor) | claude ai vs claude code | 8,120+ combined | varies |
| Post 1: How to Install Claude Code | how to install claude code | 2,930 combined | 23 |
| Post 2: Is Claude Actually Free? | is claude free | 6,890 combined | 26 |
| Post 4: Can Claude Generate Images? | can claude generate images | 2,170 combined | 17 |
| Post 7: How to Make a Claude Project Public | how to make claude project public | 1,140 | 11 |
| Post 22: How to Download Files from Claude AI | how to download file from claude ai | 880 | 22 |

**Month 2 - Claude Code Deep Dives:**

| Post | Primary Keyword | Volume | KD |
|------|----------------|--------|-----|
| Post 3: How to Write a CLAUDE.md | how to write claude.md | 320+ | 27 |
| Post 5: MCP Servers Setup Guide | how to use mcp claude free plan | 1,430 combined | 12 |
| Post 8: Which Claude Model to Pick | how to change model in claude code | 1,640 combined | 23 |
| Post 24: Sync Claude Code Across Devices | sync claude code multiple devices | 1,600 | 21 |
| Post 25: How to Update Claude Code | how to update claude code | 1,270 combined | 33 |

**Month 3 - Opinion and Comparison:**

| Post | Primary Keyword | Volume | KD |
|------|----------------|--------|-----|
| Post 9: Is Claude Max Worth It? | is claude pro worth it | 910 combined | 10 |
| Post 10: Built My Website with Claude Code | can claude code build a website | 320+ | 27 |
| Post 13: Ditched Cursor for Claude Code | claude code vs cursor | 1,170 combined | 25 |
| Post 14: Claude Code vs Copilot vs Codex vs Gemini CLI | claude code vs copilot | ATP | -- |

**Months 4-6:** Posts 6, 11, 12, 15-21, 23, 26-28 (see content-plan.md for details)

### 4C: SEO/AEO/GEO Content (New)

No posts currently target these as a service offering. Write after commercial-intent content.

| Post Title | Target Keywords | Why |
|-----------|----------------|-----|
| AEO for Small Businesses: How to Get Cited by AI Search | "answer engine optimization", "AEO" | Core service offering. No existing content after archiving the generic AEO guide. |
| GEO: How to Rank in AI-Generated Search Results | "generative engine optimization", "GEO" | Emerging topic. First-mover advantage. |
| SEO vs AEO vs GEO: What Actually Matters in 2026 | "SEO vs AEO", "SEO in 2026" | Pillar comparison post. Positions RSL/A as forward-thinking. |

---

## Phase 5: Internal Linking

**When:** Continuously during Phases 2-4. Every time a post is rewritten or published, add cross-links.

### Cluster Map

Every post belongs to a cluster. Posts within a cluster must link to each other.

**GHL Cluster:**
- Hub: what-is-go-high-level
- Spokes: pricing, new features, vs-hubspot, vs-jobber, lead follow-up, workflows, funnels, salon CRM, restaurant
- Rule: Every GHL post links to the hub. Hub links to all spokes.

**Claude/AI Cluster:**
- Hub: what-is-claude-code-guide (existing) + Post 0 anchor (new)
- Spokes: all Claude Code posts, comparison posts, agency workflow post
- Rule: Every Claude post links to both hubs.

**SEO/AEO/GEO Cluster:**
- Hub: SEO vs AEO vs GEO comparison (new, Phase 4C)
- Spokes: Local SEO posts, AEO post, GEO post, Google Maps guide, GBP guide
- Rule: Cross-link all. Link from service pages.

**Commercial Cluster:**
- Hub: Services page (/services)
- Spokes: GHL setup service post, AI automation agency post, consultant hiring guide
- Rule: Every informational post has a contextual CTA linking to a commercial post or /book-a-call.

### Internal Link Targets Per Rewrite

When rewriting any post, add:
- 2-3 links to other posts in the same cluster
- 1 link to a post in a different cluster (topical bridge)
- 1 link to a commercial-intent page (/services, /book-a-call, or a commercial post)

---

## Phase 6: Ongoing Content Strategy

### Publishing Cadence

- **Weeks 1-4:** Phase 1 (cleanup) + Phase 2 (meta rewrites) + start Phase 3 Batch 1
- **Weeks 5-12:** Phase 3 Batches 1-3 (rewrites, 2-3 posts/week)
- **Week 6+:** Begin Phase 4A (commercial-intent, 1 post/week alongside rewrites)
- **Week 10+:** Begin Phase 4B (Claude content plan, 1-2 posts/week)
- **Week 16+:** Phase 4C (SEO/AEO/GEO content)
- **Ongoing:** Phase 3 Batches 4-5 as capacity allows

### Evergreen Updates

| Post | Update Frequency | Trigger |
|------|-----------------|---------|
| GHL pricing | Quarterly | GHL changes pricing |
| GHL new features/changelog | Monthly | GHL ships updates |
| Claude products guide | Quarterly | Anthropic ships new products |
| Any comparison post | Quarterly | Competitor ships features |

### Measurement

Track monthly in GSC and SEMRush:

| Metric | Current (April 2026) | 30-Day Target | 90-Day Target |
|--------|---------------------|---------------|---------------|
| Organic CTR | 0.18% | 1%+ | 2%+ |
| Organic clicks/month | ~80 | 300 | 500+ |
| Indexed pages | 52 | 35 (fewer but all quality) | 50+ (quality + new content) |
| Pages with 1 internal link | 46 | <15 | <5 |
| Lead bookings from organic | 0 | 1 | 3+/month |

### Content Decision Filter

Before writing any new post, it must pass all three:

1. **Topic filter:** Is it about Claude/AI, websites, SEO/AEO/GEO, or GHL?
2. **Experience filter:** Does Rahul have genuine experience or opinion to inject?
3. **Intent filter:** Will the reader either (a) learn something that makes them trust RSL/A, or (b) be one click away from booking a call?

If it fails any of the three, don't write it.

---

## Execution Order Summary

| Phase | What | Posts Affected | Key Metric |
|-------|------|---------------|------------|
| 1 | Delete/archive 25 posts, consolidate 3, cancel 3 future | 31 posts removed | Crawl budget freed, quality signals improved |
| 2 | Rewrite title tags and meta descriptions | 11 posts | CTR from 0.18% toward 1%+ |
| 3 | Full content rewrites with experience injection | 31 keeper posts in 5 batches | Content quality, position improvements |
| 4A | Write commercial-intent content | 3 new posts | Lead booking pipeline |
| 4B | Write Claude/Anthropic content plan | 29 new posts over 6 months | New keyword coverage, 53K+ monthly search volume |
| 4C | Write SEO/AEO/GEO content | 3 new posts | Service offering visibility |
| 5 | Internal linking across all content | All posts | Orphaned pages from 46 to <5 |
| 6 | Ongoing measurement and iteration | -- | CTR, clicks, bookings |
