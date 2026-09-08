import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 4px 6px -1px rgb(15 23 42 / 0.06), 0 10px 24px -4px rgb(15 23 42 / 0.10)",
        glow: "0 0 0 1px rgb(99 102 241 / 0.15), 0 8px 30px -6px rgb(99 102 241 / 0.35)",
        "glow-lg": "0 12px 40px -8px rgb(124 58 237 / 0.5)",
        "inner-soft": "inset 0 1px 0 0 rgb(255 255 255 / 0.05)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 100%)",
        "hero-mesh":
          "radial-gradient(at 20% 20%, rgba(99,102,241,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168,85,247,0.14) 0px, transparent 50%), radial-gradient(at 60% 60%, rgba(59,130,246,0.10) 0px, transparent 50%)",
        "sidebar-mesh":
          "radial-gradient(at 20% 0%, rgba(99,102,241,0.18) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(124,58,237,0.16) 0px, transparent 50%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;