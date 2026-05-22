import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#00FF85",
        gold: "#FFD700",
        night: "#0A0A0A",
        ink: "#101214",
        line: "rgba(255,255,255,0.12)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Impact", "Arial Black", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        score: ["var(--font-score)", "Space Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 28px rgba(0, 255, 133, 0.34)",
        gold: "0 0 26px rgba(255, 215, 0, 0.26)",
      },
      backgroundImage: {
        "pitch-grid":
          "linear-gradient(rgba(0,255,133,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,133,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
