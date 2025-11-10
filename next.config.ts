import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://mastodon.social/**")]
  },
  env: {
    "MASTO_INSTANCE": process.env.MASTO_INSTANCE
  }
};

export default nextConfig;
