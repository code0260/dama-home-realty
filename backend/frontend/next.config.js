const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Removed - using next start instead
  // Fix workspace root detection - explicitly set to current directory
  outputFileTracingRoot: path.join(__dirname),
  // Disable Turbopack completely - use Webpack instead (more stable on shared hosting)
  // Add empty turbopack config to silence the error and force Webpack usage
  turbopack: {},
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
  // TypeScript errors will now fail the build (default behavior)
  // This ensures type safety and catches errors early in the development process
  // typescript: {
  //   ignoreBuildErrors: false, // Removed - using default (fail on errors)
  // },
};

module.exports = nextConfig;
