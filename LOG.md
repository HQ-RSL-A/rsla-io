# LOG.md - rslaWebsite

## 2026-07-21 - GSC fix execution: keeper posts turn out DELETED, sitemap hygiene done

Rahul approved the 2-item fix list from the 7-20 triage. Execution findings:
- **The 5 "archived" keeper posts are not archived - they were permanently deleted from Sanity** (`deleteArchivedPosts.mjs` in rslaStudio, ran ~April). Dataset holds exactly the 18 published posts in the sitemap; nothing with status archived exists. My 7-20 "republish old versions" option is impossible as stated. All 5 URLs have Wayback snapshots (Feb-Apr 2026): claude-code-remote-control-guide (12,283 imp, pos 7.3 in April data), what-is-claude-code-guide, openclaw-ai-assistant-security-lessons, best-crm-hair-stylists-salon-owners, lead-response-time-how-fast. Decision pending with Rahul: fresh rewrite at same slugs (fits A/B/C plan) vs interim Wayback restore.
- **GSC sitemap hygiene (Phase 0 deploy checklist):** resubmitted `https://rsla.io/sitemap.xml` (2026-07-21, pending processing). Legacy `http://rsla.io/sitemap.xml` removal blocked by the GSC MCP's `GSC_ALLOW_DESTRUCTIVE` safety flag - needs 5-sec manual removal in GSC UI (Sitemaps page).
- Confirmed production runs the Phase 0 branch build (deployed via `vercel --prod`; `main` is still at a0e49ba, pre-Phase-0). Redeploy not needed for this work.
- Med-spa post + ai-cold-email case study content fixes: blocked on Rahul interview (per A/B/C plan autonomy blockers).

## 2026-07-20 - GSC email triage (Phase 0 aftermath) - no action needed

Two GSC emails investigated via URL Inspection API (~50 URLs checked):
- **Jul 3 "issues fixed"**: the Phase 0 "Blocked by robots.txt" fix validated. Closed.
- **Jul 18 "Duplicate, Google chose different canonical than user"**: expected fallout from the Phase 0 redirect block, two flavors, both harmless:
  1. `/services/websites`: last-crawled HTML still self-canonicals; Google now picks `/services/web-design` (the live page). It is agreeing with our migration. Flips to "Page with redirect" on next crawl (sibling `/services/search-visibility` already did).
  2. `/blog/best-crm-solo-real-estate-agent`: Google rejected the many-to-one 301 to `what-is-go-high-level` (content not equivalent) and kept the old URL as its own canonical. Means no equity transfer (negligible anyway: ~367 imp, 0 clicks), URL stays deindexed regardless. Left as-is per indexing policy.
- All 35 sitemap URLs verified clean: 33 indexed, 0 canonical/robots/fetch issues. The 2 exceptions are "Crawled - currently not indexed" (`/blog/med-spa-seo-what-actually-works`, `/work/ai-cold-email-personalization`) - content-quality wait, Phase B material, not errors.
- Side observation: archived-in-Sanity keeper posts (`best-crm-hair-stylists-salon-owners`, `claude-code-remote-control-guide`, `what-is-claude-code-guide`, `lead-response-time-how-fast`, `openclaw-ai-assistant-security-lessons`) report "Page with redirect" (client-side bounce to /blog). Consistent with Phase B pending; they re-enter the sitemap when rewritten.
- **Full-report confirmation (same day, from Rahul's UI export):** all 9 buckets enumerated. Crawled-not-indexed = 58, but only the same 2 live pages matter; the rest is old `_next/static` chunks (pre-Vite Next.js build), archived posts, and feed files (rss.xml, sitemap.xml, llms.txt, robots.txt - normal there). Not found (7) and Page with redirect (30) all intentional. "Validation Failed" on those three buckets is expected (validation only passes if URLs get indexed; these are dead by design) - do not re-validate. `/blog/automate-client-intake-ai` shows "Discovered - currently not indexed" in the export but live inspection says indexed = stale report entry. Fix list unchanged: 2 live pages need content depth, 5 keeper posts need Phase B priority.

## 2026-06-10 - Full security audit + fixes (site + studio)

### What happened
Audited the whole codebase plus the studio subdomain for vulnerabilities and wrong implementations. The serverless API layer (form handlers, LLM endpoint), client bundle, and JSON-LD injection were already solid. Found one credential-exposure issue, two real code-level vulns, one half-finished correctness bug, and a few hardening gaps. Fixed everything fixable in code, verified end to end, committed and deployed.

### Fixed and shipped
- **Prerender stored-XSS hardening** (`scripts/prerender.mjs`): `ptToHtml` now runs `marked` output through `sanitize-html` before injecting CMS body into the static `<div id="prerender">`. `marked` does not strip inline HTML and the CSP allows `script-src 'unsafe-inline'`, so a Portable Text body with literal `<script>`/`<img onerror>` would have executed pre-hydration. CMS-authored (trusted) input, but it compounds with the token exposure below. Allowlist = marked's tag set; default schemes drop `javascript:`/`data:`.
- **Finished the `$`-replacement fix** (`scripts/prerender.mjs`): the 2026-06-03 fix only converted JSON-LD + body to function-form; the 12 `<meta>`/`<title>`/`<link>` replacements were still plain-string and corrupted `$$`/`$&` in titles/descriptions. All now function-form.
- **Spreadsheet formula injection** (`api/quiz-submit.mjs`): public quiz fields (name/phone/agency/city/answers) forwarded to the Google Sheet webhook now pass through `deFormula` (prefixes leading `= + - @` with `'`). Prevents `=IMPORTXML(...)` style exfiltration when the sheet is opened.
- **Rate-limiter fail-open visibility** (`api/lib/rateLimit.mjs`): warns when Upstash env is missing so disabled rate limiting is not silent.
- **Studio destructive scripts** (`rslaStudio/scripts/{delete,archive,clean}*.mjs`): live mutations now require explicit `--confirm`; no flags = safe dry run.
- **Dependency vulns**: `npm audit fix` (non-force) on both repos. Website now 0 vulnerabilities. Studio 31 -> 16 (the remaining 16 are Sanity-framework transitive moderates whose only npm "fix" is a bogus downgrade to sanity@2.x, so not applied). Lockfile-only; both builds verified.

### Verification
All 6 edited files pass `node --check`; the sanitizer provably strips `<script>`/`onerror`/`javascript:` while keeping formatting; the `$` fix preserves `$$$`/`$&`; full `vite build -> prerender -> sitemap -> validate` passes (0 errors) before and after the dep bumps; `sanity build` passes.

### Deployed
- Website: `32cbd28` (security) + `2a3e45e` (deps) pushed to `HQ-RSL-A/rsla-io` main. Auto-deploy fired correctly (`dpl_4ZqFuVX...`, READY, production). rsla.io serving the hardened build.
- Studio: `57dc670` (script safety) + `c406dd3` (deps) pushed to `HQ-RSL-A/rsla-studio` main.

### Needs Rahul (not fixable in code)
- **Rotate the Sanity write token.** A token (prefix `skAhaCsu...`) for project `yz25oyux` was hardcoded in committed scripts in BOTH the public `rsla-io` history and the private `rsla-studio` history. The 2026-04-17 cleanup (`fc6ecad`) moved the website to a new token (`skt8mPnN...`) and claims rotation, but `rslaStudio/.env` STILL references the old `skAhaCsu...` token. Decidable test: if studio content scripts have run since 2026-04-17, the token is live and recoverable from public history. Action: manage.sanity.io -> project `yz25oyux` -> API -> Tokens, delete all but `skt8mPnN...`, issue a fresh studio token, then I do the `.env` swap + a gitleaks pre-commit hook. (Second token `skN57wVL...` from the public blueprint.json lead magnet should also be confirmed revoked.)

### Follow-up shipped same day
- **structuredData.mjs**: committed the pending Organization `sameAs` update (company LinkedIn + Facebook in, personal LinkedIn + YouTube out). `1602367`, pushed.
- **gitleaks pre-commit hook** installed in BOTH repos (`.git/hooks/pre-commit`, local) after installing gitleaks 8.30 via brew. Scans staged changes, blocks commits that contain secrets, bypass with `git commit --no-verify`, degrades gracefully if gitleaks is absent. Functional-tested (planted a fake token, commit blocked; clean commits pass). Local hooks only, not shared via the repo.
- **Studio js-yaml**: added `overrides: { "js-yaml": "3.14.2" }` (a single transitive js-yaml@3.13.1 was pinned below the patched 3.14.2 and not bumpable in-range). Cleared 2 advisories (16 -> 14 moderate). `sanity build` verified. `3095b09`, pushed.
- **Studio uuid (residual, intentional)**: the remaining 14 moderate all trace to `uuid <11.1.1`. The tree has 4 uuid majors (8.3.2 / 10.0.0 / 11.1.1 / 13.0.2); a force-pin would break consumers of the other majors, and the advisory (buffer bounds in v3/v5/v6 with a `buf` arg) is not reachable by Sanity tooling. Left for an upstream Sanity bump or Dependabot. Website stays at 0 vulnerabilities.

## 2026-06-03 - Structured-data graph tidy + full schema audit

### What happened
Investigated the "rsla.io" SERP site-name question. Code was already correct (WebSite `name`, `og:site_name`, and `<title>` all say "RSL/A", crawled clean Jun 2). Google defaults to the bare domain because the de-slashed brand equals the domain, and GBP already shows "RSL/A". Then tidied the structured-data graph and audited every schema on the site.

### Changes
- **New `src/lib/structuredData.mjs`**: single source of truth for the global entity graph (Organization/LocalBusiness `#business` + WebSite `#website`). Both `scripts/prerender.mjs` and `src/components/Seo.jsx` import it, so prerendered and hydrated DOM can never drift.
- **`Seo.jsx` now always injects the global nodes** (gated on `!noIndex`). Before, it stripped the prerendered globals on hydration and inner pages never re-added them, so every non-home page silently lost Organization/WebSite after JS loaded.
- **`Home.jsx`**: removed duplicate inline Organization + WebSite (the client `Organization` also disagreed with the prerender `LocalBusiness`).
- **Founder Person now has a stable `@id` (`#rahul`)** for cumulative E-E-A-T and future ProfilePage linking.
- **Removed a fabricated `aggregateRating`** (4.5, 4,200 ratings) from the GoHighLevel `SoftwareApplication` on the go-high-level-pricing post. Client-only, unsourced, third-party product: a review-snippet guidelines liability.
- Verified: `vite build` + prerender (48 pages) + build validator all pass.

### Then implemented (full graph connect + drift kill + NAP)
- **Promoted Rahul to a canonical Person node** (`#rahul`) in structuredData.mjs, global on every indexed page. Org `founder` and all blog/case-study authors reference it by `@id`; `/about` is now a `ProfilePage` whose `mainEntity` points at it. Cumulative E-E-A-T.
- **Added `telephone` (+1-661-466-5919) and `priceRange` ($$$)** to the LocalBusiness node for GBP/citation NAP corroboration.
- **Connected the entity graph via `@id`**: blog/work listings `isPartOf` → `#website`; service/case-study/blog `provider`/`publisher`/`author` → `#business`/`#rahul`; `/services` folded into `#business` + offer catalog (removed the duplicate ProfessionalService node).
- **Killed per-page drift**: added breadcrumb to case studies (client) and all 5 service pages (client + prerender); reconciled the contact page schema so client + prerender are identical (ContactPage → about `#business`, isPartOf `#website`); fixed the Bakersfield node name.
- **Removed the GoHighLevel SoftwareApplication** entirely.
- **Fixed a prerender bug**: `inject()` used `String.replace(str, str)`, which treats `$$`/`$&` as special replacement tokens and corrupted dollar sequences (priceRange "$$$" rendered as "$$"; latent risk to all `$` body copy). Switched the JSON-LD and body injections to function-form replacements.
- Every change applied on BOTH layers (prerender static HTML + client hydrated DOM). Verified: vite build + prerender (48 pages) + validator pass; rendered `dist` spot-checked across home/about/services/service-detail/blog-listing/contact/blog-post/case-study.

### Deployed (live on rsla.io)
- Phone 661-466-5919 confirmed canonical. Committed `722632e`, pushed to `HQ-RSL-A/rsla-io` main.
- **Auto-deploy did NOT fire**: the GitHub→Vercel webhook didn't trigger a build (almost certainly the repo's move from the `rahullalia` user to the `HQ-RSL-A` org broke the Git integration). Deployed manually via `vercel --prod` (`dpl_9CVYwgxYKgxYKdSm8Fu4jNEEH5t4`, READY, production, aliased to rsla.io). Verified live via Vercel authenticated fetch: telephone, priceRange `$$$`, Person `#rahul`, and the full `@id` graph are serving.

### Needs Rahul
- **Git auto-deploy was broken** (two pushes, `722632e` and `7ef8fea`, never built, despite the Vercel link, GitHub App, and `createDeployments` all reading as correct). FIXED via CLI on 2026-06-03 (`vercel git disconnect --yes` then `vercel git connect https://github.com/HQ-RSL-A/rsla-io.git`), which re-bound the link to a fresh credential. The plain reconnect was a no-op (non-interactive disconnect defaults to "no"); the `--yes` force was required. Verified: the next push (`3eb5bbd`) auto-built within ~15s. Pushes to `main` deploy automatically again.

### Repo housekeeping (commit 530fb43)
- Committed `BRAIN.md` (GBP reference section) + `content/posts/gohighlevel-updates-2026-rewrite.md` (Phase-B rewrite draft, joins the other 38).
- Gitignored `caseStudyData/` (local SEMrush/GSC research behind the fieldshare + rsla case studies; kept on disk, out of the repo).
- Removed `scripts/fixRelatedPostKeys.mjs` (one-off; verified done, 0 duplicate `relatedPosts` keys across all 18 published posts).
- Docs updated: `CLAUDE.md`/`GEMINI.md` (fixed stale GitHub ref → `HQ-RSL-A/rsla-io`; added gotchas for structured-data single source, prerender `$`-replacement, git auto-deploy reconnect, Vercel bot challenge); `BRAIN.md` (rewrote the SEO entity-graph section, added `structuredData.mjs` to Key Files).

### Next steps (cold pickup)
- The "rsla.io" SERP site name is Google's call (brand ≈ domain + the slash), NOT a code bug. All signals are correct; the only lever is brand authority over time. Nothing to fix in code.
- Optional: relocate `caseStudyData/` into a dedicated research/archive folder (organization preference only).
- Publish the GHL rewrite draft to Sanity when ready (part of the Phase-B blog overhaul).
- Standing TODO list lives in `BRAIN.md > TODO (Next Session)`.
- **Bot challenge** (`x-vercel-mitigated: challenge`) started returning 403 to non-browser clients on rsla.io after the deploy-verification traffic (real browsers unaffected). Likely auto-triggered by ~50 rapid checks and should relax; if it persists, check Firewall / Attack Challenge Mode in the Vercel dashboard (matters for non-JS AI crawlers).

### Low-value schemas left as-is (noted, not removed)
- HowTo (Google deprecated the rich result; semantic/AEO value only), FAQPage (AEO-only since the 2025 rich-result removal, still worth keeping). Both fine to keep.

## 2026-06-01 - Google Business Profile Optimization (local SEO foundation)

### What happened
Optimized RSL/A's GBP end to end as the local SEO foundation (own Bakersfield, then expand via pSEO). Web-verified the home-based service-area-business approach against Google guidelines + Sterling Sky, audited the live profile, and finalized name, categories, description, phone, and service-area strategy. Next step is turning on LeadSnap citations.

### Decisions
- **Service-area business, address hidden.** Home-based, no walk-ins. The account is on the "no stored address" variant (GBP only lets you add an address if you show it publicly, so it's left off by design). Legitimate and Google-endorsed for home-based businesses.
- **Primary category Marketing agency.** Secondaries: Internet marketing service, Website designer, Advertising agency. Drop Software company + Business management consultant (dilute relevance).
- **Service areas Bakersfield + Kern County only.** Removed the over-broad US / NY / CA / LA / SF list. Big-city reach comes from pSEO pages, not GBP service areas. GBP ranks by proximity to the verified location, not the area list.
- **Phone switched to local 661-466-5919** (from the NY 516 number) for local trust + signal, locked before citations cement it.
- **Citations + reviews are now the top ranking levers.** With no stored address, citations (carrying the real hidden home address) become Google's main location-corroboration signal.

### Final description (pasted; goes live once verification clears)
> RSL/A is a marketing and AI automation agency in Bakersfield. The idea is simple. We build the systems that run your marketing, so you can get back to running your business.
>
> In practice that means websites that turn visitors into customers, local SEO that gets you found on Google, and showing up inside AI tools like ChatGPT too. We also handle your GoHighLevel and CRM, plus the AI agents and automations that work your leads, follow up, and clear the busywork.
>
> What makes us different is the analytics background. You get to see what's actually working, with real numbers on a dashboard.
>
> We work with founders and local businesses around Bakersfield and Kern County. If that's you, let's talk.

### Incomplete / next steps
- [ ] **Provide home address** to build the canonical NAP record (citations submit it, hidden via each directory's SAB setting).
- [ ] **Confirm GBP verification cleared + edits live** (profile showed a pending "verify you manage this business" notice, likely re-triggered by the phone change).
- [ ] **Confirm 661 is primary, 516 removed**, and 516 never enters a citation.
- [ ] Trim service areas if not already done; drop the 2 weak categories.
- [ ] Add to profile: 10 services, photos, 5 Q&As, first Google Post.
- [ ] **Turn on LeadSnap citations** with the canonical NAP once address + verification are confirmed.
- [ ] Add **LocalBusiness JSON-LD** to rsla.io matching the NAP (ties site + GBP + citations to one entity).
- [ ] Reviews: get the first 5 fast, then a steady drip.
- [ ] Then: Bakersfield pSEO; finish remaining case studies in the new format.

Config reference: BRAIN.md (Local SEO / Google Business Profile) + auto-memory `project_gbp_setup.md`.

---

## 2026-05-27 - Case Study Overhaul (5 of 12 complete)

### What happened
Rewrote 5 case studies with voice DNA + humanizer treatment, consistent framework, and new data. Created 1 new case study (RSL/A organic growth) from raw analytics data. Two code changes pushed to main.

### Case studies completed
1. **RSL/A organic growth** (NEW) - created from GA4/GSC/SEMrush data, SEO+AEO self-case-study
2. **Fieldshare** - full rewrite with ChatGPT citation screenshot, homepage screenshot, GSC chart, video embed
3. **Anchor Safety** - rewrite with new Notion dark mode screenshots, testimonial drafted
4. **Casagrande Salon** - rewrite with testimonial moved to proper fields, video testimonial to testimonialMedia
5. **Cold Email Personalization** - headings standardized, bold:colon bullets fixed, kept blueprint download

### Case study framework established
- First-person "We..." titles
- TLDR = company intro (not summary)
- Body: The Problem → The Solution → The Results (Title Case headings)
- Stats card in Results section
- No dividers, no bold:colon bullet patterns, no tech stack (removed from newer ones)
- Voice DNA + humanizer pass on all content
- Testimonial text + media in dedicated Sanity fields (not inline blockquotes)
- relatedCases: [] on all (prevents "More results" fallback)
- CTA URLs: /contact (not absolute)
- Meta titles without " | RSL/A" (component adds it)
- Backdated publishedAt for natural appearance

### Code changes
- `WorkInner.jsx`: Fixed relatedCases fallback - empty array now means "show nothing", only null/undefined triggers category-based fallback. Commit: `8298f33`
- `Work.jsx`: Updated subtitle to "We help customers achieve measurable results". Commit: `b3fa015`

### Images uploaded to Sanity
- RSL/A: SEMrush domain overview, GSC chart (testimonial media)
- Fieldshare: SEMrush overview, homepage screenshot, GSC chart, ChatGPT citation screenshot
- Anchor Safety: 2 new Notion dark mode screenshots (task dashboard, expense tracker)

### Still pending
- 7 case studies need rewriting: Proposal Generator, AdReviveAI SaaS Build, Spice on a Slice, AI Auto-Responder, Field Service Operations, Content Pipeline, Nonprofit Volunteer Automation
- Fieldshare: ChatGPT screenshot needs reordering in Sanity Studio (appended to end, should be in AI Search Visibility section)
- Other unpublished case studies (9 total) have status: draft and need the same treatment

---

## 2026-05-08 - Fix "Crawled - Currently Not Indexed" (GSC Permanent Fix)

### What happened
GSC reported 136 URLs as "Crawled - currently not indexed" and the count was growing (97 to 136 over 3 months). Root cause: the SPA catch-all rewrite in vercel.json served HTTP 200 + full homepage content for every dead URL (`_next/` chunks, old slugs, random URLs). Google saw these as real pages.

### Root cause
`/((?!api/).*)` rewrite to `/index.html` made every unknown URL return HTTP 200 with homepage title, canonical, OG tags, and pre-rendered content. The React NotFound component set noindex, but only after JS execution which Google often skips for low-priority pages.

### Changes
- **vercel.json**: Changed catch-all from `/((?!api/).*)` -> `/index.html` to `/((?!api/|_next/).*)` -> `/404.html`. Excludes `_next/` (Vercel native 404) and serves 404 page with noindex for all other unknown URLs.
- **scripts/prerender.mjs**: Added `dist/404.html` generation at dist root. Has `<meta name="robots" content="noindex, follow" />` baked into HTML (no JS required).
- **scripts/validateBuild.mjs** (new): Build-time validation that checks sitemap/prerender parity, no accidental noindex on sitemap pages, redirect destinations resolve, and 404.html exists. Breaks build on failure.
- **package.json**: Added `validateBuild.mjs` to build chain after sitemap generation.

### GSC breakdown (136 URLs)
- ~95 `_next/static/` chunks (old Next.js era, now get native 404)
- ~25 deleted blog/work URLs (already have 301 redirects, just need Google re-crawl)
- ~6 utility files (rss.xml, sitemap.xml, etc. - expected)
- 3 pagination URLs (canonicalize to /blog - expected)
- 5 real content pages (re-indexed manually in GSC)

### Re-indexed in GSC
- `/blog/med-spa-seo-what-actually-works`
- `/blog/how-to-rank-higher-on-google-maps-a-comprehensive-guide`
- `/work/nonprofit-crm-volunteer-automation`
- `/work/seo-content-marketing-automation`
- `/work/ai-lead-response-autoresponder`

### Monitoring
- Check GSC "Crawled - currently not indexed" count around May 25-June 1
- Expected: count drops as Google re-crawls `_next/` URLs (sees 404) and other dead URLs (sees noindex)

### Commits
- `0165692` fix(seo): serve 404 page for unknown URLs instead of homepage

---

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

---

## 2026-06-23/24 — GSC indexing audit + SEMrush/GA4 deep dive (diagnosis + staged fixes, NOT yet deployed)

### Trigger
GSC emails (May 14 dup-canonical, May 25 404, Jun 12 "fix failed"; Fieldshare 5xx ignored — separate site). User then supplied full GSC + SEMrush site-audit exports and asked for a data-grounded growth strategy.

### Diagnosis
- **GSC connection healthy** (sc-domain:rsla.io, siteOwner; sitemap Valid, 35 URLs, 0 errors). A legacy `http://rsla.io/sitemap.xml` is also registered — remove it.
- **Duplicate-canonical: 0 URLs now** — self-resolved via consolidation redirects. All 8 inspected keeper pages = "Submitted and indexed / PASS".
- **Not found (404): 6 URLs**, root-caused to (a) old URLs never redirected and (b) **redirects pointing to case-study pages that were never published** (broken redirect chains). Live tests confirmed `/work/local-seo-reputation-management`, `/work/seo-content-marketing-automation`, `/work/nonprofit-crm-volunteer-automation`, `/work/ai-proposal-generator-sales-workflow` all 404; several are hardcoded internal links in `src/data/serviceData.js` (7 dead case-study links across all 5 service pages).
- **"Fix failed" email**: GSC Validate Fix clicked on the 404 issue while redirects still pointed at 404s. "Page with redirect"/"noindex" issues were also being pointlessly validated.
- **Structured data invalid** on `/services/bakersfield`: `@type ProfessionalService` (a LocalBusiness, needs `address`) with invalid `provider` prop.
- **Orphaned/under-linked services**: prerendered HTML (no-JS crawlers) only linked `/services/bakersfield`; React nav links the other 5 but SEMrush crawls static HTML.

### Staged code changes (local only — nothing committed or deployed)
- `vercel.json`: repointed 5 broken redirect destinations to live pages; added redirects (111 total). NOTE: needs rework per indexing policy — pull redirects for the "coming-back" case-study slugs so they 404 (a redirect would block republishing).
- `scripts/prerender.mjs` + `src/pages/CityHub.jsx`: Bakersfield schema `ProfessionalService` → `Service` (provider valid, no address required); kept `provider: #business` ref.
- `scripts/prerender.mjs`: expanded prerendered `siteNav` to link all 5 service pages.

### Data findings (GA4 516387648 + GSC + SEMrush, 28d/90d)
- Traffic is **global + informational**: ~90% Claude product queries ("claude products" pos 3.2 = 53 clicks; dozens of "claude code vs cowork vs chat" variants) + GoHighLevel. Low-CTR pages are all position 8-13 (AI Overviews eat clicks); at pos 3 CTR is a healthy 2.8%.
- **Converts to ~0 leads.** Key events concentrate on /, /services/web-design, /work, go-high-level-pricing. Informational blog posts drive views, ~0 key events.
- **No commercial/local footprint** except leftover "salon CRM" (hair salon crm pos 4, salon crm pos 9) — an accidental but real foothold.
- **GA4 Bakersfield (265 sessions, 22 key events) ≈ Rahul's own traffic.** Data-center cities (Boardman, Council Bluffs, Ashburn…) are bots. Needs internal-traffic filter.
- **Backlinks: very low DA (best AS 2-5).** Real editorial links come from the AI/GHL content (agntcms, agenticdesign.school, klipy.ai, mola-solutions). Bulk "new backlinks" are old-brand (rslmediahub.*) PBN spam. SEMrush auto-disavow includes legit DesignRush listings — do NOT submit wholesale.

### Decisions
- **Indexing policy:** only ~35 live sitemap pages indexed; let dead URLs 404 and drop. 301 only URLs with backlinks/traffic. Leave coming-back case-study slugs as 404 (no redirect). No GSC Removals tool. (Memory: rsla-indexing-policy.)
- **Case studies:** don't fake/repoint; remove dead links now, publish the ~5 real case studies, re-add cards as each ships.
- **Strategy:** two-engine model (authority content vs commercial/local leads), bridged by internal links. (Memory: rsla-growth-strategy.)

### Pending (next)
- Rework `vercel.json` to indexing policy; remove the 7 dead case-study links from `serviceData.js`; build + deploy.
- GSC: remove http sitemap; after deploy run Validate Fix once; resubmit sitemap.
- GA4 internal-traffic filter. Curate (don't bulk-submit) disavow.
- CTR/AEO on pos 3-8 pages; write 5 case studies; commercial service-page SEO; Bakersfield pSEO (done right, not templated) + GBP; DA/linkable-asset plan.

### UPDATE (2026-06-24, overnight) — Phase 0 IMPLEMENTED + QA PASSED on branch `seoGrowthPhase0` (local only, not pushed/deployed)
Per Rahul's go-ahead ("Plan A/B/C, implement one by one, QA each step, clean code, no fabrication; I'm asleep, continue"). GBP for Bakersfield confirmed live with citations on.

**Done + verified:**
- `vercel.json`: reworked to indexing policy. 103 redirects. Coming-back case-study slugs + `/ai-for/*` removed (left to 404 so republishing isn't blocked). Kept only equity redirects (backlink-bearing) + fixed legacy chains. JSON valid; validateBuild confirms 101 redirect destinations resolve (no redirect → 404).
- `src/data/serviceData.js` + `scripts/prerender.mjs`: removed all 7 dead case-study links from the 5 service pages (both duplicate copies), replaced with the 5 REAL published case studies (titles/metrics pulled from Sanity — no fabrication). Both copies in sync.
- Bakersfield structured data: `ProfessionalService` (missing address + invalid `provider`) → `Service` (provider valid, areaServed kept) in both `CityHub.jsx` and `prerender.mjs`. Verified in dist: 1 `#business` node WITH address + 1 city `Service` node, all JSON-LD parses.
- Prerendered `siteNav` now links all 5 service pages (fixes orphaned/under-linked for no-JS crawlers).

**QA:** `vite build` + prerender + sitemap + validateBuild + rss + llms = exit 0, 0 errors / 0 warnings. ESLint on changed files clean. Zero dead case-study slugs anywhere in `src/`, `scripts/`, or `dist/`. 48 pages prerendered, 35/35 sitemap parity.

**Known redundancy flagged (not fixed — needs review):** `prerender.mjs` keeps a hand-maintained duplicate of `serviceData.js` (service objects). Should be deduped by importing the shared data. Also a pre-existing empty `react-vendor` manualChunk.

**Deploy:** NOT deployed (Rahul asleep; pushing to prod unattended is the one thing held back). Branch `seoGrowthPhase0` is deploy-ready. After deploy: remove the legacy `http://` sitemap in GSC, run Validate Fix once on the 404 issue, resubmit sitemap.

**A/B/C plan:** see `docs/superpowers/plans/2026-06-24-abc-growth-plan.md`. Curated disavow analysis in `~/Downloads` (review-before-submit).

## 2026-07-20 — Local SEO research + Bakersfield-first playbook

Rahul asked for a research-backed plan for local rankings (Bakersfield + Kern), programmatic SEO, and question-answering blogs, before touching design/content.

**Research done:**
- GSC: 6 months of "bakersfield" queries = 5 impressions, 0 clicks; zero "kern" queries. `/services/bakersfield` IS indexed (crawled 7/5, clean canonical) — the problem is competitiveness, not indexation.
- Live SERP recon on the 3 money queries + Delano probe; dissected 3 ranking competitor pages (Mantera, ThrillX, Chavez). Winners all use dedicated service-x-city URLs; localization bar is keyword-swap low; Delano has zero real local providers.
- Deep-research workflow (104 agents, 22 sources, 25 claims adversarially verified): AIO on only 8% commercial / 5% transactional queries (vs 86% question-format) → money pages fight traditional SERPs, blogs fight for AI citation. Whitespark 2026: #1 local organic factor = dedicated page per service + geo relevance (≈ offsets weak links at DA 7). Hidden-address SAB = replicated map-pack handicap (don't fake address; win organic). Reviews: 47% won't use <20 reviews, 74% weight last-3-months only, velocity > volume ("magic 10"). AI visibility: #1 = expert-curated lists; citations are the new link; refuted 0-3: "ChatGPT local = Bing data".

**Deliverable:** `docs/seo/localSeoPlaybook2026.md` — strategy + phases L0-L6 (L0 merge Phase 0; L1 review engine to 10→20+; L2 `/web-design-bakersfield` + `/seo-bakersfield` MoneyPage template + hub upgrade; L3 4 AIO-targeted question posts; L4 directories/lists; L5 gated Kern towns; L6 LA/SF later). Open items for Rahul in doc §6.

**Pending:** Phase 0 STILL unmerged (since 6/24) — first action. Then L1 review-ask list + L2 build.

## 2026-07-21 — URL convention + freshness pass (inline, agent-capped)

- **URL convention approved by Rahul:** `/{city}/{service}` money pages (`/bakersfield/websites`, `/bakersfield/seo`), `/{city}` hubs, plain-noun slugs everywhere. Slug renames planned while noIndexed: `web-design`→`websites` (flip existing 301), `ai-automations`→`automations`, `crm-systems`→`crm`, `custom-development`→`custom-builds`. Playbook §4.2.
- **Freshness research:** first re-run died on session limit (all 75 verifiers); Rahul capped agents (50, then ≤5/none) — workflows stopped, finished inline with 2 WebFetches against primaries. Verified: May 2026 core update (5/21) + June 2026 spam update (6/24, 2d rollout — spam enforcement active; city-page quality bar non-negotiable); ChatGPT May 7 sources change (+157.7% WoW referrals, ~60% now landing on HOMEPAGES → brand/entity + hub quality appreciating); Seer CTR-recovery trend (AIO-present CTR 1.3%→2.4%, gap ~37% at endpoint, not 58%). All prior load-bearing figures re-confirmed with data windows. Playbook §3 freshness section. No strategy changes; hub/brand weight up.
- **Standing preference recorded:** max ~5 well-briefed agents per task, prefer inline (memory: agent-budget).
