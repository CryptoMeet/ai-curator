/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default {
  ...nextConfig,
  async rewrites() {
    return [];
  },
  server: {
    port: 4040
  }
};