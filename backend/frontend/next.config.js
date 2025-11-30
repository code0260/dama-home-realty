const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Removed - using next start instead
  // Webpack is used by default when Turbopack is disabled via environment variable
  // Fix workspace root detection - explicitly set to current directory
  outputFileTracingRoot: path.join(__dirname),
  // Fix Turbopack root detection
  experimental: {
    turbo: {
      root: path.join(__dirname),
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'damahomerealty.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
