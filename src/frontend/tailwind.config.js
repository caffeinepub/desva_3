import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // DESVA custom palette
        "rose-gold": "oklch(0.56 0.12 15)",
        "blush-pink": "oklch(0.93 0.04 15)",
        "petal-soft": "oklch(0.97 0.02 20)",
        "deep-rose": "oklch(0.38 0.08 15)",
        "dusty-rose": "oklch(0.72 0.08 15)",
        cream: "oklch(0.975 0.008 60)",
      },
      fontFamily: {
        display: ['"Didot"', '"Bodoni MT"', '"Playfair Display"', '"Georgia"', '"Times New Roman"', 'serif'],
        elegant: ['"Garamond"', '"Palatino Linotype"', '"Book Antiqua"', '"Palatino"', '"Georgia"', 'serif'],
        body: ['"Helvetica Neue"', '"Arial"', 'sans-serif'],
        sans: ['"Helvetica Neue"', '"Arial"', 'sans-serif'],
        serif: ['"Garamond"', '"Georgia"', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        petal: "0 4px 24px oklch(0.56 0.12 15 / 0.12), 0 1px 4px oklch(0.56 0.12 15 / 0.08)",
        "petal-lg": "0 8px 40px oklch(0.56 0.12 15 / 0.18), 0 2px 8px oklch(0.56 0.12 15 / 0.10)",
        "petal-xl": "0 16px 60px oklch(0.56 0.12 15 / 0.22), 0 4px 12px oklch(0.56 0.12 15 / 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-petal": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(2deg)" },
          "66%": { transform: "translateY(-4px) rotate(-1deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-petal": "float-petal 4s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
