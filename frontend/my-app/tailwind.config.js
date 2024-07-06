/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { light: "#0062ff", dark: "#0062ff" },
        secondary: { light: "#9e89eb", dark: "#291476" },
        accent: { light: "#9c55e2", dark: "#631daa" },
        text: { light: "#060d1e", dark: "#e1e8f9" },
        background: { light: "#fbfcfe", dark: "#010204" },
      },
    },
  },
  plugins: [],
};
