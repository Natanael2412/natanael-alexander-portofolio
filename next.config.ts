import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error"] }
      : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.anugerahventures.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-3f5c4bd8e0904cd59374f969e476a0c2.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/",
      },
      {
        source: "/work",
        destination: "/",
      },
      {
        source: "/contact",
        destination: "/",
      }
    ];
  },
};

export default nextConfig;
