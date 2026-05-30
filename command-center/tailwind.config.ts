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
        background: "var(--background)",
        "background-subtle": "var(--background-subtle)",
        "background-muted": "var(--background-muted)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-muted": "var(--foreground-muted)",
        "trust-blue": {
          DEFAULT: "#1d4ed8",
          light: "#3b82f6",
          pale: "#dbeafe",
          dark: "#1e3a8a",
        },
        crimson: {
          DEFAULT: "#dc2626",
          light: "#fecaca",
        },
        amber: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        emerald: {
          DEFAULT: "#059669",
          light: "#d1fae5",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "glow-blue": "var(--shadow-glow-blue)",
        "glow-crimson": "var(--shadow-glow-crimson)",
      },
      animation: {
        "ticker": "ticker-scroll 40s linear infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "shimmer": "shimmer 1.5s infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
