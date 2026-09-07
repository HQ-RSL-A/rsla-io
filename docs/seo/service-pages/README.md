# Service pages copy set (2026-09-06)

Thirteen pages of copy for rsla.io's services, written overnight on 2026-09-06 from Rahul's brief, DataForSEO research, live SERP reads, and the seo-intel playbooks. One file per page. Counts come from `check-copy.py`, never from a person's typing; run it after any edit.

```bash
python3 docs/seo/service-pages/check-copy.py          # manifest + problems + shared sentences
python3 docs/seo/service-pages/check-copy.py --json   # also writes manifest.json
```

Task tracking lives in Linear (project RSL/A, parent issue in `tracker.md`) with `tracker.md` as the local mirror.

## Architecture

Rahul's rule (2026-09-06): the primary service pages speak to every visitor, from any state. Bakersfield gets a sub-listing per service, keyword optimized, to rank locally. That matches the URL convention he approved on 2026-07-20 (`/{city}/{service}` money pages, `/{city}` hub, plain noun service slugs) and the HeyTony home base rule (the flagship city may carry one page per service; satellite towns get one page each).

| File | URL | Keyword (US volume/mo, KD) | Words target | Notes |
|---|---|---|---|---|
| services-websites.md | /services/websites | small business website design (2,400, KD 42) | 1200 to 1400 | Parent. Family adds web design for small business 2,400, website design services 6,600 |
| services-websites-redesign.md | /services/websites/redesign | website redesign services (6,600, KD 10) | 1500 to 1800 | Best national keyword found: 6 of 9 results are agency service pages |
| services-seo.md | /services/seo | seo services for small business (4,400, KD 31) | 1300 to 1500 | Parent. Title uses the sibling phrasing "small business SEO services" (4,400) |
| services-seo-local.md | /services/seo/local | local seo services (8,100, KD 34) | 1400 to 1600 | Family adds local seo for small business 1,300 (KD 21), local seo company 3,600 |
| services-seo-programmatic.md | /services/seo/programmatic | programmatic seo services (50, KD 0) | 900 to 1100 | Tiny volume, zero difficulty, service pages rank |
| services-automations.md | /services/automations | ai automation agency (4,400, KD 19) | 1300 to 1500 | Family adds ai automation services 590 (KD 1), consultant 480 (KD 0), company 390 |
| services-crm.md | /services/crm | gohighlevel expert (210, KD 0) | 1800 to 2000 | Family adds gohighlevel agency 260, ghl expert 170, gohighlevel setup 50 |
| services-custom-builds.md | /services/custom-builds | custom software development for small business (70, KD 0) | 800 to 1000 | Family adds custom business software 110 (KD 7), custom business app development 90 |
| bakersfield.md | /bakersfield | marketing agency bakersfield (40, KD 14) | 800 to 1000 | Hub. Replaces /services/bakersfield with a one hop 301 |
| bakersfield-websites.md | /bakersfield/websites | web design bakersfield (390, KD 55 by tool, page one says lower) | 1100 to 1300 | Same cluster: website design bakersfield, bakersfield web design |
| bakersfield-seo.md | /bakersfield/seo | bakersfield seo company (40, KD 0) | 1600 to 1750 | Cluster: seo bakersfield 50, seo company bakersfield 40, seo services bakersfield 20 |
| bakersfield-automations.md | /bakersfield/automations | ai automation agency bakersfield (0 measured) | 950 to 1150 | Least contested map pack term (LeadSnap 2026-06-09); "near me" and AI answers land here |
| bakersfield-crm.md | /bakersfield/crm | crm bakersfield (0 measured) | 800 to 950 | Built because CRM is one of the four services to rank locally |

All volumes: Google Ads data through DataForSEO, `location_name: United States`, pulled 2026-09-06. Bakersfield volumes are US scope with the city in the query, not city scoped. KD is DataForSEO Labs.

## Why these keywords and not the obvious ones

Every candidate was checked against the live top ten, per the standing rule that volume and intent labels are a shortlist, never a decision.

- "crm consultant" (590/mo) looked ideal for the CRM page. The page one is Indeed and ZipRecruiter job listings, "what is a CRM consultant" explainers, and Salesforce consultancies. Rejected. "custom crm" (1,000) is no code builders and dev shops. "gohighlevel expert" has a clean hire intent SERP, zero difficulty, and RSL/A already ranks for GoHighLevel content (the blog's largest organic source), so the CRM page targets it and keeps "custom CRM" as a phrase, not a target.
- "ai automation agency" (4,400) is polluted with "how to start an agency" results, and the Google AI Overview literally asks the searcher whether they want to hire or start one. The hire intent share is real and growing (yearly trend +83 percent), the family of cleaner phrasings ("ai automation services", "consultant", "company") all sit at KD 0 to 10, and one page covers all of them. Kept.
- "small business website design" (2,400) has a DIY heavy SERP (Forbes, Wix, Canva). It stays as the parent's keyword because it is the audience's phrasing, but the real national win is "website redesign services" (6,600, KD 10) where six of nine results are agency service pages. That is why the redesign child page exists.
- "local seo services" (8,100, KD 34) is dominated by large agencies. The page targets it anyway because the small business phrasings in the same family (KD 14 to 21) are winnable and one page ranks for all phrasings of one intent.
- "custom software development" (2,400, KD 32) is agency listicles and dev shops. The small business phrasing has a zero difficulty SERP with a 684 word page at number one. Rahul's positioning (internal tools for the client's own use, never SaaS) fits the small business phrasing exactly.
- Bakersfield: "web design bakersfield" is the only local term with real volume (390, spiking to 1,000 to 1,300 in Oct and Nov 2025). Every automation and CRM phrasing with Bakersfield in it has zero measured volume. Those two pages exist for the map pack, "near me" queries, AI assistants, and the GBP services list, and the README says so on each file.

## What the live Bakersfield SERPs showed (2026-09-06)

- Web design: map pack Acme (9 reviews), Chavez (37), Fluxar (18). Organic: Liset Alanis homepage (1,777 words), Mantera city page (1,011), Yelp, ThrillX of Toronto (3,317), Cybernautic, Thervo, Donut, TechX, Thumbtack.
- SEO company: map pack Marketing1on1 (5), Acme (9), Citryn (48). Organic: Thrive of Dallas (2,415), Mantera (1,519), Acme homepage (2,008), then SERPninja, Elit-Web (Kyiv), Expertise, 1Digital (Philadelphia), Divinate, seo.co. Almost all templated city pages from elsewhere.
- Marketing agency: Citryn homepage (655 words) leads, then Yelp, Mantera, Instagram, the Chamber directory, ICS Creative, eMedia, Barton, DesignRush. Real locals with offices; the hub earns this over quarters.
- AI automation agency: a page one of remote agencies with Bakersfield pages (theautomators.ai 1,992 words, Torq MSP 316, creativegenius.ai 2,098, CodeWCG, Iva Tech, SynergenIQ, Epic AI) plus a local pack with two reviews between three listings.

Word targets came from the lowest of the top three commercial pages plus roughly 100 words, measured by script from the fetched HTML with header, footer, nav, and scripts stripped.

## Ground truth from Search Console (pulled 2026-09-06)

- Queries containing "bakersfield", 2026-06-08 to 2026-09-05: 2 impressions, 0 clicks.
- Last 28 days by page: /services/bakersfield 125 impressions at position 17.1; /services 49; the five service shells 4 to 32 impressions each; homepage 530 impressions, 9 clicks, position 12.3.
- The site's traffic is Claude product and GoHighLevel blog content. The GoHighLevel authority is why the CRM page targets a GoHighLevel keyword.

## Rules every page follows

- One keyword per page, keyword in the title and H1, answer in the first screen, one primary CTA repeated three times with a page specific lead-in line and the site's existing label "Book a call".
- Word count matched to the lowest ranking commercial page in the top three plus 100 to 200 words, measured.
- FAQ capped at four questions, sourced from People Also Ask on the live SERP, rendered as plain text, never an accordion.
- Proof is real and published only: the five published case studies and the five testimonials already on the site. Draft case studies in Sanity (Spice on a Slice, AdReviveAI, the cleaning company, the nonprofit CRM) are not cited until published.
- Brand: no em or en dashes, no "digital marketing", no "founders", no "leverage" or "optimize" as a verb, sentence case, no eyebrow text, category label "marketing agency", automation never claims to bring in customers, "recommended by AI" is the outcome sentence before any acronym.
- National pages never lead with Bakersfield. Each carries one "In Kern County?" line linking its Bakersfield sibling. Each Bakersfield page links its national sibling for the full scope.
- Sibling pages share no sentence above 0.55 Jaccard (testimonials and CTA labels excepted); `check-copy.py` enforces it.
- Exact target phrase at least twice on the page, H1 included; word count at or above the low end of the competitor band; Bakersfield in at least half the H2s on every `/bakersfield` page. Added 2026-09-06 (RSL-374), each guarded by a checker rule.
- No stock cliches (Rahul, 2026-09-06): no "elevate" or "next level" hero lines, no "seamless" or "cutting edge" filler, no "passionate team" about copy, no Strategy / Design / Delivery card triads, no "ready to get started" CTAs. Say what we do and for whom; where an adjective would go, put a number. The phrases are banned in `check-copy.py`; the triads need a human read.

## Decisions taken on 2026-09-06 (Rahul: "make the right decision for now")

1. Pricing: no number on any page. Each page names the model (fixed project price or monthly retainer) and what moves it. Pricing models are for the review call.
2. Client naming: kept anonymous ("a Bakersfield landscaping company", "a local video production business") until consent is confirmed.
3. The free 49 point scan stays. One run per inquiry, fulfilled by hand in LeadSnap.
4. "GoHighLevel expert" stays, backed by the two published testimonials. "Certified" never appears and no account count is claimed.
5. The Claude Code link on the custom builds page stays.
6. "The coffee place on Ming" is cut.
7. The programmatic SEO page tells the lesson: 12 pages published March 2026, 2 earned impressions in five months, the second batch was never built.
8. Nav label "Search visibility" stays; the page H1 stays "SEO services for small businesses".
9. The pitch ladder order is applied everywhere: nav, footer, home bento, and the services index run automation, CRM, search visibility, websites, custom builds.
10. Added during the gap pass: a crawlable footer NAP with tap to call, a mobile call bar on the Bakersfield pages, and the IndexNow ping now runs only on Vercel production builds. A written inquiry form on /contact was built the same day (`03d5b87`) and pulled on 2026-09-07 (Rahul: hold off on a contact form). It is RSL-375 for later, with its GA4 events and GoHighLevel workflow (RSL-373) on hold under it.

## Decisions taken on 2026-09-07 (QA fix pass, RSL-377)

1. Sibling pages: the Bakersfield automations and CRM pages say what is only true there (the in person setup, Kern County distances and reception, the yard, the local clients, a local FAQ) and share no paragraph, hero, proof title, or CTA with their national page. The other three local pages keep their structure with the seams removed.
2. Exact phrase on the five local pages: at most one quoted search per page in the body ("Type "web design Bakersfield" into Google"), the second placement in an FAQ question or a natural sentence, never a noun jammed after the keyword. Each page argues something different about what the search returns.
3. CTAs: the final CTA keeps the "bring X, leave with Y" shape because it follows the CTA rule; the mid page CTAs no longer open with "Want"; no CTA line is shared between siblings; "Send us" is gone until a written channel exists.
4. Candor: claims of honesty ("straight answer", "we will tell you", "the truth", "The honest result") replaced with the policy or the demonstration they were standing in for. The programmatic page's 12 page lesson and "Who this is not for" are the model.
5. Testimonials: canonical text is `src/components/Testimonials.jsx` (Sid S. ends "results!"). A quote is used in full or cut at a sentence boundary from the end, never with a middle sentence dropped. Sid S. full on the redesign page, first two sentences on the websites page, third sentence alone on the two SEO pages.
6. Numbers: numerals for any measurement with a unit, any deliverable count, and anything 10 or over (4 to 6 weeks, 8 to 12 photos, 20 reviews, 49 points); words for small rhetorical counts (three businesses on the map, one page per service, four things).
7. US spelling: inquiry, never enquiry. The old site is "from 2018" everywhere it is dated.
8. Claims dropped for lack of a source: "we publish the rescans" (none since 2026-06-10), "more Kern County customers ask ChatGPT", "most clients stay on the retainer", the 72 hour services test, "a fraction of what a software agency charges". The Bakersfield vignettes are written as types, not as businesses we met.
9. The home page owns the brand line "Only you know what your time is worth"; the automations hero no longer repeats it.
10. `qa-pass.md` lives in this folder and is excluded from `check-copy.py` and `build-service-copy.mjs`.

## Still open for Rahul

- Consent to name Select Landscape and Teji Videos on the Bakersfield pages.
- On hold with the form (RSL-375, RSL-373): the GA4 events for `phone_click` and `inquiry_submit` and the GoHighLevel notify workflow. /contact is the calendar embed and the phone number. The "Send us" lead ins were reworded in the QA fix pass.
- Done 2026-09-06 (cliche pass): the home title is now "RSL/A | We put AI to work for small service businesses", the hero is the brand line with a lead naming the four services and the audience, and the B2B FAQ answers, "growth mapping call" CTAs, and stale prerender home copy are gone. Reword the hero if you want a different line; it is one string in `HeroV2.jsx` mirrored in `prerender.mjs` and `index.html`.
- LeadSnap schedule 10278 has produced no grid scans since 2026-06-10. The copy only promises rescans "as the profile climbs", which is honest, but the scan has to run before the Bakersfield SEO page has anything to publish.
- The CookieScript banner covers the hero CTA on the first mobile visit. That is the CMP layout, not the pages, and it was a deliberate 2026-08-17 decision.

## Audit against seo-intel (2026-09-06 09:20 PT)

Measured with the checker plus a reading level pass. Passes: one keyword per page, answer first, single H1 with the keyword, title front loaded on all 13, plain text FAQ capped at four, Service + FAQ + Breadcrumb schema in static HTML, tap to call, one primary CTA, crawlable footer NAP, reviews as text with no star markup, no "near me", no city by service matrix, home base exception, hub in nav and footer, 3 or more inbound links each, Flesch Kincaid grade 6.1 to 8.1 on every page.

Open (RSL-374): the exact target phrase never appears in the body on the five Bakersfield pages or the websites page (word order variants only); automations, crm, custom builds, and redesign sit 16 to 80 words under the low end of their competitor band; the city is in 4 of 9 H2s on Bakersfield SEO, 3 of 7 on websites, none on automations and CRM. The "local reviews only" location rule is void: Rahul, 2026-09-06, reviews are reviews and region does not matter. The "Book a call" label stays generic by the two button rule; the page specific lead in line above it carries the descriptive part.

Closed 2026-09-06 17:07 PT (RSL-374). The exact phrase now appears at least twice on all 13 pages, H1 included, so at least once in the body. The four short pages are inside their band (automations 1,336, redesign 1,530, CRM 1,826, custom builds 862 words; every addition is real content, no padding). Bakersfield is in at least half the H2s on every local page (hub 4 of 5, websites 5 of 8, SEO 6 of 10, automations 4 of 7, CRM 3 of 6). `check-copy.py` guards each of the three with its own rule, mutation tested. The stock cliches Rahul flagged the same day (hero lines, value prop filler, about page filler, service card triads, "ready to get started" CTAs) are in the banned list; the triad rule and "say what we do, for whom" need a human read.

## QA pass (2026-09-07)

Full read of the 13 pages against Rahul's brief: no cliches, sentence level, every piece of text intentional. Findings with line numbers are in `qa-pass.md`. Fixed the same day under RSL-377: every finding applied, the automations and CRM local pages rewritten, checker 0 problems and 0 shared sentences, build and verify green. The decisions taken during the fix are in the section above.

## The 10 to 20 inquiries a week question

Search Console, 28 days to 2026-09-06, whole site: 144 clicks, 59,756 impressions, nearly all of it Claude product and GoHighLevel posts. Queries containing "bakersfield": 2 impressions in 90 days. The Bakersfield cluster in the keyword map above adds up to about 580 searches a month across every phrasing that has measured volume (web design 390, the SEO phrasings 150, marketing agency 40, automation and CRM 0). Ranking first for all of it with a 25 percent click share is about 145 visits a month. At a 5 percent inquiry rate that is 7 inquiries a month, not 10 to 20 a week. These pages cannot hit that goal by themselves inside a month, and the copy is written so nobody has to pretend otherwise.

What can move that number in month one, in order:

1. The Google Business Profile. Map pack traffic is not in the numbers above. Reviews from 3 to 10 (RSL-371), the services list mirrored to the pages (RSL-370), and a weekly post do more than any page edit.
2. The blog traffic that already exists. Every indexed post and case study now links into the money pages with keyword anchors, and the money pages carry the inquiry path.
3. Search ads on "web design bakersfield" and the SEO phrasings, landing on the Bakersfield pages. The pages were built as landing pages: one keyword, one CTA, tap to call, plain text FAQ.
4. Direct outreach that points at the pages instead of a PDF.

The organic side compounds from month three. Judge the pages on Search Console impressions at 28 days and on rank at 90 days, not on inquiries at 30.

## Follow-up page candidates

- AI receptionist: 12,100/mo (90,500 in July 2026), KD 25, product intent. A page would have to compare tools honestly as well as sell the setup.
- AI SEO services / answer engine optimization services / generative engine optimization services: about 2,600/mo across the family, KD 2 to 19. A child under /services/seo.
- Kern towns (Delano, Tehachapi, Shafter, Wasco, Taft, Arvin): zero measured volume, and the July recon found no real local provider ranking. Gate on the Bakersfield pages showing impressions.
- Web design for contractors (1,000, KD 19) and web design for landscapers (170): industry pages, later.

## Build notes that apply to every page

- The FAQ component (`src/components/services/ServiceFaq.jsx`) renders `<details>` accordions. The copy requires plain visible text. Replace the component before building.
- `ServiceLayout` currently emits `areaServed: Country US`; the Bakersfield pages need `areaServed` set to Bakersfield plus the Kern towns from `rsla/local-seo/nap-canonical.md`.
- Testimonials repeat across pages by design (five quotes, thirteen pages). Swap in Bakersfield reviews on the local pages as they arrive; the review drip is its own Linear issue.
- Photos: real ones of Rahul working, never stock. The Bakersfield pages want one recognizably local shot each.
- After publishing, leave each page alone for a month, judge title and H1 changes after two weeks to a month, content changes after two to three months.

## Sources

- Brief: Rahul, 2026-09-06 (voice, two messages).
- Method: heyTony skill and `seo-intel/sources/creators/hey-tony/insiders/service-page-master.md`; `seo-intel/playbook/new-site.md`, `existing-site-audit.md`, `playbook/local/`.
- Prior research on disk: `docs/seo/local-seo-playbook-2026.md` (2026-07-20), `docs/seo/competitive-analysis-web-design-page.md` (2026-05-06), `rsla/local-seo/gbp-ranking-strategy.md` (2026-06-09).
- Data: DataForSEO (search_volume, keyword_suggestions, bulk_keyword_difficulty, serp/google/organic/live/advanced), Search Console `sc-domain:rsla.io`, Sanity `caseStudyV2` and `blogPostV2` for published slugs.
