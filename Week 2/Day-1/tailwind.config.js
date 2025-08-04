/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // 'montserrat' is the utility class you will use
        // 'Montserrat' is the font name from your @font-face rule
      },
    },
  },
  plugins: [],
};
