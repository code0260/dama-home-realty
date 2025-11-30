const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Removed - using next start instead
  // Fix workspace root detection - explicitly set to current directory
  outputFileTracingRoot: path.join(__dirname),
  // Disable Turbopack completely - use Webpack instead (more stable on shared hosting)
  experimental: {
    turbo: false,
  },
  // Force Webpack
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
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
