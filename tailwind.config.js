/** @type {import('tailwindcss').Config} */
import { EnvConfig } from "./src/config/env.config";

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary tokens: keep `primary` linked to EnvConfig but add useful shades from Figma
        "primary": EnvConfig.PRIMARY_COLOR,
        "primary-50": "#EEF6FF",
        "primary-300": "#7FB7F0",
        "primary-600": "#2563EB",
        "secondary": EnvConfig.SECONDARY_COLOR,
        "white": "#FFFFFF",
        "black": "#000000",
        "black-opacity": "#202020",
        "neutral-03": "#F9F9F9",
        "neutral-04": "#F0F0F0",
        "neutral-05": "#D9D9D9",
        "neutral-06": "#B1B1B1",
        "neutral-07": "#656565",
        "neutral-08": "#4E4E4E",

        "neutral-09": "#f0ece6",
        "neutral-10": "#d1d5db ",
        "neutral-11": "#f9fafb ",
        "neutral-12": "#4b5563  ",
        "neutral-13": "#9ca3af",
        "neutral-14": "#bfdbfe",
        "neutral-15": "#60a5fa",
        "neutral-16": "#f3f4f6",
        "neutral-17": "#e5e7eb",
        "neutral-18": "#1f2937",
        "neutral-19": "#6b7280",
        "neutral-20": "#2563eb",
        "neutral-21": "#3b82f6",
        "neutral-22": "#374151",
        "neutral-23": "#eff6ff",
        "neutral-24": "#fef2f2",
        "neutral-25": "#fca5a5",
        "neutral-26": "#2B7FFF",
        "neutral-27": "#EEF6FF",
        "neutral-28": "#111827",

        "error-full-opacity": "#DA1E28",
        "error": "#FD2148",
        "error-80": "#E04951",
        "error-30": "#F4BBBE",
        "error-10": "#FBE8E9",
        "error-11": "#dc2626",

        "success": "#24A148",
        "success-45": "#9CD5AD",
        "success-30": "#BDE3C8",
        "success-10": "#E9F6ED",
        "success-11": "#EFFDF4",

        "warning-70": "#F1C21B",
        "warning-40": "#F9E7A4",
        "warning-30": "#FBEDBB",
        "warning-10": "#FEF9E8",
        "warning-11": "#FEFCE8",

        "overlay": "rgba(0, 0, 0, 0.5)",
        "white-transparent": "rgba(255, 255, 255, 0.96)",
        "transparent": "rgba(0,0,0,0)",
      },
      fontFamily: {
        // Use Open Sans as the default sans font (Figma uses Open Sans)
        sans: ["'Open Sans'", 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
    },
  },
  plugins: [],
}
