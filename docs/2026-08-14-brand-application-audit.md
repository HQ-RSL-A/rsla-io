# Brand application audit: rsla.io vs the 2026-08 brand guidelines

**Date:** 2026-08-14
**Scope:** Every route, shared component, the token layer (Tailwind + index.css), fonts, logo assets, favicon set, JSON-LD entity graph, prerender templates, and a 39-post sample of the blog corpus, audited against `my-business/brand-guidelines/` (identity guide, voice DNA, design-tokens.css, bios-and-boilerplate, logo set).
**Status:** Phase 1 (visual system) executed 2026-08-17 per Rahul's scope: tokens, fonts, weights, casing, eyebrows, alpha text, grays, borders, hovers, logo/favicon restoration, dark-to-light conversions (footer stays dark), Caveat retired. Deliberately deferred: positioning copy, pitch-ladder reorder, meta titles, aurora hero (kept until a replacement is chosen), legal-heading casing, Sanity content. See log.md 2026-08-17 15:36 PT for the change record.

The guidelines are dated 2026-08-10. The site predates them, so nothing here means the site is broken. This is the delta list between what ships today and what the new system specifies, ordered by weight.

---

## 1. The five strategy-level gaps

### 1.1 Positioning and audience say the wrong thing sitewide

The site's One Thing is currently **"The trusted AI growth partner for B2B companies"** with a **"$500K+ in revenue"** qualifier in the homepage FAQ. The brand's One Thing is **"Only you know what your time is worth. We put AI to work to get it back."** aimed at **solopreneurs and small service businesses**. "Founders" (retired word) appears throughout. Ready-made replacement copy already exists in `brand-guidelines/bios-and-boilerplate.md` (one-liner for the hero, press boilerplate for schema descriptions, long bio for About).

Where the old positioning lives (all must change together):

| File | What's there |
|---|---|
| `index.html` | `<title>`, meta description, OG/Twitter tags, keywords |
| `src/components/HeroV2.jsx` | H1 "The trusted AI growth partner for fast-moving B2B companies." |
| `src/pages/Home.jsx` | Same title/description in Seo, FAQ schema ("B2B companies... $500K+"), intro copy ("SMB and enterprise", "proprietary AI-driven consulting stack") |
| `src/siteConfig.ts` | `tagline`, `description` |
| `src/lib/structuredData.mjs` | `organizationNode.description`, `personNode.description` ("Builds AI growth systems for B2B companies") |
| `scripts/prerender.mjs` | All static-HTML page templates repeat the hero, FAQ, About, and Services copy verbatim (lines ~178-380) |
| `src/pages/Services.jsx` | H1 "What we build for B2B companies." |
| `src/pages/About.jsx` + prerender | "I show founders how to put AI to work..." (old positioning line), "founders" 3x |
| `src/pages/Work.jsx` | Meta "measurable growth for B2B companies" |
| `src/pages/Terms.jsx` | "...for businesses and founders" |

Note the duplication: positioning copy exists in four independent layers (index.html, React pages, prerender.mjs, structuredData/siteConfig). Any copy change must hit all four or static HTML and hydrated DOM drift.

### 1.2 The pitch ladder is inverted everywhere

Brand order: **1. Automation → 2. Recommended by AI → 3. Websites → 4. Ads/custom.** "Never open with website or SEO."

The site presents: **Websites first, with the largest bento tile (col-span-2)**, then Search Visibility, then AI Automations, then CRM, then Custom Dev. This order is encoded in five places:

- `src/components/ServicesV2.jsx` `features` array (used by Home AND Services page)
- `src/components/NavbarV3.jsx` `serviceSubLinks` (mega-menu)
- `src/data/serviceData.js` `serviceOrder`
- OfferCatalog JSON-LD in `Services.jsx` and `prerender.mjs`
- `index.html` meta description literally opens with "We build your website..."

Related reframes:
- "Search Visibility" should carry the brand's outcome-first frame: "when customers ask AI who to call, your business is the answer," with SEO/AEO/GEO named only after that sentence. Current description ("Rankings on Google, ChatGPT, Perplexity, and Claude") is close but name and hierarchy are off.
- Automation copy must claim time back and nothing slips, never customer acquisition. Current bento line "Leads qualified and tasks routed while you sleep" is inside the line but review during the copy pass. Only the visibility offer may claim "brings customers in."
- Keep SEO-driven **meta titles** keyword-targeted (e.g. "Local SEO Services..." on /services is a search play). The ladder governs on-page presentation order, not keyword targeting. Flagged as a judgment call, not auto-fix.

### 1.3 The logo is recolored, against a standing decision

- `public/images/logo/logomark.svg` (also the **favicon** via index.html) has the slash square recolored to `#0070F3`. The brand master is `#3b82f6`, and the guide records Rahul's standing decision (2026-08-10): **never recolor the logo files**.
- `public/apple-touch-icon.png` is visibly the recolored version too. Assume `favicon.ico`, `icon-192.png`, `icon-512.png` need regeneration from the master.
- `public/images/logo/lockup.svg` uses the correct `#3b82f6` but renders the wordmark at `#1a1a1a` (Ink is `#1d1d1f`). Verify against the master lockup before touching.
- `og-image.png` uses the correct logo blue on a dark cover. Fine.
- Footer renders the lockup at `opacity-30` on near-black, which fails the logo contrast rule ("insufficient contrast" placement).

Fix: copy masters from `brand-guidelines/rsla-logo/`, regenerate the favicon set, restore footer logo to full opacity.

### 1.4 "Digital marketing" label in schema and local page

Brand: category label is **"marketing agency," never "digital marketing agency."** Found in:
- `src/pages/CityHub.jsx`: Service schema `serviceType: 'Digital marketing agency'` and name "Digital Marketing, Web Design & SEO in {city}"
- `src/data/cityData.js` (Bakersfield): metaDescription "RSL/A is a digital marketing agency...", H1 "Digital marketing that works for Bakersfield businesses.", plus subheadline leading with "we build websites and run SEO" (commodity-first) and a spaced hyphen used as a dash.

`keywords` fields may keep "digital marketing bakersfield" for search targeting; the ban applies to visible copy and schema labels.

### 1.5 Typography is a different system

Brand: **Satoshi only. Medium 500 for all reading text, Bold 700 for all headings/emphasis, Black 900 covers only. No Regular 400, no italics ever, no synthetic weights.**

Current state:
- **Three font families ship:** Satoshi (6 files incl. Regular + 3 italics), **Cormorant** (4 files, "decorative italic" for pull quotes), **Caveat** (3 files, handwriting for the newsletter identity). 13 font files → the brand allows 2 (Medium, Bold; Black only if a cover exists).
- `index.html` **preloads Satoshi-Regular 400** as a critical font; body text defaults to 400 sitewide (no explicit weight → font-normal).
- **94 uses of `font-extrabold` (800)** and **84 of `font-semibold` (600)**: neither weight is loaded, so browsers render synthetic/nearest weights. Both map to Bold 700 in the new system. 29 explicit `font-normal` uses map to Medium 500.
- **Italics in active use:** blockquotes (`font-cormorant italic` in PortableTextRenderer), the `em` mark renderer, image/video captions, testimonial quotes (WorkInner + blog testimonial block).
- **Size floors broken:** `.case-study-prose p` is 16px on mobile (floor: 17px for main reading text). Newsletter email inputs are `text-sm` 14px (floor: 16px, iOS auto-zoom). Blog body at 18px is fine.
- Brand type roles (Display 64/40, H1 48/34, H2 36/28, Lead 21 Bold with one blue phrase, stat 56 Bold) exist as clamp() vars in `brand-guidelines/design-tokens.css` and are not imported anywhere. The site's scale is ad-hoc per component.

---

## 2. Color system deltas (token layer)

Current (`tailwind.config.js` + `index.css`) → brand (`design-tokens.css`):

| Current | Value | Brand replacement |
|---|---|---|
| `background` | `#F8FAFC` slate-50 | Paper `#FFFFFF` (default bg everywhere) |
| `surface` | `#FFFFFF` cards on slate | Model inverts: Paper base, Mist `#F5F5F7` for alternate sections/cards |
| `surfaceAlt` | `#F1F5F9` slate-100 | Mist `#F5F5F7` |
| `text` | `#0F172A` slate-900 | Ink `#1d1d1f` |
| `textMuted` | `#475569` | **Retired.** One text color per surface; hierarchy from size/weight only |
| `textLight` | `#94A3B8` | **Retired** |
| ad-hoc grays | `#425466`, `#727F96`, gray-500, stone-600, `#CBD5E1` | **Retired** (WorkInner, BlogInner ToC, blog hero) |
| `accent` | `#0066E0` (darkened) | Anchor Blue `#0070F3`. Also **hardcoded in 9 JS spots** (GSAP borderColor/rgba in ServicesV2 tiles) |
| hover states | `accent/80`, `accent/90`, missing `accent-hover` | Anchor Deep `#0059C2` solid. (`hover:text-accent-hover` in Testimonials.jsx references a token that doesn't exist → silent no-op) |
| `cyan` | `#00C2FF` in hero aurora, beams, ShineBorder, neon glow | **Charts only.** Out of all UI |
| `coral` | `#FF6B6B` | Error `#DC2626` (semantic trio: `#047857` / `#B45309` / `#DC2626`) |
| borders | `#E2E8F0`, `accent-border` rgba, `black/10`, gray-100/200/300 | Hairline `#D2D2D7` |
| `accent-light` | rgba(0,112,243,.05) wash | Frost `#EFF6FF` solid for callouts/active states (hover tints may stay alpha; surfaces only) |

**Transparency on text (banned outright, "every text color is a solid hex"):**
- Navbar inactive links `text-text/70`
- Footer: `text-white/80` column titles, `text-white/50` links, `text-white/30` legal + copyright
- Blog post hero: `#CBD5E1` with `/50` and `/80` steps
- Case study intro `text-text/80`, CTA arrows `text-white/60`, `text-white/70`
- PersonCard `text-textMuted/70`
- On dark surfaces the only text color is Mist `#F5F5F7`, solid.

**Gradients (retired; color is applied flat):**
- Aurora hero background (`AuroraBackground.jsx`: repeating gradients of #0070F3/#00C2FF/#38bdf8/#93c5fd) - the most visible one on the site
- `.card-beam` / `.border-beam` conic gradients, `.btn-gradient-border`, `.btn-neon` glow + cyan pulse (index.css)
- Home timeline line `bg-gradient-to-b from-accent/40...`
- Blog "Trending" banner `from-slate-800 to-slate-900`
- CustomDev tile progress bar `from-accent to-emerald-400`, SERP scanner line
- NewsletterGridCard: card wash gradient, two radial glows, gradient sphere seal (its `accentDark: '#005BC2'` is also one digit off Anchor Deep `#0059C2`)
- CtaWithGlow radial glow + bottom scrim
- `.highlight-mark` gradient highlighter
- Allowed to stay: marquee edge fades and photo scrims (the guide explicitly permits scrims over imagery), plain shadows.

**Dark surfaces mid-page** (brand: Black `#000000` for covers/openers/dividers only, interiors always light):
- Footer `#0A0A0A`
- CtaWithGlow band `#121212`
- Blog post hero `#0A0A0A`
- techStack "Tech Specs" box (slate-900) inside light articles
- Code blocks (slate-900): conventional exception, suggest keeping.
Decision needed (see §7): restyle these as true Black-with-Mist "dividers" or convert to light.

**Off-palette illustration colors** in ServicesV2 tiles (indigo `#6366F1`, pink `#EC4899`, amber, sky, emerald, reds): these are inside miniature product mockups, closer to imagery than UI. Lower priority; align them to the chart palette (Anchor, Cyan, Emerald `#059669`, Amber `#F59E0B`, Violet `#7C3AED`) when the tiles are reworked.

---

## 3. Structure and emphasis violations

**Eyebrow text + ALL CAPS (32 `uppercase` instances; both banned):**
- Home "How we work" eyebrow (`text-sm uppercase tracking-[0.2em] text-accent`), the textbook case
- LogoMarquee label, FooterV2 column titles ("Follow"/"Explore"), FounderSection "Founder, RSL/A" credit
- Blog: the H1 "Blog" is literally styled as an eyebrow (text-sm uppercase gray), category pills, ToC labels ("Back to Blog", "% complete", "Summarize this article")
- PortableText: "Free Resource" / "Download Ready" kickers, stats-card labels
- Work filter select, ShareBar "Share", PersonCard "Powered by RSL/A", legal page back-links, CRM/kanban mock labels
Fix: sentence case everywhere, hierarchy from size/weight. Structure is headline → subheadline → description.

**Title Case (brand: sentence case for headings, buttons, nav, labels, everything):**
"Let's Talk", "See the Work", "Read More Testimonials", "Show Less", "All Categories", "All Topics", "All Articles", "Get The Insider", "Save My Info", "Text Me", "Visit Website", "Back to Home", "Book a Call", "Download Again", "All Services", "Cookie Settings", "Privacy Policy"/"Terms of Service" (footer labels), "Key Takeaways" → "Key takeaways", "The Bottom Line" → "The bottom line", and all serviceData headlines ("Get Found. Get Chosen.", "Automate the Work. Keep the Margin.", "One System. Every Lead, Every Client.", "Build What Doesn't Exist Yet.").

**Dashes (never, anywhere):**
- `PortableTextRenderer.jsx` caseStudyImage caption: renders ` — ` between caption and credit (the one true em dash in rendered output)
- Spaced-hyphen-as-dash: Bakersfield subheadline ("Bakersfield - we build..."), "404 - Article Not Found" / "404 - Case Study Not Found", newsletter signature "- Rahul"
- Blog content: 0 em dashes across all 39 local post sources. The pipeline already enforces this.

**Emphasis rules:**
- `em` mark renders italic → re-map (italic retired; bold = importance, quotes for titles)
- Blockquotes: Cormorant italic → Satoshi Bold or Medium treatment per brand (quotation marks, no italics)
- Captions italic gray → 13px Medium Ink
- Underlined links in articles ✓ already correct; make underline color solid
- `highlight-mark` marker-highlight → the display-blue key-phrase pattern instead

**Alignment:** Testimonials heading, CTA bands, About pull-quote, Work/Services/Contact heroes are centered. Brand: left-aligned always; centered only for heroes/covers of ≤3 lines. The page heroes qualify; the section headings and long quote don't. Apply judgment during the sweep.

**Radii/components:** buttons currently rounded-xl (12px) vs `--radius-button: 10px`; callouts rounded-[1.5rem] (24px) vs `--radius-callout: 12px`; callout surface should be Frost + Hairline. `--radius: 0.5rem` shadcn var vs brand values.

---

## 4. Voice and copy deltas (smaller than expected)

The chrome copy is largely clean: no "leverage/synergy/optimize/streamline" in visible site copy (legal pages use "optimize" functionally; fine). The strong bits are genuinely on-brand already: the About origin story ("Then I got laid off." / "And honestly?"), NotFound ("You broke something. Just kidding."), and the serviceData FAQ honesty ("anyone who does is either lying or does not understand how search works" is straight from the sales philosophy seed bank).

To fix:
- **"founders"** (retired): About x3, FounderSection, prerender templates, Terms §"businesses and founders" → owners / service business owners
- **"growth mapping call"** framing (CtaWithGlow, FooterV2, DiscoveryCall meta, contact H1) + "audit your funnel... where AI moves the needle" → diagnosis framing ("I can't tell you which offer fits until I know your situation", doctor line)
- Home intro: "proprietary AI-driven consulting stack", "both SMB and enterprise", "Hundreds of thousands generated" (vague; brand demands specific numbers; the case-study metrics right below it have real ones)
- Work subhead "We help customers achieve measurable results" fails the says-everything-means-nothing test
- "End-to-end" → "end to end" (Services intro, meta), and a light pass on hyphenated compounds in marketing copy per the voice table ("follow-up" → "follow up" etc.)
- Blog content: of 39 local sources, 2 posts contain "founders", 2 "leverage", 2 "seamless/streamline", 6 "delve/crucial/landscape" (some may be quotes/code). One `/blogEngine` cleanup pass; small job.
- Testimonials are customer quotes; leave verbatim.

---

## 5. Already aligned (don't touch)

- Light-first foundation and a blue-accent identity (the retheme is a shift, not a rebuild)
- Satoshi as primary; `tracking-brand-tight/-tighter` utilities already match brand tracking values
- Sentence case in most body-page H2s ("How it started", "From first call to launch.")
- Real testimonials with real names; specific numbers in case-study metrics ("$600 into $36K", "60X ROAS")
- Social links in footer + person schema match the brand handle table (org node adds company LinkedIn/Facebook pages; person node adds GitHub; both fine)
- Blog: dash-free content, underlined links, tabular-nums on stats, TL;DR + key-takeaways structure, no fabricated review markup
- `prefers-reduced-motion` respected in all animated components; `once: true` entrances
- og-image.png: correct logo blue on a dark cover surface

---

## 6. Side findings (not brand, worth fixing)

1. **Live bug:** navbar mega-menu links "Search Visibility" to `/services/search-visibility`. The vercel.json 301 → `/services/seo` only fires on server hits; client-side navigation falls through to the `/services/:citySlug` catch-all and renders CityHub's "Location not found" state. Point the navbar at `/services/seo` (or add the redirect client-side).
2. **NAP mismatch:** `siteConfig.ts` zip `93301` vs `structuredData.mjs` zip `93311`. Local SEO wants these identical (brain.md's canonical NAP record should say which).
3. **Stale docs:** `brain.md` describes FooterV2 as "light theme," lists routes that no longer exist (/sid, /ai-for/:slug), and its palette table shows the old textMuted value. `design-system/master.md` is an April generator artifact with a palette (#0369A1) and body font (General Sans) that match nothing; replace it with a pointer to `brand-guidelines/design-tokens.css` after the retheme.
4. Service detail pages are intentionally blank since 2026-07-22 (SEO shells; `ServiceLayout.jsx` is currently unused by any page). The rebuild should happen directly in the new brand voice + pitch ladder using the good FAQ content already in `serviceData.js`.
5. The GHL booking widget on /contact is styled inside GoHighLevel, not this repo (`ghl-rsla/` white-label CSS). Brand-matching it is a separate task.
6. The email input in `GatedResourceBlock` and both newsletter cards is under 16px → iOS zooms on focus (fixing for brand also fixes UX).

---

## 7. Decisions Rahul needs to make

1. **Positioning scope and timing.** The audience flip (B2B/$500K+ → solopreneurs + small service businesses) is the biggest change and it touches title tags and schema, i.e. SEO surface. Do the visual system and the positioning copy ship together, or visuals first and copy as its own pass?
2. **The Caveat "A Weekly Note" newsletter identity** (Insider page, both newsletter cards, "- Rahul" signature). The guidelines as written retire it (Satoshi only). Kill it, or amend the guidelines with a scoped exception for the newsletter?
3. **Dark surfaces.** Footer, blog post hero, and the CTA band: keep as brand-legal "covers/dividers" (restyled to pure `#000000` + solid Mist text), or convert to light? The guide leans light-first; a footer is a stretch as a "divider."
4. **Hero replacement.** The aurora gradient + cyan is the site's face and is retired by the guide. The guide's native answer: flat Paper hero, Display type, one Anchor Blue key-phrase highlight, carrying the One Thing. Sign-off wanted before that swap.
5. **Meta titles.** Keep keyword-first meta titles (e.g. "Local SEO Services...") while on-page copy follows the pitch ladder? (Recommended: yes.)

---

## 8. Suggested sequence

**Phase 1: Foundation (mechanical, high visual impact).** Import/mirror `design-tokens.css` values into tailwind.config + index.css (Paper/Mist/Hairline/Ink/Anchor/Anchor Deep/Frost). Purge fonts to Satoshi Medium + Bold woff2, drop Regular/italics/Caveat/Cormorant @font-faces, fix preloads. Replace logo files from `brand-guidelines/rsla-logo/`, regenerate favicon set. Sweep weights (extrabold/semibold → bold; normal → medium; body default to 500), kill gray text tiers, solid hovers to Anchor Deep, borders to Hairline, radii. The 9 hardcoded `#0066E0` JS literals.
**Phase 2: Positioning copy.** index.html + siteConfig + structuredData + prerender + Hero + Home FAQ + About + Services + Work meta, using bios-and-boilerplate. Kill "founders" and "digital marketing". Fix the caption em dash and spaced hyphens.
**Phase 3: Pitch ladder.** Reorder the five service surfaces, resize bento (Automation gets the big tile), reframe "Search Visibility" → "Recommended by AI" outcome-first, align nav slugs (fixes the search-visibility bug).
**Phase 4: Component redesign** where decoration died: hero backdrop, CTA band, footer, blog post header, newsletter cards, beams/glows, eyebrow removals, sentence-casing, blockquote/em/caption renderers.
**Phase 5: Content.** Blog cleanup pass (~6-8 posts), rebuild the five service pages in new voice, case-study thumbnail text default `#FFFFFF` → Mist.
**Phase 6: Housekeeping.** brain.md corrections, design-system/master.md replacement, CLAUDE.md stack table (fonts line), log.md.

Phases 1 and 2 deliver most of the perceived rebrand. 3 and 4 are where design judgment lives. Estimated blast radius: every page, but the majority of edits are mechanical class swaps concentrated in ~25 components.
