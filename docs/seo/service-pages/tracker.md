# Tracker: service pages and Bakersfield pages

Local mirror of the Linear issues in project **RSL/A** (team RSL). Linear owns status; this file is the fallback if Linear stops taking updates. Update both in the same change. Parent issue: [RSL-363](https://linear.app/rsla/issue/RSL-363/ship-the-service-pages-and-the-bakersfield-pages).

Last synced: 2026-09-06 06:40 PT (pages built, in review).

| ID | Task | Owner | State | Notes |
|---|---|---|---|---|
| RSL-363 | Ship the service pages and the Bakersfield pages | Rahul | In Progress | Parent. Copy and build done on `brand-visual-system`, not deployed |
| RSL-364 | Rahul: review the 13 page copy set and answer the open questions | Rahul | Todo | Decisions taken 2026-09-06 and the remaining questions are in `README.md` |
| RSL-365 | Rename the service slugs and flip the redirects | Claude | In Review | Routes, `vercel.json` 301s, sitemap, nav, footer, home bento done; old shells deleted |
| RSL-366 | Build the 8 national service pages from the copy set and drop noIndex | Claude | In Review | `MoneyPage.jsx` + `servicePages.generated.json`; `verify-service-pages.mjs` green |
| RSL-367 | Build the Bakersfield hub and its 4 money pages | Claude | In Review | Same template, rank grid from the June scan, mobile call bar, Kern towns schema |
| RSL-368 | Wire 3 inbound internal links into each new page from indexed posts | Claude | In Review | `blogServiceLinks.mjs`; every page has 3 or more, table below |
| RSL-369 | Publish: prerender, sitemap, IndexNow, request indexing in Search Console | Claude | Backlog | Blocked on Rahul's go to push and deploy; IndexNow now pings only on Vercel production builds |
| RSL-370 | Point the Google Business Profile at /bakersfield and mirror the services list | Rahul | Backlog | One core field at a time; update `nap-canonical.md` |
| RSL-371 | Run the review ask drip to 10 Google reviews | Rahul | Backlog | Names from Rahul, asks drafted by Claude, 1 to 2 a week |
| RSL-372 | Decide the follow up pages: AI receptionist, AI SEO, Kern towns | Rahul | Backlog | Candidates and volumes in `README.md` |
| RSL-373 | Wire the inquiry path: GTM events, GoHighLevel notify workflow | Rahul | Todo | GA4 tags for `phone_click` and `inquiry_submit`; workflow on tag `website-inquiry`; `GHL_API_KEY` and `GHL_LOCATION_ID` already on Vercel production |

## Order

RSL-364 first (nothing ships unreviewed). RSL-365 before RSL-366 and RSL-367 (routes). RSL-368 and RSL-369 after both builds. RSL-370 after RSL-367 is live. RSL-371 runs in parallel from now. RSL-372 waits for the first Search Console read on the Bakersfield pages.

## Inbound links log (in-content links from indexed posts and case studies, first three shown)

| Page | Link 1 | Link 2 | Link 3 |
|---|---|---|---|
| /services/websites | blog/gohighlevel-funnel-tutorial-high-converting | blog/ai-marketing-stack-what-we-use | work/fieldshare-seo-website-rebrand | +1 more
| /services/websites/redesign | blog/med-spa-seo-what-actually-works | blog/claude-code-marketing-agency-workflow | work/fieldshare-seo-website-rebrand |
| /services/seo | blog/aeo-for-local-businesses | blog/med-spa-seo-what-actually-works | work/fieldshare-seo-website-rebrand | +1 more
| /services/seo/local | blog/gohighlevel-for-restaurants-fill-tables | blog/google-business-profile-optimization-guide-2026 | blog/how-to-rank-higher-on-google-maps-a-comprehensive-guide | +3 more
| /services/seo/programmatic | blog/ai-marketing-stack-what-we-use | blog/claude-code-marketing-agency-workflow | work/rsla-organic-growth |
| /services/automations | blog/go-high-level-pricing | blog/gohighlevel-vs-hubspot-comparison | blog/gohighlevel-updates-2026 | +10 more
| /services/crm | blog/go-high-level-pricing | blog/what-is-go-high-level | blog/gohighlevel-vs-hubspot-comparison | +8 more
| /services/custom-builds | blog/ai-marketing-stack-what-we-use | blog/claude-code-marketing-agency-workflow | blog/claude-code-vs-cowork-vs-claude-app | +3 more
| /bakersfield | blog/google-business-profile-optimization-guide-2026 | blog/how-to-rank-higher-on-google-maps-a-comprehensive-guide | blog/aeo-for-local-businesses |
| /bakersfield/websites | blog/google-business-profile-optimization-guide-2026 | blog/how-to-rank-higher-on-google-maps-a-comprehensive-guide | blog/med-spa-seo-what-actually-works |
| /bakersfield/seo | blog/google-business-profile-optimization-guide-2026 | blog/how-to-rank-higher-on-google-maps-a-comprehensive-guide | blog/aeo-for-local-businesses |
| /bakersfield/automations | blog/gohighlevel-workflow-automations-guide | blog/gohighlevel-vs-jobber-home-service-crm | blog/automate-client-intake-ai |
| /bakersfield/crm | blog/what-is-go-high-level | blog/gohighlevel-lead-follow-up-automation | blog/gohighlevel-vs-jobber-home-service-crm |
