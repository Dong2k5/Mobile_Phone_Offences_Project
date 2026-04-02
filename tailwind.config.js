/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        serif: ['"DM Serif Display"', "serif"],
      },
      colors: {
        navy: {
          950: "#0d1b2e",
          900: "#131f30",
          800: "#182335",
          700: "#1e2f42",
        },
        brand: {
          light: "#93c5fd",
          DEFAULT: "#3b82f6",
          mid: "#2563b0",
          dark: "#1d4ed8",
          deeper: "#1e3a5f",
          deepest: "#0f2744",
        },
      },
    },
  },
  plugins: [],
};
