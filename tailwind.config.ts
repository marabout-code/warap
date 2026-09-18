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
        // Confiance côté Cameroun : vert profond
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // Chaleur / or : accent diaspora
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
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
        glow: "0 0 0 1px rgb(13 148 136 / 0.18), 0 8px 30px -6px rgb(13 148 136 / 0.35)",
        "glow-lg": "0 12px 40px -8px rgb(13 148 136 / 0.45)",
        "gold": "0 8px 30px -8px rgb(245 158 11 / 0.45)",
        "inner-soft": "inset 0 1px 0 0 rgb(255 255 255 / 0.06)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0f766e 0%, #0d9488 42%, #f59e0b 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(13,148,136,0.14) 0%, rgba(245,158,11,0.14) 100%)",
        "hero-mesh":
          "radial-gradient(at 15% 15%, rgba(13,148,136,0.20) 0px, transparent 52%), radial-gradient(at 85% 0%, rgba(245,158,11,0.16) 0px, transparent 50%), radial-gradient(at 60% 70%, rgba(20,184,166,0.10) 0px, transparent 55%)",
        "sidebar-mesh":
          "radial-gradient(at 10% 0%, rgba(13,148,136,0.30) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(245,158,11,0.14) 0px, transparent 50%)",
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
