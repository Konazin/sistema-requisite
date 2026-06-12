import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          primary: "#00E970",
          hover: "#00C965",
          dark: "#063D2E",
          ink: "#031F18",
          light: "#F8FAF9",
          muted: "#F3F6F5",
          border: "#DDE5E2",
          text: "#10201A",
          secondary: "#64746D",
          error: "#DC2626",
          warning: "#F59E0B",
          success: "#00A85A"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(16, 32, 26, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
