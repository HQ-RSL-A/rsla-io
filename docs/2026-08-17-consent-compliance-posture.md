# RSL/A Consent & Cookie Compliance Posture

**As of:** 2026-08-17 (evening) · **Owner:** Rahul Lalia · **Maintained by:** Claude sessions (update this doc whenever the consent architecture changes)

This is the single reference for how consent works on rsla.io: the architecture, who sees what, why it is lawful per region, what was verified, and what must never silently change.

---

## 1. Architecture (three layers)

| Layer | What it controls | Where it lives |
|---|---|---|
| **GTM consent defaults** | Whether tags run BEFORE any banner interaction, per region. This is the real gate. | GTM `GTM-MVJQSMF8` → CookieScript CMP tag → Default Consent. **Live: container v11** ("Quebec opt-in"). |
| **CookieScript banner** | The visitor-facing choice UI, consent storage/records, GPC handling, Meta/fbq consent wiring | cookie-script.com dashboard, banner ID `440ed9df232ca19a993a46bb94f4cdbe` (dashboard item 472814). API creds: `my-business/mcp/cookiescript.env`. |
| **Privacy policy** | The public description — must always match actual behavior | `src/pages/Privacy.jsx` §10 (+ §1.4, §12) |

### GTM consent defaults (container v11, published 2026-08-17)

- **Global default: Granted** — all seven consent types (ad_storage, ad_user_data, ad_personalization, analytics_storage, functionality_storage, personalization_storage, security_storage). Wait-for-update 500 ms.
- **Region row: Denied** (security_storage granted) for **33 codes**: EU-27 (AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE) + EEA (IS LI NO) + GB + CH + **CA-QC** (Quebec, added in v11 to close the Law 25 gray zone).
- Tag fires on Consent Initialization – All Pages.

### Effective behavior by visitor

| Visitor | Pre-choice behavior | Verified |
|---|---|---|
| US / rest of world | GA4 + Meta Pixel fire immediately (`_ga`, `_ga_KTE0H7FE4S`, `_fbp` set; GA collect `gcs=G111`); Clarity follows Consent Mode (granted) | ✅ clean-visit test 2026-08-17 ~18:45 PT |
| EEA / UK / CH / Quebec | Everything non-essential denied until Accept (Consent Mode v2; no cookies, no identifiers) | Config-verified (same mechanism, denied row) |
| Explicit "Decline all" | Honored everywhere — consent updates revoke tags | ✅ mechanism verified in opt-in era |
| GPC-signal browser (e.g. Brave) | All non-essential categories auto-declined, every region | Config-verified (CookieScript GPC framework, all categories = Decline) |

## 2. CookieScript banner configuration (key settings)

- **Consent mode: Explicit** (banner offers Accept all / Decline all / per-category, equal prominence). Close button = **Reject all**. Consent expiration **180 days**. No pre-checked categories, no auto-accept, no auto-hide. Banner shows before page load; focus trapped (a11y).
- **Consent recording: ON** (since setup) — every consent stored; export via dashboard (Consents → date range) or API `POST /consents`. This is the compliance evidence trail.
- **Scans:** automatic monthly ON; reset-user-consents-on-new-cookies ON; results emailed to Rahul. Declaration: 11 cookies, 0 unclassified; Clarity `_clck`/`_clsk` added manually (scanner can't see post-consent cookies).
- **Frameworks:** GPC ON (decline all categories); Facebook Pixel Consent ON (Targeting); **Microsoft Clarity Consent API OFF** (deliberate — pure Consent Mode gating so US default-granted visitors get full session replay; EU stays cookieless); IAB TCF OFF (no programmatic ad selling — do not enable); Google Consent Mode v2 ON with mappings ads→Targeting, analytics→Performance, functionality/personalization/security→Functionality.
- **Category texts (vendor-forward masking):** Show-details headlines name tools, not cookie IDs — Performance: "Google Analytics… Microsoft Clarity"; Targeting: "Meta (Facebook and Instagram)… YouTube"; Strictly necessary: "CookieScript consent cookie…". Raw cookie names appear only behind per-category "Show cookies" expanders (structural to CookieScript's popup; same one-click-deep pattern as Cookiebot on acquisition.com). The "Show cookie declaration" toggle proved to have no effect on the popup variant — safe to leave ON so CookieScript's checker badges stay green.
- Privacy Policy link in banner → `https://rsla.io/privacy-policy` (verified live; route unchanged in brand redesign).
- Public auto-updating cookie report (linked from policy §10.4): `https://cookie-script.com/cookie-report?identifier=1c8f75659d02503bc3bfb26f8742aefe`

## 3. Why this is lawful, per region

- **EEA/UK (GDPR, UK GDPR, ePrivacy):** opt-in consent required for non-essential cookies → we deny by default and gate on Accept. Consent Mode v2 defaults denied; consent recorded; withdrawal via footer "Cookie settings"; response timelines in policy §11.4.
- **Switzerland (FADP):** transparency-based; opt-in not strictly required — we over-comply by including CH in the denied row.
- **Quebec (Law 25):** "deactivated by default" clause has a strict reading covering tracking cookies; debated, but CA-QC added to the denied row 2026-08-17 to close the gray zone entirely.
- **US (CCPA/CPRA, CO, VA, CT, UT…):** no opt-in requirement for analytics/ads cookies. Requirements met: disclosure (policy §10), opt-out (Decline all + footer link), **GPC honored** (mandatory CA/CO), no sale of personal data (stated §11.2), no dark patterns (equal buttons), non-discrimination.
- **Canada outside Quebec (PIPEDA):** implied consent permitted for non-sensitive analytics/marketing cookies with clear notice + easy opt-out — both present.
- Policy §10.3 describes exactly this regional split; §12 discloses GPC honoring; §1.4 scopes the "Consent" legal basis to opt-in jurisdictions.

## 4. Load-bearing invariants — never break these

1. **Explicit declines are honored** — no tag may bypass a Decline.
2. **GPC is honored** in all regions (CookieScript GPC framework stays ON, all categories Decline).
3. **The policy matches reality** — any change to GTM consent defaults, regions, or banner behavior ships WITH a matching §10 edit (both `brand-visual-system` and `main` while they coexist).
4. **Consent records keep accumulating** (recording toggle stays ON).
5. CSP whitelists every GTM-injected host (see CLAUDE.md rule) — a blocked CMP is a silent compliance failure.

## 5. How to change things

- **Add/remove an opt-in region:** GTM → CookieScript CMP tag → Default Consent (Region-specific) → edit row's Regions list (ISO 3166-1/-2, e.g. `BR`, `US-CA`) → Save → Submit/Publish. Then update policy §10.2/§10.3/§1.4 lists + this doc.
- **Export consent records:** dashboard Consents page, or `POST https://cookie-script.com/api/open/v1/consents` (Bearer key in `mcp/cookiescript.env` — key is bcrypt-format, never bash-`source` the file).
- **Cookie declaration upkeep:** monthly scans auto-run; new cookies trigger a consent reset for all visitors (intentional). Manual additions via API `POST /cookies/create?id=<banner>`.
- **History:** GTM v9 = pre-CMP · v10 = geo-split granted-default · v11 = +CA-QC. Policy commits: merge `03dc945`/`bd2f96c`, region model `84c268f`/`d246ca6`, Quebec follow-up (see git log).

## 6. Known open items

- YouTube embeds drop `.youtube.com` cookies pre-consent on embed pages (iframes bypass the banner) → switch embeds to `youtube-nocookie.com` after the brand branch lands.
- Future chat widget: disclose (already in policy Communications/Chat Logs), add script host to CSP, rescan cookies.
- GA4 event retention set to 14 months (Rahul, 2026-08-17) — matches the 13-month policy claims.
