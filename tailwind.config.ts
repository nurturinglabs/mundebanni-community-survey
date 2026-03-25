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
        background: "#FAF9F5",
        foreground: "#141413",
        accent: "#D97757",
        "accent-hover": "#C26644",
        muted: "#B0AEA5",
        border: "#E8E6DC",
        success: "#788C5D",
        card: "#FFFFFF",
        "accent-light": "#FEF3EE",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
        kannada: ["var(--font-kannada)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
