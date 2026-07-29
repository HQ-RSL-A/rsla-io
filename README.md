# RSL/A Website (rsla.io)

The official RSL/A website. Blue-gray light theme with Aurora background hero, Magic UI components, GSAP scroll animations, and Sanity CMS for blogs and case studies.

**Live:** [rsla.io](https://rsla.io)

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite (SPA) |
| Styling | Tailwind CSS v3.4 + shadcn/ui utilities |
| Animation | GSAP 3 + ScrollTrigger |
| UI Components | Magic UI (MagicCard, TextAnimate, Marquee, NumberTicker, ShineBorder, InteractiveHoverButton, FlickeringGrid, Confetti) |
| Hero | Aurora Background (CSS keyframe, adapted from Aceternity) |
| CMS | Sanity (Project: `yz25oyux`, Dataset: `production`) |
| Rich Text | @portabletext/react |
| Icons | Lucide React |
| Analytics | Google Tag Manager (gated behind cookie consent) |
| Hosting | Vercel (auto-deploys from `main`) |

## Pages

| Route | Page | Indexed |
|---|---|---|
| `/` | Home | Yes |
| `/about` | About | Yes |
| `/services` | Services | Yes |
| `/how-it-works` | How It Works | Yes |
| `/start-here` | Start Here | Yes |
| `/work` | Case Studies | Yes |
| `/work/:slug` | Case Study Detail | Yes |
| `/blog` | Blog | Yes |
| `/blog/:slug` | Blog Post | Yes |
| `/book-a-call` | Booking (GHL embed) | No |
| `/booking-confirmed` | Confirmation (chromeless) | No |
| `/rahul` | Digital Business Card (chromeless) | No |
| `/sid` | Digital Business Card (chromeless) | No |
| `/insider` | Newsletter Signup | No |
| `/privacy-policy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `/disclaimer` | Disclaimer | No |
| `/accessibility` | Accessibility | No |

## SEO

- Per-page meta titles, descriptions, OG tags, and JSON-LD structured data
- WebSite schema for SERP brand name display
- Dynamic sitemap.xml (45 URLs, generated at build time from Sanity)
- Favicons: SVG (primary), ICO (48x48 + 96x96), apple-touch-icon (180x180), PWA icons
- Lighthouse scores: Performance 96, Accessibility 95, Best Practices 96, SEO 92

## Security

- Content Security Policy (CSP) with whitelisted domains
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (camera, mic, geolocation disabled)
- Cookie consent gates all tracking (GTM, Meta Pixel)
- PortableText link sanitization (blocks javascript: protocol)
- 0 npm audit vulnerabilities

## Sanity Schemas

| Schema | Status | Notes |
|---|---|---|
| `blogPost` | Legacy | Original blog schema |
| `blogPostV2` | Active | Full Portable Text blocks, pull quote, reading time |
| `caseStudy` | Legacy | Original case study schema |
| `caseStudyV2` | Active | Featured image, before/after, AI-first categories |
| `author` | Active | Shared by both blog versions |
| `category` | Active | Shared by both blog versions |

## Brand Reference

All brand docs live in `../theBrand/` (central brand folder):
- `brain.md` - Quick-reference brand context
- `brand-identity-guide.md` - Core identity, mission, voice
- `rslaHomePageCopy.md` - Homepage copywriting
- `rslaPagesCopy.md` - All other page copy
- `rslaUiUxPlaybook.md` - UI/UX specs, animations, performance budget
- `rslaWebsiteStrategy.md` - Website architecture and strategy
- `llmArchitecture.md` - LLM/agentic search optimization
- `llmApiReference.ts` - Markdown API reference code

## Commands

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (Vite)
npm run build                  # Production build
npx sanity schema deploy       # Deploy schemas to Sanity cloud
```
