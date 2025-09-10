import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const reviewsBase =
    env.VITE_REVIEWS_BASE ||
    "https://week5-day3-4-tea-reviews-backend.vercel.app";

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        "/nest": {
          target: reviewsBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/nest/, ""),
        },
      },
    },
  };
});
