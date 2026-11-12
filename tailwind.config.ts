import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFF7ED",
        surface: "#FFFFFF",
        ink: "#26231F",
        soft: "#6A635A",
        line: "#F3E7DA",
        line2: "#E7D8C7",
        hot: "#C4472D",
        warm: "#D9836D",
        tomato: { DEFAULT: "#C4472D", tint: "#F6DDD0" },
        amber: { DEFAULT: "#E07E12", tint: "#FFF1DC" },
        herb: { DEFAULT: "#42634B", tint: "#E8E5DA" },
        plum: { DEFAULT: "#9A4467", tint: "#F7E9EF" },
        teal: { DEFAULT: "#1F8C86", tint: "#DFF2F0" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-instrument-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        input: "13px",
      },
      backgroundImage: {
        node: "linear-gradient(135deg,#C4472D,#D9836D)",
      },
    },
  },
  plugins: [],
};

export default config;
