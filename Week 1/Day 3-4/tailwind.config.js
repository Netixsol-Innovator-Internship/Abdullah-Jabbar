/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        1.3: "0.325rem", // ~5.2px
      },
      fontFamily: {
        'inter': ["Inter", "sans-serif"], // Define 'inter' as a custom font family
        'poppins': ["Poppins", "sans-serif"],
        'imperial-script': ['"Imperial Script"', "cursive"],
      },
    },
  },
  plugins: [],
};