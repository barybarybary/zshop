import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AUTH_URL: process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://gleeful-swan-e04080.netlify.app",
  },
};

export default nextConfig;
