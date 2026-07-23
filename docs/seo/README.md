# SEO Blog Content Pipeline - Claude / Anthropic

This folder contains everything needed to research, write, publish, and track blog posts targeting Claude, Claude Code, and Anthropic keywords on rsla.io.

## Files

| File | Purpose |
|---|---|
| `contentPlan.md` | The master plan. 29 blog posts with titles, keywords, volumes, KD, product tags, publishing schedule, internal linking rules, image generation instructions, and interview questions to ask Rahul before drafting. Read this first. |
| `keywordResearch.csv` | Raw keyword data from SEMRush + AnswerThePublic. 198 keywords across 5 seeds. Columns: Seed, Keyword, Intent, Volume, KD%, CPC, Updated. |
| `keywordWinners.csv` | Filtered and scored keywords worth writing for. 125 entries with post type, priority, and notes. Skips are marked. |

## Google Sheet Tracker

**Claude Blog SEO Tracker**: [Open Sheet](https://docs.google.com/spreadsheets/d/1BffZHKJRirOrj-fUPBh56l9KjIlh2Wo-5fyHY-Kd-Xw/edit)

This is the live tracker. Update it every time you work on a blog post. Columns include status, Sanity draft, meta title/description, internal links, images, pre-rendering, published date, URL slug, and GSC indexing.

**Status flow:** Not Started > Research > Drafting > Review > Published

## How to Write a Blog Post

1. **Pick a post** from `contentPlan.md` (follow the publishing schedule)
2. **Interview Rahul first** - ask the 6 questions in the "Interview Rahul First" section of contentPlan.md. Do not skip this. His personal experience is what makes each post rank.
3. **Draft the post** using `/blogEngine` skill. Follow the product tag (which Claude product the post covers), internal linking rules, and keyword targets listed for that post.
4. **Generate a featured image** using the Gemini API instructions in contentPlan.md. Blue-gray palette, 1200x630, no text on image.
5. **Publish to Sanity** as a blogPostV2 document. Set SEO fields (meta title, description, slug).
6. **Pre-render** by running `npm run build` (triggers prerender.mjs).
7. **Update the Google Sheet** - change status to Published, check all completed boxes, add published date and URL slug.
8. **Submit to GSC** - request indexing in Google Search Console for the new URL.

## Key Rules

- Every post links to Post 0 ("Anthropic Has 5 Different Claude Products...") and Post 6 (pillar page)
- Posts tagged `[ALL PRODUCTS]` must have separate sections per product (Claude.ai, Claude Code, API)
- Do not write generic AI content. Every post needs Rahul's real experience, specific numbers, named tools, and honest opinions.
- Update the Google Sheet after every action. No exceptions.

## Brand References

- Voice DNA: `../../../../brandGuidelines/voiceDna.md` (still at `~/lalia/myBusiness/brandGuidelines/` until that folder migrates)
- Website CLAUDE.md: `../../CLAUDE.md`
- Sanity Project ID: `yz25oyux` (dataset: `production`)
- Blog schema: `blogPostV2` (V1 is legacy, do not use)
