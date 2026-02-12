import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.salla.sa", 
      },
      {
        protocol: "https",
        hostname: "cdn.salla.network", 
      },
      {
        protocol: "https",
        hostname: "media.wired.com", 
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", 
      },
    ],
  },
};

export default nextConfig;
