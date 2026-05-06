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
        // === Blue-gray theme (new) ===
        background: "#F8FAFC",       // slate-50 — page background
        surface: "#FFFFFF",           // white — cards, containers
        surfaceAlt: "#F1F5F9",       // slate-100 — alternating sections
        text: "#0F172A",              // slate-900 — primary text
        textMuted: "#475569",         // slate-600 — secondary text (bumped from slate-500 for WCAG AAA on all surfaces)
        textLight: "#94A3B8",         // slate-400 — tertiary text
        accent: "#0066E0",            // brand blue (darkened from #0070F3 for WCAG AA contrast)
        cyan: "#00C2FF",              // electric cyan
        coral: "#FF6B6B",             // soft coral (errors only)

        // Accent opacity variants
        "accent-light": "rgba(0,112,243,0.05)",
        "accent-medium": "rgba(0,112,243,0.10)",
        "accent-border": "rgba(0,112,243,0.08)",
        "accent-border-strong": "rgba(0,112,243,0.15)",


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
        sans: ["Satoshi", "sans-serif"],
        cormorant: ["Cormorant", '"Cormorant Garamond"', "serif"],
        caveat: ["Caveat", "cursive"],
        // System monospace stack — code blocks only
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
