# GEMINI.md — rslaWebsite

## What This Is

RSL/A agency website at rsla.io. React 19 + Vite SPA with GSAP animations, Sanity CMS for blogs and case studies. Blue-gray light theme. This is also the content production hub for all blog writing, case study drafting, and SEO work.

**Live:** rsla.io (Vercel, auto-deploys from `main`)
**GitHub:** `rahullalia/new-rslaWebsite`
**Studio:** studio.rsla.io (separate repo in `../rslaStudio/`)

## Permissions

Inherits from `~/lalia/CLAUDE.md`. Everything here is trusted.

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
| Fonts | Self-hosted WOFF2: Satoshi (primary), Cormorant (decorative italic only) |
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
- **Serverless functions** need explicit `functions` block in vercel.json with `"runtime": "@vercel/node@5.6.9"`.
- **GTM** (GTM-MVJQSMF8) loaded unconditionally in `<head>`. Manages GA4 and Meta Pixel (no standalone scripts). Cookie banner is transparency-only, does not gate tag loading.
- **Blog images:** Styles rotate across posts to avoid repetition. Track which styles were used.
- **Blog writing skill:** `/blogEngine` (lives in `~/lalia/myBusiness/skills/blogEngine/`).
- **Blog pipeline:** Interview -> outline -> draft -> voice audit -> Sanity creation -> image generation -> upload -> publish -> post-publish (cross-links, GSC indexing, tracker update).
- **Build chain:** `vite build -> prerender -> sitemap -> rss -> llms.txt -> IndexNow ping`
- **Brand reference:** All brand docs live in `../brandGuidelines/`.

## Documentation Convention

| File | Purpose |
|---|---|
| `CLAUDE.md` | Rules, permissions, stack, gotchas |
| `GEMINI.md` | Mirror of CLAUDE.md for Gemini |
| `BRAIN.md` | Reference material: routes, colors, typography, file map, SEO details |
