import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        bannerShadow:
          "0px 0px 0px 0px rgba(132, 230, 192, 0.10), 0px 44px 97px 0px rgba(132, 230, 192, 0.10), 0px 176px 176px 0px rgba(132, 230, 192, 0.09), 0px 396px 238px 0px rgba(132, 230, 192, 0.05), 0px 704px 282px 0px rgba(132, 230, 192, 0.01), 0px 1100px 308px 0px rgba(132, 230, 192, 0.00);",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(116deg, #FF9C27 17.35%, #FD48CE 71.38%)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#CE26A2",

          secondary: "#F16F46",

          neutral: "#64748B",

          "base-100": "white",

          success: "#16A34A",

          warning: "#EA580C",

          error: "#DC2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
