import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        montserrat: ["var(--font-montserrat)", "Helvetica Neue", "sans-serif"],
      },
      colors: {
        "ink": "#0A0A0A",
        "ink-light": "#1A1A1A",
        "ash": "#6B6B6B",
        "bone": "#F5F3EF",
        "chalk": "#FFFFFF",
      },
      letterSpacing: {
        "ultra": "0.25em",
        "wide-xl": "0.2em",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [],
};

export default config;
