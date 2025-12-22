import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  // This creates a minimal production bundle with all dependencies
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
