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
        "primary": EnvConfig.PRIMARY_COLOR,
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
        
        "error-full-opacity": "#DA1E28",
        "error": "#FD2148",
        "error-80": "#E04951",
        "error-30": "#F4BBBE",
        "error-10": "#FBE8E9",
        "success": "#24A148",
        "success-45": "#9CD5AD",
        "success-30": "#BDE3C8",
        "success-10": "#E9F6ED",
        "warning-70": "#F1C21B",
        "warning-40": "#F9E7A4",
        "warning-30": "#FBEDBB",
        "warning-10": "#FEF9E8",
        "overlay": "rgba(0, 0, 0, 0.5)",
        "white-transparent": "rgba(255, 255, 255, 0.96)",
        "transparent": "rgba(0,0,0,0)",
      },
    },
  },
  plugins: [],
}
