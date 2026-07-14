import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FBF7F2",
        surface: "#FFFFFF",
        ink: "#171310",
        soft: "#7C7268",
        line: "#EDE5D9",
        line2: "#E0D6C6",
        hot: "#FF4A2E",
        warm: "#FF8A3D",
        tomato: { DEFAULT: "#FF4A2E", tint: "#FFEBE5" },
        amber: { DEFAULT: "#E07E12", tint: "#FFF1DC" },
        herb: { DEFAULT: "#3E8F52", tint: "#E5F3E8" },
        plum: { DEFAULT: "#9A4467", tint: "#F7E9EF" },
        teal: { DEFAULT: "#1F8C86", tint: "#DFF2F0" },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        input: "13px",
      },
      backgroundImage: {
        node: "linear-gradient(135deg,#FF4A2E,#FF8A3D)",
      },
    },
  },
  plugins: [],
};

export default config;
