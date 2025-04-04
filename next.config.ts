import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:4040'],
    },
  },
  async rewrites() {
    return [];
  },
  // Set the correct port configuration
  async headers() {
    return [];
  },
};

export default nextConfig;
