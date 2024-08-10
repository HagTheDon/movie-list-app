import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#2BD17E",
      danger: "#EB5757",
      white: "#FFFFFF",
      "green-medium": "#093545",
      "green-light": "#224957",
      "green-dark": "#092C39",
    },
    extend: {
      fontSize: {
        "heading-one": ["64px", { lineHeight: "80px", letterSpacing: "0%" }],
        "heading-two": ["48px", { lineHeight: "56px", letterSpacing: "0%" }],
        "heading-three": ["32px", { lineHeight: "40px", letterSpacing: "0%" }],
        "heading-four": ["24px", { lineHeight: "32px", letterSpacing: "0%" }],
        "heading-five": ["20px", { lineHeight: "24px", letterSpacing: "0%" }],
        "heading-six": ["16px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-large": ["20px", { lineHeight: "32px", letterSpacing: "0%" }],
        "body-regular": ["16px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-small": ["14px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-extra-small": [
          "12px",
          { lineHeight: "24px", letterSpacing: "0%" },
        ],
        caption: ["14px", { lineHeight: "16px", letterSpacing: "0%" }],
      },
      fontWeight: {
        semibold: "600",
        bold: "700",
        regular: "400",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
