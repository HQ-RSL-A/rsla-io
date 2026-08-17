/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  future: {
    // Gate `hover:` variants behind @media (hover: hover) so taps on touch
    // devices no longer trigger sticky hover states.
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        grid: "grid 15s linear infinite",
        aurora: "aurora 60s linear infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) infinite linear",
        shine: "shine var(--duration) infinite linear",
      },
      // Motion tokens — Emil Kowalski's curves and bracket durations.
      // Exposed as Tailwind classes so we don't have to chase arbitrary-value
      // resolution quirks with var() references.
      transitionDuration: {
        xs: "120ms",
        sm: "180ms",
        md: "220ms",
        lg: "320ms",
        "image-zoom": "350ms",
        "photo-hover": "400ms",
      },
      transitionTimingFunction: {
        "out-smooth": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-smooth": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      colors: {
        // === RSL/A brand tokens (brand-guidelines/design-tokens.css, 2026-08-10) ===
        // Light-first, one ink, one accent. Never retype hexes elsewhere.
        background: "#FFFFFF",        // Paper — default background, every medium
        surface: "#FFFFFF",           // Paper — cards sit on Hairline borders + shadows, not tint
        surfaceAlt: "#F5F5F7",        // Mist — alternate sections, cards
        mist: "#F5F5F7",              // Mist by name — the text color on black (footer)
        text: "#1d1d1f",              // Ink — ALL text on light; solid, never transparent
        accent: "#0070F3",            // Anchor Blue — links, CTAs, highlights
        accentDeep: "#0059C2",        // Anchor Deep — hover states on Anchor Blue
        frost: "#EFF6FF",             // Frost — blue-tinted surface: callouts, active states
        hairline: "#D2D2D7",          // Hairline — borders, dividers, table rules
        error: "#DC2626",             // semantic: states only, never decoration
        success: "#047857",
        warning: "#B45309",

        // Accent opacity variants (surfaces only: hover tints, washes)
        "accent-light": "rgba(0,112,243,0.05)",
        "accent-medium": "rgba(0,112,243,0.10)",


        // shadcn CSS variable tokens (for Magic UI components)
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        // Satoshi ONLY (brand rule): Medium 500 = reading, Bold 700 = headings/emphasis.
        sans: ["Satoshi", "-apple-system", "sans-serif"],
        // System monospace stack — code blocks only
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        button: "10px",   // brand --radius-button
        callout: "12px",  // brand --radius-callout
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
