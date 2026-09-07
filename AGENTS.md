# AGENTS.md - RSL/A website

## What This Is

RSL/A agency website at rsla.io. React 19 + Vite SPA with GSAP animations, Sanity CMS for blogs and case studies. Brand light theme (Paper/Ink/Anchor Blue per `../../brand-guidelines/design-tokens.css`; dark = footer only). This is also the content production hub for all blog writing, case study drafting, and SEO work.

**Live:** rsla.io (Vercel, auto-deploys from `main`)
**GitHub:** `HQ-RSL-A/rsla-io` (moved from `rahullalia/new-rslaWebsite`)
**Studio:** studio.rsla.io (separate repo in `../studio/`)

## Permissions

Inherits from `~/Developer/CLAUDE.md`. Everything here is trusted.

## Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v3.4 + shadcn/ui utilities |
| Animation | GSAP 3 + ScrollTrigger (no Framer Motion except Magic UI internals) |
| UI Components | Magic UI (MagicCard, TextAnimate, NumberTicker, ShineBorder, InteractiveHoverButton) |
| CMS | Sanity (Project: `yz25oyux`, Dataset: `production`, API: `2025-03-01`) |
| Icons | Lucide React |
| SEO | Custom Seo.jsx + JSON-LD on all indexed pages |
| Error Monitoring | Sentry (deferred via requestIdleCallback) |
| Fonts | Self-hosted WOFF2: Satoshi Medium 500 + Bold 700 ONLY (brand set; no Regular, no italics, no other families) |
| Pre-rendering | Build-time HTML injection (scripts/prerender.mjs + marked) |
| Newsletter | Kit API (`api.convertkit.com/v3/forms/9130465/subscribe`) |

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Dev server (Vite)
npm run build      # Production build (includes sitemap + RSS + llms.txt + IndexNow)
```

## Rules

- **One animation library.** GSAP + ScrollTrigger for everything. No Framer Motion (except where Magic UI components use it internally).
- **`once: true`** on all entrance animations. Don't re-trigger on scroll-back.
- **Max 2 to 3 strategic scroll moments** that genuinely surprise. Everything else stays clean.
- **GSAP first-paint flash:** Any element starting at `opacity: 0` needs the `opacity-0` CSS class to prevent flash before useEffect runs.
- **ScrollTrigger cleanup:** Each page cleans up its own GSAP context via `ctx.revert()`. Never kill all triggers globally on route change.
- **`transition-colors` not `transition-all`** on any element GSAP animates (CSS transitions fight GSAP opacity).
- **Pre-rendered HTML** wrapped in `<div id="prerender">` inside `#root`. Do NOT manually remove it with an inline script - React's `createRoot().render()` replaces the root's children on first render, automatically cleaning up the prerender div. Manual pre-wipe previously caused "empty shell" failures when the React bundle was slow or failed: the prerender content was gone before React could replace it, leaving a blank page. Leaving it in place means crawlers, slow networks, and bundle failures all see meaningful semantic content as graceful fallback.
- **Import paths:** Always use `@/` alias for component imports. Relative imports break Vite HMR.
- **Sanity client config:** projectId/dataset hardcoded in `src/sanity/lib/client.ts` (env vars don't resolve during Vercel build).
- **Sanity long content:** `create_documents_from_markdown` truncates at 50+ blocks. Use HTTP mutation API with Portable Text JSON instead.
- **Sanity CORS:** Only `localhost:5173` whitelisted. Other ports will fail.
- **PortableText:** Extract text from `value.children` (raw Sanity data), not React `children` props.
- **Vercel SPA rewrite** excludes `/api/`: `/((?!api/).*) -> /index.html`
- **Serverless functions** need an explicit `functions` block in vercel.json with a `"runtime": "@vercel/node@X"` pin (currently `12.0.1`). Keep it matched to Vercel's current builder: a stale pin fails the build with "Failed to load Builders ... version-mismatch" (`5.6.9` went stale 2026-07-22, `5.8.26` went stale 2026-08-10, `5.9.0` went stale by 2026-09-06 and broke the branch preview build). The build log names the version to bump to: "Installing Builder: @vercel/node@...".
- **GTM** (GTM-MVJQSMF8) loaded unconditionally in `<head>`. Manages GA4, Meta Pixel, Microsoft Clarity, and the CookieScript CMP (no standalone scripts). Consent is CookieScript's official GTM template: Consent Mode v2 defaults denied, banner grants. The old React `CookieConsent` banner is deleted; the footer "Cookie Settings" button calls `window.CookieScript.instance.show()`.
- **Consent model is geo-split — GTM is the gate.** The CookieScript CMP tag in GTM holds Default Consent: Granted globally, Denied for the region row (EEA + UK + CH + CA-QC). US/rest-of-world visitors are tracked by default; opt-in regions wait for Accept; explicit declines and GPC are always honored. Any change to consent defaults, regions, or banner behavior MUST ship with a matching Privacy.jsx §10 edit in the same change. Full architecture + rationale: `docs/2026-08-17-consent-compliance-posture.md`.
- **CSP must whitelist every script host GTM injects.** A missing host fails silently: the `<script>` tag lands in the DOM but transfers zero bytes, and no error surfaces anywhere obvious (resource-timing entry shows `status: 0, size: 0`). CookieScript and Clarity both shipped blocked this way until 2026-08-17. When adding a tag in GTM, add its domains to the CSP in vercel.json in the same change.
- **Blog images:** Styles rotate across posts to avoid repetition. Track which styles were used.
- **Blog writing skill:** `/blogEngine`.
- **Blog pipeline:** Interview -> outline -> draft -> voice audit -> Sanity creation -> image generation -> upload -> publish -> post-publish (cross-links, GSC indexing, tracker update).
- **Build chain:** `vite build -> prerender -> sitemap -> rss -> llms.txt -> IndexNow ping`
- **Structured data = one source of truth.** `src/lib/structuredData.mjs` holds the global entity graph (`#business` LocalBusiness/ProfessionalService with telephone + priceRange NAP, `#website` WebSite, `#rahul` Person/founder/author). Both `scripts/prerender.mjs` and `src/components/Seo.jsx` import it, so static HTML and hydrated DOM never drift. `Seo.jsx` always injects these globals on indexed pages (gated on `!noIndex`). Page schemas reference them by `@id` (`provider`/`publisher`/`author`/`isPartOf`), never re-declared inline. No fabricated review markup.
- **Prerender `$` injection.** In `inject()`, insert dynamic content with function-form replacements (`str.replace(target, () => value)`). String replacements treat `$$`/`$&`/`$n` as special tokens and corrupt dollar sequences (e.g. `priceRange "$$$"` rendered `"$$"`, and any dollar amount in body copy).
- **Git auto-deploy + reconnect.** Pushes to `main` on `HQ-RSL-A/rsla-io` auto-deploy via Vercel. If auto-deploy silently stops (e.g. after a repo/org transfer, even while the Vercel link, GitHub App, and `createDeployments` all read healthy), reconnect: `vercel git disconnect --yes` then `vercel git connect https://github.com/HQ-RSL-A/rsla-io.git` (plain `disconnect` is a no-op non-interactively; `--yes` is required). Manual deploy any time: `vercel --prod`.
- **Vercel bot challenge.** Rapid automated/`curl` hits on rsla.io return `403 x-vercel-mitigated: challenge` (real browsers solve it transparently). To read live HTML programmatically, use the Vercel MCP `web_fetch_vercel_url` (authenticated, bypasses it); don't hammer the domain.
- **Brand reference:** All brand docs live in `../../brand-guidelines/`.
- **Service page copy** lives in `docs/seo/service-pages/` (one file per page, `README.md` for the keyword map and open questions, `tracker.md` mirrors Linear RSL-363). Edit the copy files, never the manifest; every count comes from `python3 docs/seo/service-pages/check-copy.py`, which must exit 0 before a page is built or changed.

## Documentation Convention

| File | Purpose |
|---|---|
| `CLAUDE.md` | Rules, permissions, stack, gotchas (obey) |
| `brain.md` | Reference: routes, colors, typography, file map, SEO details (look up) |
| `log.md` | Running record, newest entry on top |
