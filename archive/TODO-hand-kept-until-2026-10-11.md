# RSL/A Website — TODO

## P0: Claude/Anthropic Blog Content Plan (29 posts, ~53K monthly volume)

Full plan: `docs/seo/content-plan.md` | Tracker: [Google Sheet](https://docs.google.com/spreadsheets/d/1BffZHKJRirOrj-fUPBh56l9KjIlh2Wo-5fyHY-Kd-Xw/edit)

- [x] **Post 0 (Anchor):** Anthropic has 5 different Claude products. Most people are using the wrong one. — PUBLISHED 2026-03-25, slug: `anthropic-claude-products-guide`
- [x] **Drop Post:** Claude has been shipping nonstop. These are the features that actually changed how I work. — PUBLISHED 2026-03-26, slug: `claude-new-features-actually-worth-it` (combined rows 31-36)
- [x] **Post 1:** How to install Claude Code in under 3 minutes (Mac, Windows, VS Code, CLI) — PUBLISHED 2026-03-26, slug: `how-to-install-claude-code`
- [x] **Post 2:** Is Claude Actually Free? What You Get at Every Tier — PUBLISHED 2026-03-27, slug: `is-claude-free-pricing-every-tier`
- [ ] **Post 4:** Can Claude Generate Images? The Honest Answer — KD 17, 2,170 vol, Month 1
- [ ] **Post 7:** How to Make a Claude Project Public — KD 11, 1,140 vol, Month 1
- [ ] **Post 22:** How to Download Files from Claude AI — KD 22, 880 vol, Month 1
- [ ] Posts 3, 5, 8, 24, 25 — Month 2 (Claude Code deep dives)
- [ ] Posts 9, 10, 13, 14 — Month 3 (opinion + comparison)
- [ ] Posts 12, 15, 23, 6 — Month 4 (comparisons + pillar page)
- [ ] Posts 11, 16, 17, 18 — Month 5 (use case / business)
- [ ] Posts 19, 20, 21, 26, 27, 28 — Month 6 (industry + foundational)

**Rules:** Every post links to Post 0 + Post 6. Interview Rahul before writing (6 questions). Use `/blogEngine` skill. Update Google Sheet after every post.

## P0: SEO — Next Actions (from SEMRush audit 2026-03-25)

- [ ] **Domain redirects in Vercel** — Add rslmediahub.com, .net, .xyz, myrsla.com, connectrsl.com as 301 redirects to rsla.io in Vercel dashboard. Change nameservers in Hostinger to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`. (In progress — TXT verification pending for some domains)
- [ ] **Sanity blog audit** — 32 of 60 published blog posts have `publishedAt` in the future or missing, so they don't appear in sitemap or on the site. Need to audit all blogPostV2 documents and fix dates. This would take sitemap from 58 to ~90 URLs.
- [ ] **More client backlinks** — Add "Website by RSL/A" dofollow footer link to: Freedom Drivers, Spice on a Slice, United Sikhs, any other client sites Rahul built. Fieldshare already done.
- [ ] **Monitor CTR on GHL pricing page** — Check GSC in 2-3 weeks. Baseline: 0.02% CTR on 35K impressions. Target: 1%+ (350+ clicks/mo). New title/desc deployed 2026-03-25.
- [ ] **Monitor salon CRM ranking** — Check GSC for "best crm for hair salons 2025 or 2026". Baseline: position 2.97. Target: #1. New meta deployed 2026-03-25.
- [ ] **Re-run SEMRush audit in 4 weeks** (~April 22) — Measure: indexed pages (should jump), orphaned pages (should be 0), pages with 1 internal link (should drop from 42 to under 10), keyword positions.
- [ ] **Commercial-intent landing pages** — Create content targeting: "AI automation agency", "GoHighLevel setup service", "marketing automation consultant". These are buying-intent keywords with zero current content. (Deferred — discuss in future session)
- [ ] **Backlink outreach to GHL ecosystem** — Guest posts on ghlcentral.com, gohighimpact.co. Share content in GHL Facebook groups. (Deferred — manual relationship work)
- [ ] **Request re-indexing in GSC** — Submit for re-indexing: /blog/go-high-level-pricing, /blog/best-crm-hair-stylists-salon-owners, /blog/go-high-level-new-features-2025, /blog/ai-lead-follow-up-system

## P0: Programmatic SEO — Next Actions

- [ ] **WAIT: Check Google Search Console indexation** in 2 to 4 weeks (around April 6 to 13). Target: 9+ of 12 pages indexed. If under 60%, template needs more unique content before scaling.
- [ ] Add more industry pages: law firms, financial advisors, small business, marketing agencies, salons, mortgage brokers (BLOCKED: wait for indexation data first)
- [ ] Add service pages: voice agents, AI receptionist, chatbots, database reactivation, lead nurturing, email automation, appointment booking, sales automation (8 pages, next batch after industries)
- [ ] Add comparison pages: GHL vs HubSpot, GHL vs Salesforce, GHL vs Pipedrive, etc. (10 pages)
- [ ] Build a `/solutions` directory page listing all industry pages (optional, for browsing)
- [ ] Track which pages rank and for which keywords (consider SerpBear self-hosted tracker)
- [x] Add "Industries We Serve" grid to Services page — DONE
- [x] Add "Solutions" column to footer — DONE
- [x] Add tool pages: GoHighLevel, n8n, Make, Zapier — DONE (4 pages live)

## P1: Bug Fixes

- [x] Fix blank page on first visit (lazy chunk retry + error boundary recovery)
- [x] Fix invisible page content after navigation (ScrollTrigger kill bug in useScrollToTop)
- [x] Fix hero CTA buttons flashing before GSAP entrance animation
- [x] Fix secondary hero CTA "stuck" during load (transition-all fighting GSAP)
- [x] Fix "Something went wrong" error flash on mobile Safari navigation (error boundary rewrite, removed reload race condition)
- [x] Fix GSAP hero content flash on nav pages (opacity-0 CSS on About, Services, HowItWorks, StartHere)
- [x] Fix blog ToC active heading not highlighting on scroll/click (ID mismatch + IntersectionObserver → scroll listener + threshold alignment)

## P2: Logo Marquee — Completed This Session

- [x] Merge two rows into single continuous row (fixes gap on second row)
- [x] Change heading to "We have worked with"
- [x] Reorder logos — high-profile names visible when user scrolls to section

## P3: Future (New Features)

- [~] Individual service pages — not needed for now, current /services covers it
- [~] Pricing page — not needed, custom quotes only
- [~] FAQ page — not needed, FAQ section lives on homepage
- [ ] Careers page (when ready)

## P4: Infrastructure

- [x] Update Vercel CLI (48.10.11 → latest)
- [x] Pre-render all indexed pages including industry pages (53 pages total)
- [x] Pre-render ALL pages (legal, utility, contact) for non-JS crawlers — 68 total
- [x] Performance pass: WOFF2 fonts, WebP images, split Suspense, deferred Sentry
- [x] npm audit: 0 vulnerabilities
- [ ] Add `localhost:5175` to Sanity CORS origins (local dev falls to non-whitelisted ports when 5173/5174 are in use)

## P5: Privacy & Compliance

- [x] Add Instagram Messaging API (Meta) to Privacy Policy Section 5 + DM Automation disclosure

## SERP Site Name

- Technical implementation is correct (WebSite JSON-LD, og:site_name, title all say "RSL/A")
- User submitted re-index request in Google Search Console
- Google just needs time to process — no code changes needed
- Check back in 2-4 weeks

---

## Completed (SEMRush SEO Session — 2026-03-25)

- [x] SEMRush full site audit analysis (CSVs, screenshots, on-page SEO checker)
- [x] GSC performance data analysis (queries, pages, countries, devices)
- [x] Sitemap: added 12 industry pages, removed noindex /book-a-call (47→58 URLs)
- [x] Pre-rendered nav: site navigation added to all pre-rendered pages
- [x] Fixed broken blog: ai-lead-follow-up-system (future-dated → published today)
- [x] Fixed broken blog: answer-engine-optimization-aeo-guide (301 → aeo-for-local-businesses)
- [x] Fixed broken external link on GHL pricing page (support → help.gohighlevel.com)
- [x] Blog heading hierarchy: H3→H2 in pre-rendered blog listing
- [x] Related Posts fallback: category-based auto-matching when no curated picks
- [x] GHL pricing CTR optimization (title + meta + SoftwareApplication schema)
- [x] Salon CRM post optimized for #1 push (title targets "hair salons" not "hair stylists")
- [x] GHL changelog freshness signal (March 2026 in title/meta, updatedAt refreshed)
- [x] Fieldshare dofollow footer backlink added
- [x] SEO_ACTION_PLAN.md created with full prioritized analysis

## Completed (Previous Sessions)

<details>
<summary>2026-03-20: Bug Fixes + Marquee + Programmatic SEO</summary>

- [x] Fix blank page on first visit (lazyRetry wrapper, PageLoader, error boundary overhaul)
- [x] Fix invisible page content (removed ScrollTrigger kill from useScrollToTop)
- [x] Fix hero CTA flash (added opacity-0 CSS class)
- [x] Fix hero CTA stuck animation (transition-all → transition-colors)
- [x] Merge marquee to single row, reorder logos, change heading
- [x] Keyword research: 370+ keywords from Google Autocomplete
- [x] Sanity schema: industryPage document type (6 field groups, optional proof)
- [x] IndustryPage.jsx template: Hormozi-inspired dark hero, before/after, stats, FAQ
- [x] Wire IndustryPage to Sanity CMS (GROQ queries, dynamic fetch)
- [x] Add pre-rendering for industry pages in prerender.mjs
- [x] 8 industry pages researched, written, and published:
  - Real Estate (60x ROAS proof, salon suite case study linked)
  - Healthcare (no proof)
  - Accounting (no proof)
  - Contractors ($15K recovered proof, Housecall Pro case study linked)
  - E-commerce (no proof)
  - Restaurants (132 reviews proof, pizza restaurant case study linked)
  - Dental (no proof)
  - Insurance (no proof)
- [x] 4 tool pages researched, written, and published:
  - GoHighLevel (4-week SaaS build proof, AdReviveAI case study linked)
  - n8n (no proof)
  - Make (no proof)
  - Zapier (no proof)
- [x] Industries grid on /services page (auto-grows from Sanity)
- [x] Solutions column added to footer (first 6 + "View all")
- [x] Production deploy: 57 pre-rendered pages (12 pSEO pages)
- [x] Sitemap submitted to Google Search Console
</details>

<details>
<summary>Previous sessions (P0–P4, Phase 6–7)</summary>

- [x] All P0 through P4 items from previous sessions
- [x] Phase 6: Performance & Launch (Lighthouse 96/95/96/92)
- [x] Phase 7: UI Component Implementation (Magic UI, shadcn, etc.)
- [x] Phase 8: Performance Optimization (fonts, images, Sentry, code splitting)
</details>
