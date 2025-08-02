const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      colors: {
        orange: {
          350: "#faaa66", // Pick a value between orange-300 and 400
        },
      },
      fontFamily: {
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
        spacemono: ["Space Mono", ...defaultTheme.fontFamily.mono],
        inter: ["Inter", "sans-serif"],
        clash: ["ClashDisplay", "sans-serif"],
        worksans: ['"Work Sans"', "sans-serif"],
      },
    },
  },
};
