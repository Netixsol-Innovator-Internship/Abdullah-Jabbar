// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // Scan all components/pages
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // custom font
        prosto: ["Prosto One", "sans-serif"],
      },
    },
  },
  plugins: [],
}
