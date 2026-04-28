# LOG.md - rslaWebsite

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

### Still pending (manual)
- Set up GA4 conversion events in GTM (triggers created, tags need Measurement ID G-KTE0H7FE4S)
- Create Sentry project and set VITE_SENTRY_DSN in Vercel
- Rotate Sanity API token (had VITE_ prefix historically)
- Create Upstash Redis database and add env vars to Vercel
- Audit/disavow spammy backlinks (need full SEMRush backlink export)
- Write 3 pillar pages in Sanity
- Refresh top blog posts for CTR in Sanity
