import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f1d1b",      // text and main buttons
        muted: "#78716c",    // secondary text
        line: "#e7e2dd",     // borders
        sand: "#f8f6f3",     // page background
        blush: "#f1e9e4",    // selected / saved state
        rose: "#a7877a",     // single accent (heart, progress)
      },
      keyframes: {
        in: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { in: "in .25s ease-out" },
    },
  },
  plugins: [],
};
export default config;
