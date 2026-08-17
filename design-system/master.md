# Design System Master File

> **This file is a pointer, not a spec.** The generated April 2026 design system
> that used to live here (navy `#0369A1` accent, General Sans body) never matched
> the shipped site and is superseded.

**The design system for rsla.io is the RSL/A brand system:**

- **Source of truth:** `../../../brand-guidelines/design-tokens.css` (colors, type scale, rhythm, radii) and `../../../brand-guidelines/brand-identity-guide.md` (application + emphasis rules).
- **In this repo:** the tokens are mirrored in `tailwind.config.js` (colors, radii) and `src/index.css` (fonts, shadcn variables). Reference tokens, never raw hexes.
- **Quick rules:** Satoshi Medium 500 (reading) + Bold 700 (headings) only. Ink `#1d1d1f` is the only text color on light; Mist `#F5F5F7` the only one on black (footer only). Anchor Blue `#0070F3` for links/CTAs/highlights, hover Anchor Deep `#0059C2`. Hairline `#D2D2D7` borders. Sentence case everywhere; no eyebrows, no ALL CAPS, no italics, no gradients (aurora hero is a standing temporary exception), no gray text tiers, no transparency on text.
- Applied to the codebase 2026-08-17; audit and rationale in `../docs/2026-08-14-brand-application-audit.md`.

If `design-system/pages/` files conflict with the brand system, the brand system wins.
