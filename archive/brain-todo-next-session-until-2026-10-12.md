# brain-todo-next-session-until-2026-10-12.md

> The section "TODO (Next Session)" of `brain.md` as it stood until 2026-10-12, word for word. Its six lines that were still open are Linear issues now (`HQ-130` to `HQ-135`). Four were done or overtaken and were not loaded: GA4 key events (all three are key events), Sentry (the address is set on Vercel), the Sanity token (a working one is in 1Password), the service detail pages (built as the 13 service pages, `HQ-8`). Open tasks live in Linear, team `HQ`: `my-business/TODO.md`.

## TODO (Next Session)

### Rahul (manual, 5-10 min each)
- [x] **GTM conversion tags**: Created 3 GA4 Event tags + triggers + 2 DLVs (source, cta_location) in GTM. Published as Version 5. CTA click required code-side dataLayer push (React SPA doesn't produce Click URLs). Deployed 2026-04-30.
- [ ] **GA4 Key Events**: Mark `booking_confirmed`, `newsletter_subscribe`, `cta_click` as key events in GA4 once they appear in Admin > Events (can take 24-48 hours).
- [ ] **Sentry**: Create React project at sentry.io, copy DSN, add `VITE_SENTRY_DSN` to Vercel env vars
- [ ] **Sanity token**: Current token's robot user not in project yz25oyux. Create new token inside project settings (API > Tokens > Add API token > Editor permissions). Update `.env.local` and Vercel env var `SANITY_API_TOKEN`. Also update `../../mcp/sanity.env`.
- [ ] **Upstash**: Create free Redis DB at upstash.com. Add `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` to Vercel env vars.
- [ ] **Backlink disavow**: In SEMRush > Backlink Audit, review Singapore/Moldova spam domains. Export disavow list. Upload to GSC Disavow Tool.

### Claude (next session)
- [ ] **Write GHL pillar page** (highest priority): Strategy at `docs/superpowers/plans/2026-04-27-pillar-page-strategy.md`. Use `/blogEngine`. Targets 88K+ monthly impressions.
- [ ] **Write AI Automation pillar page**: Targets ICP (B2B companies). Links to 6 case studies.
- [ ] **Write Local SEO pillar page**: Consolidates position 4-7 GBP rankings.
- [ ] **Expand service detail pages**: Currently noIndexed (thin content). Expand each to 800-1200 words with process, deliverables, case studies, FAQ. Re-index after.
- [ ] **Add internal links in Sanity blog posts**: Blog-to-blog and blog-to-service cross-links within post bodies. Priority: top 8 posts by impressions.
- [x] **GitHub Dependabot alert**: Updated postcss 8.5.6 -> 8.5.14 (fixes CVE XSS in CSS stringify). Alert #17 resolved.
