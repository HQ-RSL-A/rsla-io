# RSL/A Growth Plan — A / B / C (2026-06-24)

Grounded in GA4 (prop 516387648), GSC (sc-domain:rsla.io), and SEMrush data. See `LOG.md` (2026-06-23/24 entry) and memories `rsla-growth-strategy`, `rsla-indexing-policy`.

**Two-engine model.** Engine 1 = AI/Claude/GHL informational content (authority, AI citations, brand — earns the only real editorial links; converts to ~0 leads). Engine 2 = commercial service pages + Bakersfield/Kern local + GBP (leads). Bridge them with internal links. North star: $10K/mo, DA, rankings, AI citations, value to readers + AI.

---

## Phase 0 — Cleanup ✅ DONE (branch `seoGrowthPhase0`, QA passed, NOT deployed)
Redirect policy in `vercel.json`; 7 dead case-study links removed from both `serviceData.js` and `prerender.mjs` and replaced with the 5 real published case studies; Bakersfield schema `ProfessionalService`→`Service`; prerendered nav links all 5 services. Build + lint clean, 0 dead slugs.

**Deploy steps (need Rahul):** merge/push `seoGrowthPhase0` → main (auto-deploys). Then in GSC: remove legacy `http://rsla.io/sitemap.xml`, run Validate Fix once on the 404 issue, resubmit sitemap.

---

## Plan A — Harvest + Bridge (highest ROI; traffic already exists)
Convert existing informational traffic (Claude/GHL, pos 3-9, ~64K USA impressions) into AI citations + pipeline.

- **A1 — AEO on top posts** (`anthropic-claude-products-guide`, `claude-code-vs-cowork-vs-claude-app`, `gohighlevel-updates-2026`, `go-high-level-pricing`, `what-is-go-high-level`): answer-first block under each H2, TL;DR, verify FAQ/HowTo schema. Goal = get cited in AI Overviews/ChatGPT/Perplexity. → Sanity content (use `/blogEngine` + `/humanizer`). **Needs Rahul: voice/accuracy review.**
- **A2 — Rank-push pos 8-13 high-impression pages** (`gohighlevel pricing`, `claude code vs cowork`): depth, freshness (`dateModified`), full query-cluster coverage, internal links in. → content + linking.
- **A3 — The bridge:** contextual links + soft CTA from high-traffic posts → matching service pages (GHL→`/services/crm-systems`, Claude→`/services/ai-automations`) + quiz/lead magnet. Options: (a) code-level "Related services" block in `BlogInner` keyed by category — **needs design review (`emilDesignEng`)**; (b) in-body links in Sanity for the top 5 — content edit. Recommend both.
- **QA:** build, Lighthouse, Rich Results test on edited posts.

## Plan B — Commercial / Local (leads)
- **B1 — Salon / GHL-CRM vertical page** (you rank pos 4 "hair salon crm", pos 9 "salon crm"): build `/services/salon-crm` (or `/gohighlevel-for-salons`) on the `ServiceLayout` pattern using existing GHL-for-salons material + the real salon case study ($600→$36K, 60X). Route + prerender + sitemap + `Service` schema. **Needs Rahul: offer/positioning + design sign-off** (buildable to existing patterns). Replicable to restaurants, home services.
- **B2 — Service-page commercial SEO:** sharpen metaTitle/description/keywords + add depth/FAQs for buyer terms ("web design agency", "GoHighLevel setup", "AI automation agency", "local SEO services"). `serviceData.js` + `prerender.mjs` (dedupe first — see Tech debt). Lower risk; positioning needs review.
- **B3 — Bakersfield/Kern local (GBP live + citations ✅):** strengthen the existing Bakersfield page with differentiated local content + local FAQs + GBP signals; add nearby city pages (Delano, Shafter, Tehachapi, Arvin, Wasco) ONLY with genuinely unique local content. **Avoid the thin-template trap — site already has 131 "crawled, not indexed".** **Needs Rahul: real local specifics; which cities.**

## Plan C — Authority / DA / Mentions
- **C1 — Disavow:** curated file ready (`~/Downloads/disavow-curated-2026-06-24.txt`, 93 spam domains). **HOLD unless manual action / ranking harm.** Review borderline old-brand cluster (`rslmediahub.com` AS35, `myrsla.com`, `connectrsl.com`).
- **C2 — Linkable asset:** the AI/GHL content earns the only real editorial links — lean in. Build 1 original-data study (from your own GSC/GA data) or a definitive tool/guide engineered for links + AI citations.
- **C3 — Light digital PR / guest posts** in the AI-marketing niche (off-site, manual).
- **C4 — Internal linking** (overlaps A3) compounds DA distribution.
- **C5 — GA4 internal-traffic filter:** exclude Rahul's own Bakersfield/dev traffic (currently inflates "Bakersfield conversions"). GA4 Admin. Do first — data hygiene.

---

## Autonomy blockers (need Rahul)
Case-study writing (verified client data) · live blog content edits (voice/accuracy) · new-page + bridge-block design sign-off · local pSEO content · service positioning · deploy approval + GSC actions · GA4 admin filter.

## Recommended sequence
Deploy Phase 0 → C5 GA4 filter (instant data hygiene) → A3 bridge + A1 AEO on top 5 (harvest) → B1 salon vertical (nearest commercial win) → B3 Bakersfield strengthen + 1-2 city pages done right → C2 linkable asset; C1 disavow only if needed.

## Tech debt found
- `prerender.mjs` duplicates `serviceData.js` service objects — dedupe by importing shared data (removes redundancy, prevents drift).
- Pre-existing empty `react-vendor` manualChunk in the Vite config.
