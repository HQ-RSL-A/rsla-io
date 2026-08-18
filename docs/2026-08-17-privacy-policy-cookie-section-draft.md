# Privacy Policy — Cookie Section Rewrite (SUPERSEDED 2026-08-17: merged into src/pages/Privacy.jsx along with the CookieScript-generated policy — see 2026-08-17-cookiescript-generated-privacy-policy.html)

**Date:** 2026-08-17
**Why:** CookieScript CMP went live today (Consent Mode v2, all defaults denied). The current §10.3 says the banner is "for transparency" and that no opt-in is required — that described the old homegrown banner. Verified today on a clean first visit: the only cookie present before consent is `CookieScriptConsent`; GA4, Meta Pixel, and Microsoft Clarity all hold until Accept. So the policy can honestly describe a true opt-in model. Clarity (session recordings + heatmaps) is also new in the stack and Microsoft's terms require a privacy-policy disclosure for it.

**Where:** `src/pages/Privacy.jsx`. Not applied yet — the file is mid-brand-redesign WIP. Apply after that lands (or on request; the copy below is final-form).

---

## 1. §5 "Third-Party Services and Platforms" — add two table rows

| Service | Purpose |
|---|---|
| Microsoft Clarity | Behavioral analytics: heatmaps and session recordings (loaded only after cookie consent) |
| CookieScript | Cookie consent management (banner, consent storage, consent records) |

## 2. §10.2 "How We Use Cookies" — replace the four category bullets

> - **Strictly Necessary Cookies:** Required for the Site to function and to remember your cookie preferences. These cannot be disabled. They include cookies for security, session management, and the consent choice you make in our cookie banner.
> - **Performance and Analytics Cookies:** Help us understand how visitors use our Site — page views and usage patterns (Google Analytics) and anonymized heatmaps and session recordings (Microsoft Clarity). These are set only after you consent.
> - **Functional Cookies:** Remember your preferences and settings, such as language or region.
> - **Targeting and Advertising Cookies:** Measure marketing campaign performance across platforms (e.g., Meta Pixel). These are set only after you consent.

## 3. §10.3 — retitle "Cookie Notice" → "Cookie Consent" and replace both paragraphs

> When you first visit our Site, a consent banner (powered by CookieScript) lets you accept all cookies, decline all non-essential cookies, or expand the details to choose by category. Until you make a choice, analytics and advertising tags are disabled by default through Google Consent Mode v2 — they set no cookies and store no identifiers. Your choice is saved so it is remembered on return visits.
>
> Although U.S. law does not generally require opt-in consent for these technologies, we apply an opt-in model as a best practice. You can change or withdraw your consent at any time by clicking "Cookie settings" in the website footer, which reopens the consent panel.

## 4. §10.4 "Managing Cookies" — replace the paragraph

> The fastest way to manage cookies on our Site is the "Cookie settings" link in the footer. You can also block or delete cookies through your browser settings, though disabling strictly necessary cookies may affect how the Site functions. A live, automatically updated list of every cookie in use on this Site — with provider, purpose, and duration — is available in our [cookie report](https://cookie-script.com/cookie-report?identifier=1c8f75659d02503bc3bfb26f8742aefe).

## 5. NEW §10.5 "Session Recordings (Microsoft Clarity)"

Microsoft's terms require this disclosure; wording below is their suggested language tailored to our use (we don't run Microsoft Advertising, so that half is dropped):

> We partner with Microsoft Clarity to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay, in order to improve our website and services. Website usage data is captured using first- and third-party cookies and other tracking technologies — only after you consent through our cookie banner — and is used for site optimization and fraud/security purposes. For more information about how Microsoft collects and uses your data, visit the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).

## 6. Light touches elsewhere

- §1.3 / §4 "Analytics providers (such as Google Analytics)" → "(such as Google Analytics and Microsoft Clarity)".
- §7 retention: add "Session recordings (Microsoft Clarity) are retained for up to 30 days by Microsoft; derived heatmap data up to 13 months."
- §12 DNT paragraph: keep, already accurate ("we respect your cookie preferences as set through our cookie consent banner").

## Post-approval checklist

- [ ] Apply the edits above to `src/pages/Privacy.jsx`
- [ ] Re-run the CookieScript scan from the dashboard (current cookie report predates the CSP fix, so it has never seen Clarity's `_clck`/`_clsk` cookies — the table will be incomplete until a rescan)
- [ ] Optional: turn on CookieScript's Global Privacy Control (GPC) handling in the dashboard if available — free strengthening for CA/CO visitors
