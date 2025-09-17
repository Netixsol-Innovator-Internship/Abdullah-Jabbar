import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
  async rewrites() {
    // Only apply rewrites in development when API_URL is not set
    if (
      process.env.NODE_ENV === "development" &&
      !process.env.NEXT_PUBLIC_API_URL
    ) {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:4000/api/:path*",
        },
        {
          source: "/template/:path*",
          destination: "http://localhost:4000/template/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
