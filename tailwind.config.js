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
        // Exact palette from style guide (image)
        "primary": EnvConfig.PRIMARY_COLOR,
        // Main teal family
        "primary-50": "#79D4DD",
        "primary-100": "#79D3DB",
        "primary-200": "#7DD4DC",
        "primary-300": "#3DB0C5",
        "primary-400": "#018DAE",
        "primary-600": "#01748A",
        "primary-700": "#015D6F",

        // Neutrals / supporting
        "black": "#000000",
        "neutral-18": "#545454",
        "neutral-04": "#EBEBEB",
        "white": "#FFFFFF",

        // Small helpers kept from previous tokens
        "neutral-03": "#F9F9F9",
        "neutral-05": "#D9D9D9",
        "neutral-06": "#B1B1B1",
        "neutral-07": "#656565",

        "error-full-opacity": "#DA1E28",
        "error": "#FD2148",

        "success": "#24A148",

        // Cores do Figma
        "figma-black": "#000",
        "figma-gray": "#545454",
        "figma-teal": "#01BDAE",
        "figma-light-gray": "#EBEBEB",
        "figma-white": "#FFF",
        "figma-cyan": "#7DD4DC",
        "figma-cyan-light": "#79D4DD",
        "figma-cyan-alt": "#79d3db",
        "figma-teal-dark": "#3DB0C5",
        "figma-teal-alt": "#01BFAE",

        "overlay": "rgba(0, 0, 0, 0.5)",
        "white-transparent": "rgba(255, 255, 255, 0.96)",
        "transparent": "rgba(0,0,0,0)",
      },
      fontFamily: {
        // Use Open Sans as the default sans font (Figma uses Open Sans)
        sans: ["'Open Sans'", 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      borderRadius: {
        // design-specific radii
        'card': '12px',
        'lg': '10px',
        'pill': '9999px'
      },
      boxShadow: {
        // softer card shadow and a slightly stronger elevated shadow
        'card': '0 6px 18px rgba(15, 23, 42, 0.06)',
        'elevated': '0 12px 30px rgba(15, 23, 42, 0.08)'
      },
      // NOTE: additional colors consolidated above
    },
  },
  plugins: [],
}
