import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
