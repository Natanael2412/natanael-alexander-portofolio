import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
    qualities: [75, 80, 95, 100],
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
      // Default locale (id) — no prefix
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
      },
      // Non-default locale (en) — with prefix
      {
        source: "/en/about",
        destination: "/en",
      },
      {
        source: "/en/work",
        destination: "/en",
      },
      {
        source: "/en/contact",
        destination: "/en",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/portofolio",
        destination: "/portfolio",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
