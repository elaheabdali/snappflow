import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-vazirmatn)", "system-ui", "sans-serif"],
        fa: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
        en: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#00d170",
          600: "#00b35f",
          700: "#047857",
          900: "#064e3b",
        },
        slate: {
          950: "#070b14",
        },
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(0, 209, 112, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;