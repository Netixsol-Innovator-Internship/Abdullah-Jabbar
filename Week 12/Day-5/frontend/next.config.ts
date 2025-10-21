import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set the output file tracing root to the frontend directory to silence workspace warnings
  outputFileTracingRoot: __dirname,

  // Additional config options can be added here
};

export default nextConfig;
