# BRAIN.md — rslaWebsite

Reference material for the RSL/A website. Rules and behavior live in CLAUDE.md.

## Positioning

"I show founders how to put AI to work, then I build it for them."

**Status:** Live at rsla.io. All TODO items complete (P0 through P4). Only careers page remains (when ready).

## Key Files

```
src/
  components/
    Seo.jsx               # Per-page SEO (title, description, OG, Twitter, canonical, robots, og:locale)
    NavbarV3.jsx           # Grid navbar with services mega-menu, Link-wrapped CTA
    FooterV2.jsx           # Light theme 5-col footer with Kit newsletter + Solutions column
    CookieConsent.jsx      # Cookie transparency banner (does not gate tracking)
    CaseStudyCard.jsx      # Shared card component used by Work.jsx and WorkInner.jsx
    PersonCard.jsx         # Shared digital business card used by Rahul.jsx and Sid.jsx
    blog/PortableTextRenderer.jsx  # Sanity rich text renderer
  pages/
    Home.jsx               # / (13 lazy-loaded sections, 3 Suspense groups, FAQ schema)
    BlogInner.jsx          # /blog/:slug (editorial layout, sticky ToC, share bar)
    WorkInner.jsx          # /work/:slug (service page cross-links via servicesUsed)
    ServiceDetail.jsx      # /services/:slug (noIndexed, links to related case studies)
    IndustryPage.jsx       # /ai-for/:slug (Hormozi-inspired pSEO template)
  lib/
    structuredData.mjs     # Global JSON-LD entity graph (#business/#website/#rahul); imported by prerender + Seo
api/
  llm/[slug].mjs           # Vercel serverless: returns markdown for any blog/case study
  subscribe.mjs            # Newsletter subscription proxy (Upstash rate limiting)
  lib/rateLimit.mjs        # Upstash Redis rate limiting utility (graceful fallback)
scripts/
  prerender.mjs            # Build-time HTML injection for AI tool visibility
  generateSitemap.mjs      # Build-time sitemap generator (with changefreq)
  generateRssFeed.mjs      # Build-time RSS feed generator (dc:creator format)
  generateLlmsTxt.mjs      # Build-time llms.txt generator (dual human + API URLs)
  pingIndexNow.mjs         # Build-time IndexNow ping (Bing, Yandex, Naver, Seznam)
content/
  posts/                   # Blog post markdown source files
  blogImages/              # Featured + inline images per post slug
  scripts/                 # Content generation and patching scripts
docs/
  seo/                     # Keyword research, content plan, triage data
  superpowers/plans/       # Implementation plans (SEO audit, pillar strategy, etc.)
  conversionResearch/      # Completed brand positioning + homepage wireframe research
.claude/
  agents/                  # Blog agents (researcher, writer, reviewer, seo)
```

## Route Architecture

| Route | Page | Indexed | Chrome |
|---|---|---|---|
| / | Home | Yes | Full |
| /about | About | Yes | Full |
| /services | Services | Yes | Full |
| /services/:slug | ServiceDetail | **No** (thin content) | Full |
| /work | Work | Yes | Full |
| /work/:slug | WorkInner | Yes | Full |
| /blog | Blog | Yes | Full |
| /blog/:slug | BlogInner | Yes | Full |
| /contact | DiscoveryCall | Yes | Full |
| /book-a-call | BookCall | No | Full |
| /booking-confirmed | BookingConfirmed | No | Full |
| /rahul | Rahul | No | Chromeless |
| /sid | Sid | No | Chromeless |
| /insider | Insider | No | Full |
| /r/:slug | LeadMagnet | No | Full |
| /privacy | Privacy | No | Full |
| /terms | Terms | No | Full |
| /disclaimer | Disclaimer | No | Full |
| /accessibility | Accessibility | No | Full |
| * (404) | NotFound | No | Full |

**Chromeless pages** (no navbar/footer): controlled by `chromelessRoutes` array in App.jsx.

## Sanity CMS

- **Project ID:** `yz25oyux`, **Dataset:** `production`, **API Version:** `2025-03-01`
- **Active schemas:** blogPostV2, caseStudyV2, leadMagnet, industryPage, author, category, blogGenerationJob
- **Legacy schemas:** blogPost, caseStudy (V1, fully migrated to V2, no longer queried)
- **Content:** 60+ blog posts, 11 case studies, 12 industry pages, 19 categories, 1 author

## SEO / AEO / GEO

- `Seo.jsx` (`useEffect`) sets `document.title`, meta tags, og:locale, and JSON-LD per page
- **Global entity graph** in `src/lib/structuredData.mjs` (single source of truth; imported by both `prerender.mjs` and `Seo.jsx`, so static HTML and hydrated DOM match): `#business` (LocalBusiness/ProfessionalService, with telephone + priceRange NAP), `#website` (WebSite), `#rahul` (Person: founder + canonical author). Emitted on every indexed page; `Seo.jsx` re-injects them on `!noIndex` routes
- **Page nodes reference the graph by `@id`** (no inline duplicates): FAQPage (home); ProfilePage→`#rahul` (about); `#business` + OfferCatalog (services); Service + BreadcrumbList (service details); CollectionPage `isPartOf`→`#website` (blog/work listings); BlogPosting (`author`→`#rahul`, `publisher`→`#business`) + BreadcrumbList + Speakable (blog posts); Article + BreadcrumbList (case studies); ContactPage `about`→`#business` (contact)
- BlogPosting schema includes: `wordCount`, `speakable` (`.tldr` + `.key-takeaways`), `dateModified` (editorial `updatedAt`, `_updatedAt` fallback)
- No fabricated review markup (a bogus GoHighLevel `aggregateRating` + third-party SoftwareApplication were removed 2026-06-03)
- Pre-rendered nav on all pages for internal link discovery
- Related posts fallback: category-matched posts when `relatedPosts` is empty
- IndexNow key: `42f4e2d222a8441d91b82a1d06d0db72`
- 68+ pre-rendered pages: 9 static, 2 listings, 34 blog, 11 case studies, 5 service details (noIndexed), 2 lead magnets (+ industry pages)
- Service detail pages cross-link to related case studies
- Case study pages cross-link to relevant service pages via `servicesUsed`
- 47 301 redirects in vercel.json (14 blog consolidations + 33 legacy URL redirects)
- llms.txt includes both human-facing URLs and LLM-optimized API endpoints
- Sitemap includes changefreq values (weekly for listings, monthly for content)
- `prefers-reduced-motion` respected across all 11 GSAP components
- Lighthouse: SEO 100, Best Practices 100, Accessibility 93

### SEO Performance (as of April 2026)
- **Organic traffic:** 15/mo (SEMRush), ~100 clicks/mo (GSC)
- **Impressions:** 350K+/mo (top 3 posts: GHL pricing 88K, Claude Code vs Cowork 70K, GHL updates 55K)
- **Keywords:** 151 ranking (2 in top 3, 21 in 4-10, 55 in 51-100)
- **Authority Score:** 7/100 (78 referring domains, 413 backlinks)
- **CTR:** <0.1% on top pages (position-based, titles are well-optimized)
- **Content split:** 80% organic from GHL content, 15% from Claude/AI content, 5% from local SEO

## Local SEO / Google Business Profile

- **Model:** Service-area business, address hidden (home-based, no walk-ins). Account is on the "no stored address" variant, so no public or back-end street address. Profile is verified.
- **Canonical NAP** (must match exactly across GBP, LeadSnap citations, and the site's LocalBusiness schema):
  - Name: `RSL/A`
  - Address: home address, hidden (pending capture for the NAP record)
  - Phone: `(661) 466-5919` (local Bakersfield; replaced the old NY 516 number)
  - Website: `https://rsla.io` (clean URL on citations; the UTM-tagged version is GBP-only)
- **Categories:** Primary `Marketing agency`. Secondaries: Internet marketing service, Website designer, Advertising agency.
- **Service areas:** Bakersfield + Kern County only. Big-city reach comes from pSEO, not GBP (GBP ranks by proximity to the verified location, not the service-area list).
- **Strategy:** No stored address means citations + reviews carry the location and prominence signal. Keep Name + Phone + Website identical everywhere. Eligibility requires some genuine in-person local client contact.
- Full config + rationale: auto-memory `project_gbp_setup.md`.

## Typography

| Font | CSS Class | Role |
|---|---|---|
| Satoshi | `.font-sans` | All UI text, headlines, body copy |
| Cormorant | `.font-cormorant` | Decorative italic only (pull quotes, captions) |

## Color Palette (Blue-Gray Theme)

| Name | Hex / Value | Tailwind |
|---|---|---|
| Background | `#F8FAFC` (slate-50) | `background` |
| Surface | `#FFFFFF` (white cards) | `surface` |
| Surface Alt | `#F1F5F9` (slate-100) | `surfaceAlt` |
| Text | `#0F172A` (slate-900) | `text` |
| Text Muted | `#64748B` (slate-500) | `textMuted` |
| Text Light | `#94A3B8` (slate-400) | `textLight` |
| Accent | `#0070F3` (brand blue) | `accent` |
| Blue Wash | `rgba(0,112,243,0.05)` | `accent-light` |

**Section alternation pattern:** surface (white) -> accent-light (blue wash) -> surfaceAlt (slate-100)

## Error Handling

- `lazyRetry()` wraps lazy imports (1 reload attempt via sessionStorage guard, then falls back to NotFound)
- `ResilientErrorBoundary`: frequency-based crash detection (3+ errors in 3s = genuine crash). Silent auto-recovery for transient errors, no `window.location.reload()`

## Industry Pages (pSEO)

12 pages live (8 industry + 4 tool pages). Paused to wait for Google indexation data.

Adding a new page requires no code changes:
1. Create in studio.rsla.io -> Industry Pages
2. Fill all fields (Hero, Pain & Stats, Before/After, FAQ required; Proof optional)
3. Publish the Sanity document
4. Next Vercel build auto-pre-renders it and adds it to the Services page grid

## Rate Limiting

API endpoints use Upstash Redis for rate limiting (`api/lib/rateLimit.mjs`).
- `/api/subscribe`: 5 requests/min per IP
- `/api/llm/[slug]`: 30 requests/min per IP
- Graceful fallback: when `UPSTASH_REDIS_REST_URL` is not set, rate limiting is skipped (functions still work)
- Env vars needed: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Env Vars

| Variable | Where | Purpose |
|----------|-------|---------|
| `SANITY_API_TOKEN` | Vercel + .env.local | Sanity write token (NO `VITE_` prefix) |
| `VITE_SENTRY_DSN` | Vercel + .env.local | Sentry error reporting |
| `VITE_KIT_FORM_ID` | Vercel + .env.local | Kit newsletter form ID (client-side) |
| `KIT_API_KEY` | Vercel + .env.local | Kit API key (server-side only, NO `VITE_` prefix) |
| `UPSTASH_REDIS_REST_URL` | Vercel | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel | Upstash Redis auth token |

## TODO (Next Session)

### Rahul (manual, 5-10 min each)
- [x] **GTM conversion tags**: Created 3 GA4 Event tags + triggers + 2 DLVs (source, cta_location) in GTM. Published as Version 5. CTA click required code-side dataLayer push (React SPA doesn't produce Click URLs). Deployed 2026-04-30.
- [ ] **GA4 Key Events**: Mark `booking_confirmed`, `newsletter_subscribe`, `cta_click` as key events in GA4 once they appear in Admin > Events (can take 24-48 hours).
- [ ] **Sentry**: Create React project at sentry.io, copy DSN, add `VITE_SENTRY_DSN` to Vercel env vars
- [ ] **Sanity token**: Current token's robot user not in project yz25oyux. Create new token inside project settings (API > Tokens > Add API token > Editor permissions). Update `.env.local` and Vercel env var `SANITY_API_TOKEN`. Also update `~/lalia/myBusiness/mcp/sanity.env`.
- [ ] **Upstash**: Create free Redis DB at upstash.com. Add `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` to Vercel env vars.
- [ ] **Backlink disavow**: In SEMRush > Backlink Audit, review Singapore/Moldova spam domains. Export disavow list. Upload to GSC Disavow Tool.

### Claude (next session)
- [ ] **Write GHL pillar page** (highest priority): Strategy at `docs/superpowers/plans/2026-04-27-pillar-page-strategy.md`. Use `/blogEngine`. Targets 88K+ monthly impressions.
- [ ] **Write AI Automation pillar page**: Targets ICP (B2B companies). Links to 6 case studies.
- [ ] **Write Local SEO pillar page**: Consolidates position 4-7 GBP rankings.
- [ ] **Expand service detail pages**: Currently noIndexed (thin content). Expand each to 800-1200 words with process, deliverables, case studies, FAQ. Re-index after.
- [ ] **Add internal links in Sanity blog posts**: Blog-to-blog and blog-to-service cross-links within post bodies. Priority: top 8 posts by impressions.
- [x] **GitHub Dependabot alert**: Updated postcss 8.5.6 -> 8.5.14 (fixes CVE XSS in CSS stringify). Alert #17 resolved.
