# QA pass: the 13 service and Bakersfield pages

Rahul's brief (2026-09-07): no cliche words, sentence level quality, every piece of text has to feel intentional. This is the audit, not the fix. Copy edits happen in the md files, then `python3 check-copy.py`, `npm run build`, `node scripts/verify-service-pages.mjs`.

Scope: the prose of the 13 copy files. Testimonials are verbatim reviews, so they are exempt from the cliche rules but checked for consistency. Site wide copy (home, about, contact) is not in this pass. Line numbers are the md files as of `f3a4542`.

## 2026-09-07: where we stand

The mechanical layer is clean: 0 banned words, 0 em or en dashes, 0 curly quotes, 0 shared sentences at Jaccard 0.55, reading grade 6 to 8, every page inside its word band. The specific sections are the best writing on the site and should not be touched: the redesign audit and launch month (`services-websites-redesign.md` 53, 63, 95), the 12 page lesson (`services-seo-programmatic.md` 47), "Who this is not for" (`services-seo.md` 72), dormant contacts and migration (`services-crm.md` 104), "What we need from you" (`services-automations.md` 74), the buy or build test (`services-custom-builds.md` 50), "Things we will not do to rank you" (`bakersfield-seo.md` 83).

It does not yet read as intentional page to page, for three structural reasons and a handful of local ones:

1. The seo-intel pass left seams: five keyword jams, the same "Search [keyword] and you get" device on all five local pages, and a paragraph on every local page whose only job is to carry links.
2. The national and Bakersfield siblings are paraphrases of each other for automations and CRM. The checker cannot see this; rewording passes Jaccard.
3. The CTAs and the process steps are one template across 13 pages, and four CTA pairs are near duplicates across siblings.
4. The copy claims candor instead of showing it, about 20 times.
5. A dozen phrases are worn from repetition, nine real cliches got past the banned list, and about a dozen sentences need a hand.

Size of the fix: roughly 80 line edits plus two decisions from Rahul (how different the sibling pages should be, whether the CTA formula stays). Half a day.

### 1. Seams from the seo-intel pass (RSL-374)

Keyword jams, where the exact phrase was pushed into a sentence that did not want it:

- `bakersfield.md` 76: "we want to be the marketing agency Bakersfield businesses call first"
- `bakersfield-websites.md` 33: "the typical shape of the web design Bakersfield service businesses ask us for"
- `bakersfield-crm.md` 47: "the part that makes it a CRM Bakersfield owners keep using"
- `bakersfield-automations.md` 51: "We are the AI automation agency Bakersfield owners can meet in person."
- `services-custom-builds.md` 50: "Custom software development for small business owners works when it is small"
- Borderline: `services-seo.md` 37, the H2 "What our SEO services for small business owners include".

The "Search [keyword]" device, used to place the exact phrase as a quoted search, sits on every local page and is followed by the same argument each time (out of town agencies with a Bakersfield page, local shops that do a bit of everything):

- `bakersfield.md` 46, `bakersfield-websites.md` 73, `bakersfield-seo.md` 33, `bakersfield-automations.md` 49, `bakersfield-crm.md` 33. The out of town point is made again at `bakersfield-seo.md` 87. "A bit of everything" is on 46 and 73 word for word.

Link carrier paragraphs, sentences that exist to hold the required links:

- `bakersfield.md` 63, `bakersfield-websites.md` 95, `bakersfield-seo.md` 101 (three links in one sentence), `bakersfield-crm.md` 60, `bakersfield-automations.md` 41 and 51.
- The national pages carry the same seam as "In Kern County? We ..." at `services-websites.md` 93, `services-automations.md` 96, `services-crm.md` 121, and `services-websites-redesign.md` 103.

### 2. Sibling pages are paraphrases

Automations, national (`services-automations.md`) against Bakersfield (`bakersfield-automations.md`):

- Hero lists: 32 against 22 ("the same intake questions typed into three systems" / "The intake form you retype into three places"; "the review request you meant to send" / "The quote you meant to follow up on").
- "Does not bring customers" paragraph: 60 against 45.
- The screen test: 106 "if you do it more than once a week and it involves a screen, it is probably automatable" against 79 "If it happens on a screen more than once a week, it is probably on the list."
- Proof block titles identical: "300 files to 3 dashboards" and "1,200 emails a day" at 78 and 80 against 55 and 57.
- CTAs: 87 "Want a list of what we would automate first?" against 62 "... in your business first?"; 118 "Bring the three tasks you hate most." against 91 "Bring the three tasks you would hand off tomorrow if you could."
- Same cost FAQ question on both (100, 73) with the same answer shape.

CRM, national (`services-crm.md`) against Bakersfield (`bakersfield-crm.md`):

- Hero: 23 "Every lead, every quote, every customer, in one place you can open from your phone. Follow up that runs itself until they book." against 22 "Every lead, quote, and customer in one app you can run from the truck. Follow up that fires on its own until they book."
- "Call me in March" and the notebook: 32 against 31.
- The voice note paragraph: 60 against 51.
- The phone tap answer: 58 against 79.
- "Genuinely needs Salesforce / something else, we will say so": 100 against 75.
- Casagrande: 86 against 55 (also on `services-automations.md` 82 and the hub quote at `bakersfield.md` 60; one case study carries four pages).
- CTAs: 25 "Tell us how leads reach you today." / 143 "Show us where leads go today." / `bakersfield-crm.md` 24 "Tell us where your leads live today."; 94 "Want to see a pipeline built for your kind of business?" against 62 "... for your trade?"
- The four steps: 112 to 115 against 66 to 69.

Lighter overlaps: "we show you why with your own Search Console data" (`bakersfield-websites.md` 113, `services-websites-redesign.md` 75); "the words decide the layout, not the other way round" (`services-websites.md` 52, `services-websites-redesign.md` 69); ownership makes the next build cheap (`services-websites.md` 91, `services-websites-redesign.md` 101); "AI answers come from pages that already rank" five times (`services-seo.md` 35 and 111, `bakersfield-seo.md` 79 and 119, `services-seo-local.md` 65); the "Is SEO dead" FAQ on both SEO pages (`services-seo.md` 110, `bakersfield-seo.md` 117); "Not a homepage that lists nine things" (`bakersfield-seo.md` 55, `services-seo-local.md` 49); "guessing or lying" (`bakersfield-seo.md` 83, `services-seo.md` 103); the under twenty reviews statistic (`bakersfield-seo.md` 53, `services-seo-local.md` 63).

Decision for Rahul: the local pages can be short and different (what is true here, who we met, the map) rather than the national page with the city added. If they stay as siblings, the test is a human diff of the pair, not the checker.

### 3. One template for CTAs and process

- Final CTA, 13 of 13: "Tell us / Send us / Show us / Bring X. We will tell you / show you Y." Each one is fine alone and follows the CTA rule. As a set it is a formula a visitor notices on the second page.
- Mid page CTA, 11 of 13 open with "Want ...?" (the other two open with "Have ...?").
- "How it runs", 12 of 13: free 30 minute call, written quote with one fixed number, build with you watching, training and handover or retainer. Step one is "A free 30 minute call." word for word on seven pages. Either make it one shared component the visitor sees as the house process, or make each one say what is specific to that service (the redesign steps do: "Every URL that matters gets mapped to its new home before launch day").
- Near duplicate CTA pairs across siblings: listed in section 2. The checker excludes CTA lines from the duplicate test, which is why they passed.

### 4. Claiming candor instead of showing it

The copy says it is honest about 20 times: "straight answer" three times (`bakersfield.md` 65, `bakersfield-websites.md` 113, `services-websites.md` 115), "we will tell you / say so / show you / not pretend otherwise" eleven times, "tells you the truth about what moved" (`bakersfield-seo.md` 107), "rather than when it is convenient" (`bakersfield-seo.md` 115), "We say this on the first call so nobody wastes a quarter" (`services-seo.md` 72), and an H2 titled "The honest result" (`services-automations.md` 58). The programmatic page shows the same thing without saying it, with the 12 pages that earned two impressions. Cut most of the claims and keep the demonstrations; retitle the H2 ("What automation does not do").

### 5. Tics and worn phrases

| Phrase | Count | Note |
|---|---|---|
| "X, not Y" contrast | 28 | plus two H2s built on it: `services-websites.md` 58, `services-crm.md` 56. The dominant rhetorical move on every page. |
| "real" (real numbers, real leads, real pages, real photos ...) | 33 | the anti fake posture, worn to a tic. `bakersfield-seo.md` has five, `services-seo-local.md` six. |
| fixed price / fixed number / one number | 38 | the offer, repeated on every page; `bakersfield-websites.md` seven times, `services-crm.md` six. |
| in person / in the room / while you watch | 21 | `bakersfield-crm.md` seven in 965 words, `bakersfield-automations.md` six. |
| "actually" | 11 | every one is a jab at other agencies. Keep three. |
| "genuinely" | 6 | hedge word. Cut all six. |
| "until they book or say no / opt out" | 6 | |
| "southwest Bakersfield / the southwest of the city" | 6 | |
| "the job goes to whoever answers" | 5 | `bakersfield-automations.md` 37 adds "in Bakersfield" to a line that is true everywhere. |
| "one screen / first screen" | 5 | |
| "after dinner / 11pm / 9pm" admin | 4 | `services-automations.md` three of them. |
| "on your own phone" | 4 | |
| "nothing slips" | 3 | body twice plus the automations meta description. |
| doctor metaphor | 2 | `bakersfield.md` 51, `services-automations.md` 64. |
| "unglamorous" | 2 | `services-automations.md` 32, `services-seo.md` 68. |

### 6. Cliches that got past the banned list

- `services-websites.md` 23 "Your website is your business card" and 40 "A website is your business's digital business card." Twice on one page, and it is the oldest line in web design.
- `services-websites.md` 91 "a website is a living thing"; `services-websites-redesign.md` 101 "A site needs feeding".
- `services-custom-builds.md` 44 "If you can describe it, it can be built. The sky is the limit on what".
- `services-crm.md` 34 "Nobody dropped the ball on purpose."
- `bakersfield.md` 87 "built for the businesses that keep Kern County running"; `bakersfield-automations.md` 29 H2 "the businesses that run Bakersfield and Kern County".
- `bakersfield.md` 23 hero: "so you can get back to running the business" (the "focus on what you do best" family) and "with real numbers on a dashboard instead of promises".
- `services-custom-builds.md` 56 "in weeks, not months".
- `services-seo.md` 43 "Consistency is what wins."; 33 "used to mean pleasing an algorithm. It now means" (the "SEO has changed" opener).
- `services-websites.md` 52 "What makes a website yours is you: the story, the branding, the personality."
- `services-crm.md` 58 "deep work"; `bakersfield-crm.md` 51 "Picture leaving a job in Oildale" ("picture this").
- `services-seo.md` 24: "SEO, AEO, and GEO are just the names" puts two acronyms a small business owner has never seen into the hero.

### 7. Sentence level

- `services-websites.md` 66 "Design gets you the visitor. Structure gets you the visitor in the first place." contradicts itself; the first sentence wants "keeps" or "converts".
- `services-websites.md` 42 to 46: "That is the first job ... That is the second ... That is the third." is a numbered list forced into prose, and "**Design it.** Communicating is one thing and designing that communication is another." is the clumsiest line on the site.
- `bakersfield-seo.md` 33 "the page one you are reading was, on the day we wrote this" confuses the results page with our page.
- `bakersfield-automations.md` 66 "**Thirty free minutes.** At your shop if you like, on where the week goes." is missing words.
- `bakersfield.md` 51 "As Rahul puts it" quotes the owner in the third person on a page that speaks as "we".
- `bakersfield-automations.md` 22: three fragments, then "handles it". Line 31 runs four "cannot" sentences in a row, then 33 runs five parallel short sentences. The whole opening is written to a pattern.
- `services-automations.md` 23: the hero is the home page hero line word for word ("Only you know what your time is worth. We put AI to work to get it back."), and the next sentence dangles ("Anything digital and repetitive that eats your admin time, there is a good chance we can automate it.").
- `services-websites-redesign.md` 33 and 45: "most of your visitors are on a phone" twice on one page.
- `bakersfield-websites.md` 27, 75, 84: "we tell you what drives the price before you sign" three times on one page.
- `services-seo.md` 59 "That is the snowball" is never explained.
- The old site is "from 2018" on `bakersfield.md` 35 and `services-websites-redesign.md` 35 and "from 2019" twice on `services-websites.md` 34. Pick one or drop the year.

### 8. Facts and consistency

- "enquiry" (UK spelling) five times on `services-crm.md` 44 and 86 and `bakersfield-crm.md` 39, on a Bakersfield site whose own form was an inquiry. Change to inquiry.
- Number style is mixed: "twenty" (`bakersfield-seo.md` 53) against "20" (`services-seo-local.md` 63), "Thirty free minutes" against "30 minute call", "eight to ten pages" against "8 to 12 real photos", "fifty pages" against "60 to 90 days". Pick one rule and apply it.
- The Sid S. review is cut three different ways: full on `services-websites-redesign.md` 81 and `bakersfield-seo.md` 89, first two sentences on `services-websites.md` 77, first and last sentence with the middle dropped and no ellipsis on `services-seo-local.md` 77. Chris K. has "Highly recommend." only on `bakersfield-websites.md` 77 and loses "Great communication and delivered on schedule." on `services-seo.md` 80. Parminder S. keeps his last sentence only on `bakersfield-crm.md` 57. Set one canonical text per review and cut it the same way everywhere. Sid S. is also the most cliche dense text on the site ("couldn't be more thrilled", "expertise and dedication transformed", "remarkable increase", "substantial improvement in qualified inbound lead generation"); it is a real review so it is exempt, but it is on four pages. Use the short cut, or a different review on two of them.
- `bakersfield-seo.md` 61 "we publish the rescans as the profile climbs": no rescan has run since 2026-06-10. Run one before deploy or change the tense.
- `bakersfield-seo.md` 79 "More Kern County customers ask ChatGPT and Google's AI for a recommendation than a year ago": no Kern County data behind it. Drop "Kern County" or source it.
- `services-crm.md` 119 "Most clients stay on it because the system keeps growing with them": two retainer clients today. Cut.
- `bakersfield-websites.md` 31: the Rosedale landscaper, the downtown tattoo studio, the Oildale HVAC company, and the Shafter ag supplier are invented but written as things we have seen. Make them real or make them types.
- `services-seo-local.md` 45 and 90 "the published tests": name the test or drop "published".
- `bakersfield-seo.md` 22 "so you know exactly who they call": the grid shows who ranks, not who gets called.
- `services-custom-builds.md` 72 "a fraction of what a software agency charges": unsupported.
- `bakersfield-crm.md` is 965 words against a band of 800 to 950; the checker allows ten percent over.

### 9. The form hold (2026-09-07)

The written inquiry form is off the contact page (RSL-375). These lines assume a written channel while the button under them says "Book a call":

- `bakersfield.md` 83 "Book the call or send us a message."
- `bakersfield-websites.md` 117 "Send us your address and the site you have, if you have one."
- `bakersfield-seo.md` 123 "Send us your business name."
- `services-seo-local.md` 102 "Send us your business name and city."
- `services-websites-redesign.md` 24 "Send us the site that needs replacing." and 125 "Send us the link you are embarrassed by."

Reword to "Bring" or "Show us on the call" before deploy, or give them the phone number.
