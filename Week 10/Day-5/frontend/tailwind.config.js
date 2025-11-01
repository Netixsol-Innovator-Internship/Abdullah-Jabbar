/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--background)",
          fg: "var(--foreground)",
          card: "var(--card-bg)",
          border: "var(--border)",
          "input-bg": "var(--input-bg)",
          "input-border": "var(--input-border)",
          "nav-bg": "var(--nav-bg)",
          "text-primary": "var(--text-primary)",
          "text-secondary": "var(--text-secondary)",
          "text-muted": "var(--text-muted)",
        },
      },
      backgroundImage: {
        "hero-gradient": "var(--hero-bg)",
      },
    },
  },
  plugins: [],
};
