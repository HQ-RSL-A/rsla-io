# LOG.md - rslaWebsite

## 2026-05-06 - Newsletter Signup Redesign (The Insider)

### What happened
Complete redesign of all newsletter signup placements across the site. New "The Insider" branding with Caveat handwritten font, consistent messaging, and cohesive visual identity across three placements.

### Fonts added
- **Caveat** (Regular + Bold): self-hosted WOFF2, downloaded from Google Fonts, converted via fontTools. Added `@font-face` in `index.css` and `font-caveat` to Tailwind config. Used for newsletter headings, signatures, and branding.

### Assets added
- `public/fonts/Caveat-Regular.woff2`, `public/fonts/Caveat-Bold.woff2`
- `public/images/tape.png` (26KB): rasterized from vector tape asset, color-shifted via CSS filter to warm beige
- `public/images/envelope.svg`: envelope icon for blog grid card
- `public/images/rahul.webp`: existing headshot, now used in Insider page polaroid
- Original tape SVG saved to `myBusiness/uiComponents/assets/tornTape.svg` for future use

### Assets removed
- `public/images/paperclip.svg`: tested and rejected in favor of tape

### Messaging (finalized)
- **Headline**: "Every Tuesday, I send one thing you can use that day to make your business more money."
- **Descriptor**: "The Insider delivers one tested growth system every week you can apply to your business and see results."
- **Card body (Insider page)**: "One thing you can apply to your business that day and see results."
- **Card body (blog inner)**: "Liked this? Every Tuesday I send one growth system you can apply to your business that day and see results."

### Placement 1: Insider page (`/insider`)
- Full landing page with headline (Caveat) + descriptor (Satoshi) above card
- Polaroid photo of Rahul with realistic torn-edge tape, -4deg rotation
- "A Weekly Note" heading in Caveat 34px
- Blue wavy SVG underline on "business"
- "- Rahul" signature in brand blue
- Email form + "Get The Insider" button (rounded-xl, bg-accent)
- "No spam, unsubscribe anytime. Privacy Policy" footnote below card
- Background: `bg-surface` (seamless with navbar)
- Removed: FlickeringGrid background, benefits list, TextAnimate

### Placement 2: Blog inner CTA (`InlineNewsletterCta.jsx`)
- Sits between "The Bottom Line" and author bio on every blog post
- "A Weekly Note" + "THE INSIDER" label (no photo, since author bio is directly below)
- Blue wavy underline on "growth system"
- Horizontal form (input + button side by side)
- Card shadow/border matched to sticky ToC sidebar: `border-gray-200/60`, `shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.08)]`

### Placement 3: Blog listing grid card (`NewsletterGridCard.jsx`)
- New component extracted from Blog.jsx (old inline NewsletterCard removed)
- Based on v5t-tweakable design: Caveat heading, envelope illustration with RL badge, blue gradient background
- All accent colors updated from `#0046FF` to `#0070F3` (brand blue)
- Input/button changed from pill-shaped to rounded-xl matching site patterns
- Envelope has radial glow, drop shadow, and flap fill for depth

### Placements skipped
- **Lead magnet page** (`/resources/:slug`): different intent (gating downloads), left as-is
- **Portable text embed** (Sanity CMS): optional per-post block, redundant with bottom CTA

### Design engineering polish (Emil Kowalski review)
- Replaced JS `focused` state with CSS `focus:` selectors on Insider + Inline (grid card already correct)
- Added `active:scale-[0.97]` press feedback to all submit buttons
- Specified exact transition properties: `transition-[border-color,box-shadow]` on inputs, `transition-[background-color,transform]` on buttons
- Consistent `duration-150 ease-out` timing across all components
- Removed unused style properties (`btn`, `inputBg`) from grid card

### Audit results
- No dead code remaining across all three placements
- No stale references (MagicCard import removed, old NewsletterCard function deleted)
- All accent colors consistent at `#0070F3`
- All form IDs reference `VITE_KIT_FORM_ID` env var with `9130465` fallback
- All placements fire `newsletter_subscribe` GTM event with unique source tags

### Files changed
- `src/pages/Insider.jsx` - full redesign
- `src/components/blog/InlineNewsletterCta.jsx` - redesigned
- `src/components/blog/NewsletterGridCard.jsx` - new component
- `src/pages/Blog.jsx` - swapped to NewsletterGridCard, removed old function + MagicCard import
- `src/index.css` - Caveat @font-face declarations
- `tailwind.config.js` - added `font-caveat`

---

## 2026-05-06 - Blog Inner + Listing Page Redesign (Riverside-matched)

### What happened
Full redesign of the blog inner page and listing page, matching Riverside's editorial blog layout and typography. Both pages reviewed with Emil Kowalski's design engineering skill for animation/interaction polish.

### Blog Inner Page
- **Header**: dark bg (#0A0A0A), secondary text (#CBD5E1), WCAG AAA contrast on all elements
- **Typography**: Riverside-matched sizing (18px body/30px lh, 28px h2/34px lh, 22px h3/28px lh), Satoshi throughout (Cormorant tested and rejected)
- **Featured image**: 1.6:1 aspect ratio (was 1.9:1), srcset with 500w/800w/1080w/1260w via Sanity CDN
- **ToC sidebar**: Chameleon-style white card (layered shadow, progress bar with % complete, active blue indicator, "Back to Blog" link, post title)
- **Summarize this article**: ChatGPT, Claude, Perplexity, Gemini links with brand SVG icons, centered in ToC card on desktop, inline after TL;DR on mobile
- **Mobile layout**: removed ToC, reordered to title > excerpt > author > image > date > reading time
- **Bottom Line**: removed box/card, now separated by top border divider
- **Author section**: subtle "wrote this" attribution, smaller image (48px), compact layout, share bar below
- **Removed**: top reading progress bar (replaced by sidebar progress), mobile ToC
- **Cleaned**: unused firstCategory var, stale height attribute, duplicated aiLinks arrays, no-op animationDelay

### Blog Listing Page
- **Mobile featured post**: Riverside layout (title > category > date > excerpt > author + role > image), no card wrapper
- **Desktop featured post**: card wrapper (white bg, border, shadow), image flush top, padded content
- **Post cards**: card wrappers everywhere (bg-white, rounded-xl, border-gray-100, shadow-sm), horizontal on mobile (thumbnail left, title/category/date right)
- **Trending sidebar**: card wrapper on desktop for visual division from featured post
- **H1 SEO fix**: added visible "BLOG" H1 on first page (uppercase, small, muted)
- **Mobile grid gap**: reduced from 50px to 16px between cards
- **Hero query**: added author `role` field (was missing, role not rendering)
- **Cleaned**: dead "Scrollable filter tabs" comment, orphan md:order-none class

### Consistency pass
- Category pills: unified to `bg-accent/8 border-accent/15 rounded font-medium text-xs uppercase` everywhere
- Author images: `rounded-lg` (square) everywhere (header, bio, listing cards, featured)
- Card style: `bg-white rounded-xl border border-gray-100 shadow-sm` on all cards (post cards, related posts, trending sidebar)
- Related posts (BlogInner): matched card style, consistent category pills
- Dividers: gray-100 inside cards, gray-200 at page level

### Emil design polish
- All `transition-colors` given explicit `duration-150 ease-out`
- AI icon hover: `scale-105` (was 110), added `active:scale-95` press feedback
- ToC active indicator: added `ease-out` easing
- Featured image hover: `duration-md` (was `duration-lg`, felt slow)
- Pagination buttons: explicit timing
- Trending sidebar links: `active:opacity-80` press feedback

### Files changed
- `src/pages/BlogInner.jsx` - inner page redesign
- `src/pages/Blog.jsx` - listing page redesign
- `src/components/blog/PortableTextRenderer.jsx` - Riverside typography (18px body, 28px h2, 22px h3)
- `src/sanity/lib/queries.ts` - added author role to hero query
- `public/images/ai/` - ChatGPT, Claude, Perplexity, Gemini SVG icons (new)

---

## 2026-05-06 - Fix GSC "Page with redirect" Indexing Issues

### Problem
Google Search Console emailed that validation failed for "Page with redirect" on rsla.io. GSC report showed 180 not-indexed pages across 7 categories: 12 "Page with redirect", 11 "Soft 404", 132 "Crawled - currently not indexed", and others.

### Root cause
Trailing-slash versions of redirect source URLs (e.g. `/blog/old-slug/`) bypassed the 301 redirects in vercel.json and fell through to the SPA catch-all rewrite, returning 200 with the empty React shell instead of redirecting. Google crawled both `/blog/old-slug` (got 301, correct) and `/blog/old-slug/` (got 200, broken).

Additionally, 5 URLs flagged by GSC had no redirect rules at all: `/work/cleaning-company-automation`, `/work/facebook-ads-reporting-automation`, `/blog/gohighlevel-sms-marketing-setup`, and old WordPress `/product/` and `/product-category/` URLs.

### Investigation steps
1. Checked vercel.json redirects for chain redirects (none found)
2. Verified sitemap only contains canonical destination URLs (clean)
3. Searched source code for internal links to redirect source URLs (none)
4. Confirmed all redirect destinations return HTTP 200
5. Tested trailing-slash variants of redirect sources and discovered they return 200 instead of 301
6. Downloaded and analyzed all three GSC drilldown CSVs (Page with redirect, Soft 404, Crawled - currently not indexed)
7. Cross-referenced GSC-flagged URLs against vercel.json redirect rules to find gaps

### Changes (vercel.json)
- Added `"trailingSlash": false` so Vercel auto-strips trailing slashes with 308 before evaluating redirect rules
- Removed 5 now-redundant trailing-slash redirect duplicates (`/resources/`, `/contact-us/`, `/about-us/`, `/crm-for-small-business/`, `/terms-and-conditions/`, `/lead-gen-casagrande-salon-nyc/`)
- Added 5 missing redirects: `/work/cleaning-company-automation` -> `/work`, `/work/facebook-ads-reporting-automation` -> `/work`, `/blog/gohighlevel-sms-marketing-setup` -> `/blog/gohighlevel-workflow-automations-guide`, `/product/:slug*` -> `/`, `/product-category/:slug*` -> `/`

### Other GSC categories (no code changes needed)
- **Soft 404 (11):** All have proper 301 redirects already, Google just needs to re-crawl
- **Crawled - not indexed (132):** Mostly ~80 old `_next/static/chunks/` URLs from the Next.js era, blocked by robots.txt `Disallow: /_next/`, will age out
- **Blog pagination (`?page=N`):** Already canonicalizes to `/blog`, working correctly
- **`http://` and `http://www.` variants:** Handled by Vercel's automatic HTTPS/www redirects

### Post-deploy
- Re-request "Validate Fix" in GSC for "Page with redirect" after deployment
- Monitor Soft 404 and Crawled - not indexed over the next 2-4 weeks

---

## 2026-05-04 - Blog Content Cleanup & Local SEO Repositioning

### What happened
Major content cleanup to reposition rsla.io from a developer blog to a local marketing agency site targeting California (Bakersfield primary) and New York. Analyzed SEO audit data (213K+ impressions, 0.18% CTR), verified 34 live posts, identified 16 zombie V1 URLs serving wrong content, and executed a full prune-and-focus strategy.

### Decisions made
- Keep 17 posts aligned with 4 services: GoHighLevel, SEO, Websites, AI Automations
- Remove 18 posts (developer tutorials, generic AI content) that attracted wrong audience
- Delete 30 legacy V1 blogPost documents (invisible to frontend but polluting CMS)
- Keep Claude Code content that demonstrates agency capability (not dev education)
- Future content strategy: local-first (Bakersfield, California, NYC) after SEMrush validation
- Content topics will be decided AFTER keyword research (not guessed)

### What was removed
- 18 blogPostV2 posts deleted from Sanity (developer tutorials, generic AI, off-topic)
- 30 blogPost V1 zombie documents deleted (old schema, never visible on frontend)
- Total: 48 documents removed from Sanity

### What was added/improved
- 21 new 301 redirects in vercel.json for archived post slugs
- 9 existing redirects updated (targets pointed to now-removed posts, fixed to point to keepers)
- Title/meta rewritten on top 3 performers: GHL pricing (88K imp), GHL features (55K imp), Claude comparison (70K imp)
- keyTakeaways (3-7 bullet items) added to all 17 keeper posts (featured snippet bait)
- bottomLine added to all 17 keeper posts (AEO extraction target)
- Categories assigned to all 17 posts (Go High Level, Local SEO, AI Automation, etc.)
- relatedPosts set on all 17 posts (internal linking - fixes "46 pages with 1 link" problem)
- relatedCaseStudies linked on 8 posts to relevant case studies

### Posts remaining (17 published)
1. go-high-level-pricing (GHL)
2. go-high-level-new-features-2025 (GHL)
3. what-is-go-high-level (GHL)
4. gohighlevel-workflow-automations-guide (GHL)
5. gohighlevel-funnel-tutorial-high-converting (GHL)
6. gohighlevel-lead-follow-up-automation (GHL)
7. gohighlevel-vs-jobber-home-service-crm (GHL)
8. gohighlevel-vs-hubspot-comparison (GHL - needs full rewrite for depth)
9. gohighlevel-for-restaurants-fill-tables (GHL + Industry)
10. how-to-rank-higher-on-google-maps (Local SEO)
11. google-business-profile-optimization-guide-2026 (Local SEO)
12. aeo-for-local-businesses (Local SEO + AI)
13. claude-code-marketing-agency-workflow (AI Capability)
14. ai-marketing-stack-what-we-use (AI Capability)
15. anthropic-claude-products-guide (AI Capability)
16. claude-code-vs-cowork-vs-claude-app (AI Capability - 70K impressions authority)
17. automate-client-intake-ai (AI Automation)

### Next steps
- [x] Pull SEMrush keyword data for local + service queries (California, Bakersfield, NYC)
- [x] Validate which location + industry + service queries have actual search volume
- [x] Post 1: Med Spa SEO (published 2026-05-04, slug: med-spa-seo-what-actually-works)
- [ ] Write remaining 11 new posts (prioritized by ROI, see content plan below)
- [ ] Rewrite gohighlevel-vs-hubspot-comparison (position 33, needs depth for page 1)
- [ ] Light refresh 4 keepers with location signals (pricing, restaurants, maps, GBP)
- [ ] Monitor CTR improvement on rewritten title/meta posts (2-3 weeks)
- [ ] Check GSC + GA4 after 1-2 weeks, optimize based on real data

### SEMrush Research Completed (2026-05-04)
Data saved in `docs/seo/semrush/`. Key findings:
- Bakersfield local: low volume (40-320/mo) but KD 4-27 (guaranteed rankings)
- Medspa marketing: 880-1,000/mo at KD 9-14 with $20-40 CPCs (goldmine)
- Contractor lead gen: 320-720/mo at KD 6-25 with $13-18 CPCs
- Local SEO services: 22,200/mo at KD 37 (crown jewel)
- NYC digital marketing: 1,600/mo at KD 38
- Industry + location combos (salon+bakersfield, restaurant+california): ZERO volume - eliminated
- Marketing automation + california: ZERO volume - eliminated

### Content Plan (12 posts, prioritized by ROI)
Phase 1 (quick wins, KD under 15):
1. Med Spa SEO (880/mo, KD 14, $27 CPC) - uses medspa case study
2. Home Services Lead Generation (320/mo, KD 6, $13 CPC) - uses contractor cases
3. Web Design Bakersfield (320/mo, KD 13-27, $8 CPC) - local dominance

Phase 2 (high value):
4. Local SEO Services (22,200/mo, KD 37) - massive volume pillar
5. Best Local SEO Company (2,900/mo, KD 23) - BOFU
6. Contractor Lead Generation (720/mo, KD 25, $18 CPC)

Phase 3 (expansion):
7. Digital Marketing Agency NYC (1,600/mo, KD 38)
8. Marketing Agency California (320/mo, KD 19)
9. SEO Bakersfield (170+210/mo, KD 18-19)

Phase 4 (vertical depth):
10. Medical Spa Marketing full strategy (880+1,000/mo, KD 24-35)
11. Best CRM for Marketing Agencies (210+880/mo, KD 13-33)
12. Affordable Local SEO for Small Business (2,400+2,900/mo, KD 27-39)

### Writing Strategy
- BOFU formula: Answer → Proof (case study) → Method → CTA
- Every post references real client results with numbers
- Location signals woven naturally (not stuffed)
- V2 schema fully populated (pullQuote, keyTakeaways, bottomLine, faqSchema)
- Voice DNA + humanizer + experience injection via /blogEngine
- Quality bar: genuinely impressive writing, not SEO content that reads like SEO content

### Spec
Full design spec at: `docs/superpowers/specs/2026-05-04-blog-content-cleanup-design.md`

---

## 2026-05-04 - Evergreen Blog Format + Repo Cleanup

### What happened
Implemented an evergreen blog format optimized for SEO/AEO/GEO. Added structured instant-value sections that serve both human readers and AI/search engines. Also cleaned ~18,000 lines of dead code from both rslaWebsite and rslaStudio repos.

### Schema changes (rslaStudio)
- Added `keyTakeaways` field (string array, 3-7 items, max 150 chars each) for featured snippet targeting
- Added `bottomLine` field (text, max 300 chars) for AEO conclusion extraction
- Tightened validation: title 70 chars, excerpt 160, metaDescription 155, featuredImage.alt 125
- Renamed `pullQuote` label to "TL;DR" with clearer description for editors

### Frontend changes (BlogInner.jsx)
- Key Takeaways renders as styled bullet list in bordered card (`.key-takeaways` class)
- Bottom Line section after article body in matching card (`.bottom-line` class)
- TL;DR section gets `.tldr` class for speakable targeting
- BlogPosting JSON-LD now includes `wordCount` and `speakable` specification

### Prerender changes (prerender.mjs)
- Fetches `keyTakeaways`, `bottomLine`, editorial `updatedAt` (falls back to `_updatedAt`)
- Outputs both sections as semantic HTML with `aria-label` and proper heading hierarchy
- TL;DR gets `.tldr` class in prerendered HTML
- JSON-LD includes `speakable`, `wordCount`, `dateModified`

### Repo cleanup
- rslaStudio: removed stale contentStrategy docs (archived), one-off scripts, post markdown files, executed plan docs. Added BRAIN.md, GEMINI.md, TODO.md.
- rslaWebsite: removed `content/posts/post11-22.md`, `content/scripts/` (57 files), `docs/conversionResearch/`, `docs/plan.md`, `docs/sessionHistory.md`, `docs/uiComponents.md`, stale superpowers plans, unused `Button` and `NumberTicker` UI components.
- Total removed: ~18,000 lines across both repos.

### Commits
- `bdf11a5` feat(blog): add evergreen format with key takeaways, bottom line, and enhanced schema
- `e2d3342` chore: remove stale docs, executed plans, and numbered post drafts
- `964b949` chore: remove 57 one-off content scripts (all previously executed)
- `eeb073c` chore: remove unused Button and NumberTicker UI components
- rslaStudio `c1b5120` feat(schema): add keyTakeaways and bottomLine fields, tighten SEO char limits
- rslaStudio `f5c7176` chore: clean up stale scripts, content strategy docs, and add project docs

### Still pending
- ~~Populate `keyTakeaways` and `bottomLine` on existing posts via Sanity Studio~~ (DONE - 2026-05-04 cleanup)
- Content rewrites in `content/rewrites/` are vestigial - new content goes directly to Sanity V2

---

## 2026-05-04 - Blog Listing + Inner Page Redesign

### What happened
Full redesign of both blog pages inspired by Riverside.com/blog. Iterated through multiple rounds of feedback on layout, typography, spacing, and component design.

### Blog listing page (`Blog.jsx`)
- Riverside-style hero: featured post (left 58%) + "Trending topics to read" dark banner + 3 sidebar posts (right 42%) with thumbnails, category tags, dates
- "All Articles" section with dropdown category filter + full-width search bar
- Newsletter card (MagicCard spotlight effect, blue border) at position 2 in grid on page 1
- 8 posts/page on page 1 (+ newsletter = 9 grid items), 9 posts/page on page 2+
- Scroll-to-top on page/category change
- Removed: popular posts section, explore topics, resources section, author from cards

### Blog inner page (`BlogInner.jsx`)
- Dark hero header (bg-black): title left 60% + landscape image right 40%, breadcrumb, author + role, date + reading time
- Black sticky ToC sidebar (rounded-xl): white text, blue underline on active section (not blue text)
- Body text: 20px black (`text-text`) with 1.6 line-height (was 18px gray)
- Heading sizes: H2 28-32px, H3 22-24px (closer to Riverside)
- Mobile ToC also black to match desktop
- Removed: case study section, share links from ToC, "In this article" label
- Reading progress bar + active heading tracker optimized with requestAnimationFrame (fixes scroll lag)
- Emil design polish: active:scale on cards, stagger animation on related posts, transition underlines

### Other changes
- `PortableTextRenderer.jsx`: body text to 20px black, lists to match, heading sizes adjusted
- `queries.ts`: added blogHeroPostsQuery, blogPopularPostsQuery, blogCategoriesWithCountQuery, keyTakeaways field
- `postcss` updated 8.5.6 -> 8.5.14 (Dependabot alert #17 resolved)
- Custom arrow SVG added to `public/images/icons/`

### Decisions made
- **No "popular posts" section.** No real popularity signal exists. Featured hero handles curation, All Articles is the archive. Simpler and honest.
- **Featured image standardized at 1200x630.** Used for hero, listing cards, OG tags, WhatsApp/iMessage previews. Inline body images remain flexible.
- **Black header + black ToC** for high contrast editorial feel. Body stays white with black text.
- **Key Takeaways field** added to Sanity query but UI only renders when data exists. Schema update needed in Sanity studio separately.
- **8+1 pagination on page 1.** Newsletter card takes a grid slot, so 8 posts + 1 newsletter = 9 items (3 full rows). Page 2+ gets 9 posts, no newsletter.

### Commits
- `39f7901` redesign(blog): overhaul blog listing and inner pages
- `a59ac36` fix(deps): update postcss to 8.5.14 to resolve XSS vulnerability

### Still pending
- ~~Sanity schema: add `keyTakeaways` field to blogPostV2~~ (done 2026-05-04, now string array)
- Sanity schema: ensure all featured images are uploaded at 1200x630
- Mobile: tested and working on iPhone SE (375px) and iPad (768px), but should verify on physical devices

---

## 2026-04-30 - GTM Conversion Tracking Complete

### What happened
Completed the GTM conversion tracking setup that was started on 2026-04-23. Fixed incorrect firing triggers on event tags (were set to "Initialization - All Pages" instead of matching custom event triggers). Added `dataLayer.push({ event: 'cta_click' })` to all 6 contact CTA links in code because React Router Link clicks don't produce a Click URL for GTM's click-based triggers.

### Changes
- Fixed CE - Booking Confirmed tag trigger (was firing on every page load)
- Fixed CE - Newsletter Subscribe tag trigger (same issue)
- Added `source` event parameter to newsletter tag (distinguishes insider vs lead magnet signups)
- Created `dlv - source` and `dlv - cta_location` Data Layer Variables in GTM
- Changed CTA trigger from "All Elements / Click URL contains /contact" to Custom Event `cta_click`
- Added `dataLayer.push` with `cta_location` to: HeroV2, FooterV2, NavbarV3 (desktop + mobile), Home.jsx, ServiceDetail.jsx
- Published GTM container Version 5

### Commits
- `db09d04` feat(tracking): add cta_click dataLayer events to all contact CTAs

### Still pending
- Mark `booking_confirmed`, `newsletter_subscribe`, `cta_click` as Key Events in GA4 once they appear in Admin > Events (24-48 hours)

---

## 2026-04-22 - Code Audit & Fixes

### What happened
Full codebase audit across all layers: config, API routes, components, pages, hooks, Sanity queries, build scripts, and Tailwind config. 30 issues identified and fixed.

### All fixes

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Prerender HTML flash before React renders | Critical | Inline `<style>#prerender{display:none}</style>` in `<head>` with `<noscript>` fallback |
| 2 | CSP blocked Meta Pixel | Critical | Added Facebook domains to `script-src`, `connect-src`, `img-src` in `vercel.json` |
| 3 | `lazyRetry` infinite reload loop | Critical | `sessionStorage` guard; falls back to NotFound on second failure |
| 4 | Sentry DSN empty in `.env.local` | Critical | Confirmed set in Vercel env vars; only affects local dev |
| 5 | No rate limiting on `subscribe.mjs` | High | In-memory IP-based rate limiter (5 req/min/IP) |
| 6 | No rate limiting on `llm/[slug].mjs` | High | In-memory IP-based rate limiter (30 req/min/IP) + GET-only method check |
| 7 | Build scripts silently swallow failures | High | `console.error` + `process.exitCode = 1` |
| 8 | Sanity fetches missing isMounted guards | High | Added guards and `.catch()` to `BlogPreview.jsx`, `LeadMagnet.jsx` |
| 9 | GSAP opacity-0 flash on 5 components | High | Added `opacity-0` CSS class to animated elements |
| 10 | Seo.jsx stale meta tags across routes | High | Full cleanup of all meta tags on unmount |
| 11 | 13 dead Sanity queries | Medium | Removed all V1 queries and unused V2 queries from `queries.ts` |
| 12 | 4 dead components | Medium | Deleted `HowItWorks`, `SystemArchitecture`, `MarqueeV2`, `ProofSection` |
| 13 | NavbarV3 mobile menu missing Escape + scroll lock | Medium | Added Escape key handler and `overflow: hidden` on body |
| 14 | V1/V2 case study fallback (V1 fully migrated) | Medium | Removed V1 fallback in `WorkInner.jsx` and `caseStudyBySlugQuery` |
| 15 | ServicesV2 infinite GSAP loops burning CPU off-screen | Medium | Added `usePauseOffscreen` hook using IntersectionObserver; all 5 timelines start paused and only play when visible |
| 16 | Package name was `"temp-vite"` | Low | Renamed to `"rsla-website"` |
| 17 | `@types/react-router-dom@5` stale | Low | Removed (router v7 ships its own types) |
| 18 | `@types/canvas-confetti` in wrong deps section | Low | Moved to `devDependencies` |
| 19 | `@gsap/react` in manualChunks but unused | Low | Removed from chunks |
| 20 | `rollupOptions.external: []` no-op | Low | Removed |
| 21 | `motion` manualChunks didn't match `motion/react` | Low | Added `motion/react` to chunk config |
| 22 | Unused Tailwind: `accent-wash`, `font-editorial`, `font-drama`, `marquee-scroll`, `marquee-reverse` | Low | Removed |
| 23 | Backward-compat color aliases only used in dead components | Low | Removed |
| 24 | `JSON_LD_ID` unused variable in Seo.jsx | Low | Removed |
| 25 | Blog debounce timer ref not cleared on unmount | Low | Added cleanup `useEffect` |

| 26 | `firstName` not sanitized in subscribe endpoint | Low | Strip HTML tags before sending to Kit |
| 27 | Lead magnet pages missing from prerender | Low | Added lead magnet fetch + pre-rendering to `prerender.mjs` (2 pages); intentionally excluded from sitemap since they're `noIndex` |
| 28 | Dual analytics (GA4 + Meta Pixel standalone + GTM) | Medium | Removed standalone GA4 and Meta Pixel from `index.html` (were double-tracking). Consolidated to GTM-only, loaded unconditionally. Cookie banner kept as transparency measure, no longer gates tag loading |

### Decisions made
- **All tracking loads unconditionally.** GTM manages GA4 and Meta Pixel. No consent gating. US-based B2B company; CCPA requires opt-out not opt-in. If EU traffic grows, configure Google Consent Mode v2 in GTM (no code change needed).
- **V1 Sanity schemas are dead.** All 8 V1 case studies have matching V2 entries. V1 fallback code removed. V1 documents can be deleted from Sanity when ready.
- **Cookie banner is transparency-only.** Accept/Decline stored in localStorage but does not control any tag loading.

---

## 2026-04-23 - Security Audit + Code Quality + A11y Cleanup

### What happened
Full security audit, code quality review, config/deployment audit, and dependency audit. 4 parallel agents audited the entire codebase. 43 issues found, all fixed.

### Key fixes
- **CRITICAL:** Renamed `VITE_SANITY_API_TOKEN` and `VITE_KIT_API_KEY` to drop `VITE_` prefix (prevents client-side exposure)
- **CRITICAL:** Deleted 8 unused components (BlogPreview, StatsSection, FaqSection, 5 Magic UI components) - 590 lines removed
- **HIGH:** Added `prefers-reduced-motion` support to all 11 GSAP-animated components
- **HIGH:** Added `title` to video embed iframes, focus rings to form inputs
- **HIGH:** Extracted shared `CaseStudyCard` and `PersonCard` components (was duplicated)
- **HIGH:** Added `width`/`height` and `loading="lazy"` to images missing dimensions
- **MEDIUM:** Replaced `navigate('/contact')` with `<Link>` in navbar CTA
- **MEDIUM:** Fixed `BookingConfirmed` setTimeout chain cleanup
- **MEDIUM:** Removed `@gsap/react` and `@radix-ui/react-icons` (unused deps)
- **MEDIUM:** Hardened CSP with `object-src 'none'; base-uri 'self'`
- Removed duplicate `scrollTo(0,0)` from 6 pages, fixed index-as-key in 3 components, removed BentoCard unused `description` prop, fixed RSS author format, deleted 4 unused Satoshi font files, added `.nvmrc` (Node 22 LTS), created `.env.example`, fixed prerender duplicate nav, added Sentry Vite plugin for bundle optimization

### Commits
- `cf43bf1` fix: security audit + code quality + a11y + dead code cleanup

---

## 2026-04-23 - SEO / AEO / GEO Audit + Fixes

### What happened
Full SEO/AEO/GEO audit using codebase analysis, live site Lighthouse crawl, SEMRush Site Audit + Domain Overview + Backlinks, and GA4/GSC data. Found 31 issues across technical SEO, AEO, and GEO. All code-fixable issues resolved.

### Data summary
- 15 organic traffic/mo (SEMRush), 490 clicks over 5 months (GSC)
- 350K+ impressions with <0.1% CTR on top pages (massive untapped potential)
- 151 ranking keywords, Authority Score 7/100
- 46/103 pages have only 1 internal link
- Lighthouse: SEO 100/100, Best Practices 100/100, Accessibility 93/100

### Key fixes
- **CRITICAL:** Fixed Blog JSON-LD outputting `[object Object]` in URLs (slug was Sanity object, not string)
- **CRITICAL:** Added FAQ schema to Home.jsx (was lost on React hydration)
- **CRITICAL:** Synced DiscoveryCall title/schema with prerender (ContactPage JSON-LD added)
- **HIGH:** Optimized page titles for CTR: Services (16->52 chars), Work (20->52 chars), Blog (12->56 chars), About (13->45 chars)
- **HIGH:** Updated Services H1 from generic "What we can help you with." to "What we build for B2B companies."
- **HIGH:** Added `dateModified`, `image`, and `publisher.logo` to prerender BlogPosting schema
- **HIGH:** Added BreadcrumbList schema to case study pages
- **HIGH:** Added 33 legacy URL 301 redirects (GA4 showed traffic hitting dead URLs)
- **HIGH:** NoIndexed 5 thin service detail pages, removed from sitemap
- **MEDIUM:** Updated homepage prerender from stale service descriptions to current offerings
- **MEDIUM:** Updated FAQ schema answers (removed old "Meta and Google for paid ads" references)
- **MEDIUM:** Added `og:locale` meta tag across all pages
- **MEDIUM:** Fixed Instagram handle inconsistency in schema (`rahulslalia` -> `rahul.lalia`)
- **MEDIUM:** Added cross-links: service detail pages link to related case studies, case study pages link back to service pages
- **LOW:** Added missing canonicals to BookCall, Insider, LeadMagnet pages
- **LOW:** Added description to NotFound Seo component
- **LOW:** Added changefreq to sitemap entries
- **LOW:** Updated llms.txt with human-facing URLs alongside API endpoints
- **LOW:** Added `dataLayer.push` events for booking, newsletter, lead magnet conversions
- **INFRA:** Replaced in-memory rate limiting with Upstash Redis (graceful fallback when env vars not set)

### Commits
- `dd283ef` fix(seo): optimize titles, sync schemas, add redirects, update prerender
- `f60eecb` feat(tracking): add dataLayer events for booking, newsletter, lead magnet conversions
- `17a016e` fix: noIndex thin service pages, add cross-links, replace in-memory rate limiting

### Decisions made
- **Service detail pages noIndexed.** They're thin content (1 sentence + CTA) with 0-5 organic impressions each. Will be re-indexed when expanded with full content.
- **Pillar page strategy planned.** 3 hub pages: GHL Complete Guide, AI Automation for B2B, Local SEO Playbook. Strategy doc at `docs/superpowers/plans/2026-04-27-pillar-page-strategy.md`.
- **Rate limiting now requires Upstash.** Code falls back gracefully (no rate limiting) when `UPSTASH_REDIS_REST_URL` env var is not set.

### Still pending
See `BRAIN.md > TODO (Next Session)` for the full checklist.

### SEO data audit insights
- Blog post titles and meta descriptions are already well-optimized in Sanity. CTR problem is position-based (avg pos 6-10), not copy-based.
- Top keyword opportunity: "gohighlevel pricing" (2,900 monthly volume, position 9, 88K impressions)
- Content split: 80% of organic clicks from GHL content, 15% from Claude/AI content, 5% from local SEO
- 46/103 pages had only 1 internal link (addressed with cross-linking code, pillar pages will further improve)
- Backlink profile: 91% low-authority, 59% Singapore, 15% Moldova. Needs disavow.

### Session summary
4 commits across security audit, SEO fixes, conversion tracking, and infrastructure. Net result: -406 lines of dead code, +200 lines of SEO/schema/redirect improvements, 33 new 301 redirects, Upstash rate limiting, cross-linked service and case study pages.
