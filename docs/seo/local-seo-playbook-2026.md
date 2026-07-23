# Local SEO Playbook - Bakersfield First (2026-07-20)

Executes Plan B3 (+ blog + pSEO tracks) of `docs/superpowers/plans/2026-06-24-abc-growth-plan.md`. Goal: rank in Bakersfield for service queries, convert them into leads, build a credibility base to later expand to LA / SF. Grounded in GSC (sc-domain:rsla.io), live SERP recon (2026-07-20), and a 104-agent deep-research run (22 sources fetched, 108 claims extracted, top 25 adversarially verified 3-0 except one refuted). Research artifacts: task `w2ere18bc`, claims dump in session scratchpad.

---

## 1. Ground truth (internal data, pulled 2026-07-20)

**Local visibility is zero.**
- 6 months of GSC: queries containing "bakersfield" = **5 impressions, 0 clicks** total. Best: "website design bakersfield" pos 21, "web design in bakersfield" pos 41, "marketing bakersfield" pos 41. Queries containing "kern" = zero rows.
- Overall site (90d): 953 clicks / 329K impressions / avg pos 8.2 / CTR 0.29%. Nearly all informational (Claude + GHL blog content). Engine 1 works; Engine 2 (leads) is flat.

**The one city page is indexed but uncompetitive.**
- `/services/bakersfield` (CityHub template): GSC URL inspection = "Submitted and indexed", crawled 2026-07-05, clean canonical, linked from `/services`. **Indexation is NOT the problem. The page loses on relevance + depth + proof.**
- It is one generic "city hub" targeting 8 keywords at once (marketing agency, web design, SEO, ...). Winners use a **dedicated page per service x city**.
- Its own FAQ says "our clients are primarily national" - honest but a weak local signal.
- No rich results detected on it.

**Assets already in place**
- GBP verified (service-area, hidden address, phone 661-466-5919), citations live via LeadSnap, services + description filled. **3 reviews.** GBP website link goes to homepage (`/?utm_source=gbp`).
- CityHub.jsx + cityData.js (1 city). IndustryPage pSEO template (12 pages live). ServiceDetail pages noIndexed (thin).
- Local-relevant blog assets to link from: GBP optimization guide 2026 (7.1K impressions), rank-higher-on-Google-Maps guide (5.9K), AEO for local businesses, med spa SEO.
- Entity graph (`structuredData.mjs`): #business LocalBusiness/ProfessionalService + #rahul Person on all indexed pages. llms.txt + prerender pipeline live.
- Authority Score 7/100, 78 referring domains (bulk old-brand spam). 131 pages "crawled, currently not indexed" - Google is already skeptical of thin pages here.
- **Phase 0 cleanup still unmerged on `seoGrowthPhase0`** (since 6/24). Merge -> deploy -> GSC validate + resubmit sitemap. Blocks everything.

---

## 2. SERP recon (live probes, 2026-07-20)

### "web design bakersfield"
Winners: **local solos with basic sites** - Liset Alanis (#1: transparent pricing $1,950/$3,450/$5,750, 19-question FAQ, physical address), Donut Web Design, PJL (visibly compromised site, still ranks). Plus out-of-town service-city pages: ThrillX (Toronto), Mantera `/our-services/web-design-bakersfield/`, Cybernautic, FreshySites, Chavez `/web-design-bakersfield/`. Yelp holds one slot.
**Read: highly winnable.**

### "marketing agency bakersfield"
Winners: real local agencies - Citryn (top), Mantera, Barton (45+ yrs, office), eMedia - plus chamber directory, Yelp, Instagram, DesignRush, out-of-town pSEO (ICS Creative, SirLinksalot). Hardest of the three: established locals with offices + reviews. Head term comes last, via homepage + hub + GBP over quarters.

### "seo company bakersfield ca"
Winners: **almost all out-of-town templated city pages** (Thrive, 1Digital, Acute, Elit-Web, Revenue Boomers, SERPninja list). Mantera is the only real local with a dedicated `/seo-bakersfield/` page.
**Read: weakest local field. A real Bakersfield SEO page can leapfrog remote templates.**

### Nearby towns ("web design delano ca" probe)
**Not one real local provider ranks.** 100% remote templated pSEO (one literally serves `/api/seo/page/...` URLs). Thin pages rank because nothing better exists. A genuinely local Kern agency page will stand out immediately.

### Anatomy of ranking pages (fetched + dissected)
| | Mantera (local) | ThrillX (remote) | Chavez (regional) |
|---|---|---|---|
| Words | ~1,800 | ~4,500-5,200 | ~850 |
| Dedicated service-city URL | Yes | Yes | Yes |
| Case studies w/ metrics | No | Yes (+187% leads etc.) | No |
| Testimonials | 4 | 10 | None |
| FAQs | None | 9 (incl. "$5,000+" price anchor) | Separate page |
| Real localization | Local phone only | Keyword + 4 neighborhood names | Multi-city footer |
| Pricing | None | Anchor in FAQ | Separate page |
**The localization bar is embarrassingly low.** Nobody uses local case studies, embedded reviews, local data, or founder visibility (matches May's `competitive-analysis-web-design-page.md`).

### Map pack benchmark
Citryn: 5.0 stars, 45-65 reviews, physical Rosedale Hwy address, 100% response rate. RSL/A: 3 reviews, hidden address.

---

## 3. Deep-research findings (what actually works in mid-2026)

All claims below survived 3-vote adversarial verification (votes shown) unless marked [practitioner: extracted, not adversarially verified].

### The SERP landscape
- 68.01% of US Google searches end without a click (Jan-Apr 2026, SparkToro/Similarweb; 60.45% in 2024). AI Overviews on 20%+ of all searches; presence cuts organic CTR ~58-60%. [3-0]
- **BUT: AIO prevalence by intent - informational 36%, commercial 8%, transactional 5%; question-format 85.9%, comparisons 95.4%.** Money queries like "web design bakersfield" still resolve through pack + organic. Question queries are AI-answered. [Seer, 2.43B impressions]
- If an AIO does appear: not being cited = CTR -67%; being cited roughly doubles clicks vs non-cited but stays ~38% below a no-AIO SERP. Citation is defensive. [3-0]
- AI local packs (mobile US, ~7% of tracked local keywords) show only 1-2 businesses, ~32% as many unique businesses as 3-packs. Winner-take-more. [3-0]
- Local pack ads: ~1% -> ~22% of tracked SERPs during 2025; LSAs 11% -> 31%. Skews to legal/home-services verticals; LSAs mostly do not serve marketing-agency categories. [3-0]
- AI Mode usage is tiny in practice (0.34% of US searches Jan-Apr 2026) and AI tools send <1% of referral traffic; a Sterling Sky client sees ChatGPT referrals = ~2% of Google traffic. Fishkin: local businesses remain one of the few categories that still benefit from SEO. [extracted]
- Consumer stated use of AI for local recommendations jumped 6% -> 45% YoY (BrightLocal 2026, n=1,002); stated adoption, not query share. [3-0]

### Map pack (GBP) factors - Whitespark 2026 survey (46+ experts, 187 factors) [3-0]
Top 5: (1) primary GBP category, (2) proximity to searcher, (3) keywords in business title, (4) physical address in city of search, (5) **open at time of search** (new; Google-confirmed signal, stronger since Nov 2023; rankings degrade in the final hour before close).
- **Hidden-address SAB = structural disadvantage** (#7 factor "address is showing"; Sterling Sky hide/restore tests replicated: rankings + calls dropped, pack even disappeared for one keyword; 8,186-listing study negative correlation). Showing an unserved address violates Google guidelines - do not fake it. Whitespark's Shaw dissents (thinks it's a pin bug). Practical read: expect a pack handicap, compensate elsewhere, win organic. [3-0]
- Biggest YoY change: review + behavioral signals. Rating 4-5 = #6 pack factor and #1 conversion factor; review quantity w/text #9; recency #11; pack CTR #13; **sustained influx over bursts #14**. [3-0]
- Velocity > volume: dental client at 60+/mo dominated, lost rank after an 18-day pause; Sterling Sky's "magic 10" - count effect plateaus ~10 reviews, then velocity carries. [3-0 on direction; n=1 mechanism]

### Local organic factors (our lane)
- **#1 factor: "Dedicated page for each service" (100). #2: geographic keyword relevance of content (90.5). #3: link authority (89.0).** Strong on-page geo relevance can nearly offset a weak link profile - the single most important finding for a DA-7 site. Dedicated service pages are also the #2 AI-visibility factor: same pages serve both channels. [3-0]

### Consumer trust thresholds (BrightLocal 2026) [3-0]
- 47% won't use a business with <20 reviews; only 9% accept 5 or fewer. **3 reviews fails half the market before the site is even seen.**
- 74% only weight reviews from the last 3 months; 32% want last-2-weeks (up from 20%).
- 68% require 4.0+ stars (up from 55%); 31% require 4.5+. 82% read AI review summaries. 80% likely to use a business that responds to all reviews; 50% put off by templated replies. [extracted]

### AI assistant visibility (GEO)
- #1 AI-visibility factor: **presence on expert-curated best-of lists**; 3 of top 5 are citation factors ("mentions are the new link"); #5 authority of third-party review sites. Action: get listed on prominent industry directories; ask ChatGPT/Gemini which sites matter. [3-0]
- Diversify reviews beyond Google (Facebook, Yelp, Bing Places - Facebook appears ~1.5x as often as Yelp on first-page Bing Places listings). Update/claim Bing Places. NOTE: the "ChatGPT = Bing data" mechanism was REFUTED 0-3; practitioner reporting describes a Foursquare-first stack with Bing/Yelp/directories secondary. Diversification is low-regret either way. [3-0 findings, mechanism refuted]
- NAP consistency + strong reviews across Yelp, BBB, MapQuest, YellowPages raise ChatGPT reference likelihood; GBP does NOT feed ChatGPT directly. [practitioner]
- Front-load answers: 44.2% of ChatGPT citations come from the first 30% of source text (1.2M-response analysis). Answer-first blocks on every page. [practitioner]
- Top-10 organic rank gives only ~25% chance of AIO citation (Ziptie) - AIO citation needs answer-shaped content, not just rank. [practitioner]

### Money-page anatomy [practitioner: Whitespark 20-element guide, BrightLocal, Sterling Sky]
- **#1 content element on a city/service page: reviews from customers in that city.**
- Core elements: NAP + hours, embedded map near top, city-specific services, local case-study narratives ("story of work done for customers in that town"), staff/founder visibility, town-specific photos, directions/landmark context, internal links to nearby-city pages, ONE clear CTA.
- **Pricing transparency: publish ranges.** Whitespark: clear pricing = lead qualification; BrightLocal: a range "can make the difference." (Liset Alanis ranks #1 in Bakersfield doing exactly this.)
- CTAs must be tested: a first-party A/B test found adding an "appointment" button DECREASED calls.
- Repeated blocks (service menus, pricing) across city pages carry near-zero duplicate risk; differentiate with city reviews, local advice, imagery.

### Programmatic city pages: viability + guardrails [practitioner]
- City pages CAN rank organically for a no-storefront SAB - they are an organic strategy, not a pack fix.
- Scale limit: **"a few dozen" templated pages is fine** (35 pages at 85% similarity all ranked + sold); hundreds-thousands raises penalty odds. Doorway policy explicitly covers city pages funneling to one destination; demotion or removal.
- Uniqueness bar: name-swap = duplication. BrightLocal: 40-60%+ unique per page. Standard: each page should work as "its own homepage for people in that town."
- Build pages ONLY for cities that generate (or can generate) real revenue - not every town on the map. Service areas should stay within ~2h drive of hub.
- Do not orphan them: internal links from trafficked pages or they die at indexation ("crawled, currently not indexed" is the doorway-quality symptom; healthy = indexed + impressions + clicks).
- Geo pages do not cannibalize each other (distinct geo queries).
- Per-city citations are NOT needed for SABs.
- Link GBP (and Yelp) directly to the matching money/hub page, not the homepage.

---

### Freshness pass (2026-07-21 - verified inline against primary sources, per Rahul's request)
- **All load-bearing figures re-confirmed at source with data windows:** 68.01% zero-click = Jan-Apr 2026 Similarweb US panel (pub 6/9/2026; excludes Google mobile app, so true share likely higher). AIO intent split (8% commercial / 5% transactional / 36% informational / 85.9% question) = Seer, Jan 2025-Feb 2026, 5.47M queries. Ahrefs -58% CTR = Dec 2025 window (pub 2/4/2026), correlational, position-1 desktop. AI Mode = 0.34% of US searches (vs Google's "1B monthly users" claim).
- **Trend softening (Seer):** organic CTR on AIO-present queries bottomed 1.3% (Dec 2025) then recovered to 2.4% (Feb 2026) vs 3.8% no-AIO - a ~37% gap at the endpoint, not 58%. Seer: the "decline is inevitable" assumption is disrupted. Zero-click pressure is real but not monotonic - blogs remain worth writing, especially as the cited source (+120% clicks per impression when cited).
- **NEW - ChatGPT May 7, 2026 sources change (Similarweb, desktop panel, pub 5/25/2026, verified 7/21):** prominent clickable brand links inside answers -> total ChatGPT referrals +157.7% WoW; homepage referrals +354.7%; homepages' share of ChatGPT clicks jumped from ~26-32% to ~60%; engagement improved (4.7 pages/visit). Base stays small (Ahrefs 2/2026: ChatGPT = 0.21% of site referral traffic vs Google ~40%, ~190x; "ChatGPT = 12% of Google volume" is an author estimate, not measurement). **Implication: AI referrals are growing fast off a small base and land on HOMEPAGES - brand/entity strength and hub/homepage quality are appreciating assets; deep-page-only plays get relatively less AI click flow.**
- **Algorithm activity (Google Search Status dashboard, primary, verified 7/21):** May 2026 core update (5/21, 11d21h rollout) + June 2026 spam update (6/24, unusually fast 2d1h). No July update announced as of 7/21. Two reads: (a) spam enforcement is active 3 weeks before we ship city pages - the few-real-pages guardrail is not optional; (b) our local invisibility baseline already includes both updates - it is structural, not an update artifact.
- **Durability posture 2027-2028** (practitioner consensus + labeled opinion): local discovery remains predominantly Google local surfaces and is relatively insulated vs informational sites (Whitespark survey, opinion). Behavioral + review signals RISING (GBP engagement factor #48 -> #34). Citations declining for traditional rank but 3 of top 5 AI-visibility factors (vendor-conflict flag: Whitespark sells citation services - directionally corroborated by independent coverage). Shaw forecast (opinion): AI Mode is the template for local search's future once ads integrate; actual usage today 0.34%. **Durable investments: entity/brand, review velocity, real local proof, being the cited source, curated-list presence. Decaying: CTR hacks, thin scaled pages, keyword stuffing. The playbook already sits on the durable side; no decision changes - raises the weight on hub quality (L2) and brand/entity work.**

## 4. Strategy (decisions)

1. **Split the war by intent.** Money queries ("web design bakersfield") = traditional pack + organic battle -> money pages. Question queries ("how much does a website cost in bakersfield") = 86% AIO -> blog posts engineered for citation. Different templates, different scoreboards.
2. **Ship service x city money pages on a simple URL formula (Rahul-approved 2026-07-20).** Convention: plain-noun service slugs used identically everywhere; URLs stay simple, titles/H1s carry the search phrasing (URL is a whisper of a signal; title + H1 + content do the ranking).
   - Local money page: `/{city}/{service}` -> `/bakersfield/websites`, `/bakersfield/seo`
   - City hub: `/{city}` -> `/bakersfield` (301 from `/services/bakersfield`, near-zero equity)
   - National service page: `/services/{service}` (unchanged pattern)
   - Service vocabulary: `websites`, `seo`, `automations`, `crm`, `custom-builds`. Renames while pages are still noIndexed (cheap now): `web-design` -> `websites` (flip the existing 301, update line-189 redirect destination to avoid chains), `ai-automations` -> `automations`, `crm-systems` -> `crm`, `custom-development` -> `custom-builds`. UI already says "Websites" (`displayName`).
   - Titles keep query language: `/bakersfield/websites` titled "Web Design in Bakersfield, CA | RSL/A" still targets "web design bakersfield" (the volume phrasing). Breadcrumbs: Home > Bakersfield > Websites.
   This is the #1-ranked organic factor (dedicated page per service, geo-relevant) executed literally.
3. **Out-localize with unfakeable proof.** Real case studies with dollar figures, founder visible, Bakersfield reviews on-page as they arrive, real local knowledge (ag, oil, healthcare, home services), transparent pricing ranges. Every competitor either fakes localization or skips proof; we do both for real.
4. **Accept the map-pack handicap; play organic to win.** Hidden address stays (guideline-compliant). Compensate: exact primary category, generous listed hours (openness = #5 factor), review velocity, GBP linking to the Bakersfield hub, GBP posts cadence.
5. **Reviews are a standing business process, not a campaign.** Milestone 1: 10 (the "magic 10"). Milestone 2: 20+ (the 47% trust threshold) at 4.9+, with a steady drip (2-4/month sustained beats a burst), text reviews, respond to every one personally. Diversify: Facebook, Yelp, Bing Places, Clutch.
6. **Citations/lists are the AI lever.** Clutch, UpCity, DesignRush, Expertise-class directories + the "best agency in Bakersfield" listicles that already rank (SirLinksalot, RatingCaptain, aiseomate). Claim Bing Places. Mentions are the new link.
7. **Kern towns: few, real, gated.** Only after Bakersfield money pages show impressions. Few-dozen ceiling never approached: Delano, Tehachapi, Shafter/Wasco (tier by revenue potential), CityHub template + genuine local content per the anatomy above. One page per town (no service x town matrix at this volume).
8. **LA / SF: separate later phase.** Beyond service-area logic (2h drive, no GBP leverage) - it becomes a pure organic + directories + AI-citations play requiring more domain authority. Earn Kern first; the case studies + reviews become the ammunition.

## 5. Execution phases

- **L0 - Unblock (Rahul, ~20 min):** merge `seoGrowthPhase0` -> main (auto-deploys), GSC: validate 404 fix, remove legacy sitemap, resubmit. Set GA4 internal-traffic filter (C5).
- **L1 - Reviews engine starts now (Rahul + Claude, ongoing):** list 10-15 past/current clients + collaborators; Claude drafts personalized asks (text reviews, staggered over weeks, not a blast); respond to every review personally. Targets: 10 by Sep, 20+ by Dec, drip forever. Also: claim Bing Places, Facebook + Yelp profiles review-ready.
- **L2 - Money pages (Claude builds, Rahul reviews):** slug renames + redirect flips per section 4.2 first; then MoneyPage template + `/bakersfield/websites` + `/bakersfield/seo` per section 3 anatomy: answer-first intro, case-study metrics, founder section, pricing ranges, 8-10 PAA-targeted FAQs, embedded map, city reviews block (grows as reviews arrive), Service + FAQPage + breadcrumb schema referencing #business/#rahul, prerender + sitemap. Move + upgrade `/services/bakersfield` -> `/bakersfield` hub (fix "primarily national" copy). GBP website link -> `/bakersfield`. Design pass via emilDesignEng; copy via voice DNA + humanizer.
- **L3 - Blog bridge (Claude via /blogEngine):** 4 question posts engineered for AIO/AI citation (answer in first 30% of text): website cost in Bakersfield, choosing a Bakersfield web designer, local SEO for Bakersfield businesses 2026, how Kern businesses show up in ChatGPT. Internal links -> money pages. Localize the two existing GBP/Maps guides + link them in.
- **L4 - Citations + lists (mixed):** Clutch/UpCity/DesignRush/Expertise profiles; pursue inclusion on the Bakersfield listicles that already rank; verify NAP everywhere matches LeadSnap canonical.
- **L5 - Kern towns (gated on L2 pages indexed + impressions trending):** Delano first, then Tehachapi, Shafter/Wasco. CityHub template, genuinely local content, linked from hub + footer.
- **L6 - LA / SF (gated on Kern traction + 20+ reviews):** revisit with own strategy doc.

**Measurement:** GSC local query set (bakersfield/kern/delano/tehachapi + service terms) monthly; GBP actions (calls, site clicks, direction requests); GA4 key events from local pages (Bakersfield self-traffic filtered); review count/velocity; AIO/AI-citation spot checks on the 4 question posts.

## 6. Open items for Rahul

- Merge Phase 0 (L0) - everything waits on this.
- Review-ask list: which 10-15 clients/collaborators first, and OK to draft asks.
- Pricing ranges sign-off for money pages (recommended: publish; it is how the #1 local site wins, it pre-qualifies leads, and only 2 of 11 analyzed competitors dare to).
- Confirm L2 scope: web design + SEO first (recommended); automation/GHL city page later.
- GBP: website link -> `/bakersfield` hub; widen listed hours (openness factor); confirm primary category stays "Marketing agency" vs "Website designer" (recommend keeping Marketing agency; category chase can wait for data).
- ~~URL convention~~ APPROVED 2026-07-20: `/{city}/{service}`, plain-noun slugs (see section 4.2).
