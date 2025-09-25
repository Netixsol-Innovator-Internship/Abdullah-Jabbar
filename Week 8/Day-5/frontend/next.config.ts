import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* proxy API requests during development to the backend server so the frontend
   can call /api/* without CORS or changing API paths. This also allows overriding
   the base URL with NEXT_PUBLIC_API_BASE for other environments. */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
