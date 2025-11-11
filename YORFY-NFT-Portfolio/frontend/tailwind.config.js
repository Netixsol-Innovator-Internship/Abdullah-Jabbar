/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E50FF", // MUI primary.main
        secondary: "#051139", // MUI secondary.main
        purple: "#AA00FF", // MUI custom.purple
        grayLight: "#D9D9D9", // MUI custom.grayLight
        background: "#051139", // MUI background.default
        textPrimary: "#FFFFFF", // MUI text.primary
        textSecondary: "#EBEBEB", // MUI text.secondary
      },
      fontFamily: {
        poppins: ["Poppins", "Arial", "sans-serif"], // MUI font
      },
    },
  },
  darkMode: "class", // matches your MUI dark mode
  plugins: [],
  important: true, // optional: makes Tailwind classes override MUI styles
};

export default config;
