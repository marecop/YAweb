/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['yellow-airlines.com', 'localhost'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    return config;
  },
  // 允許在服務器組件中導入特定文件
  experimental: {
    serverComponentsExternalPackages: ['tailwindcss'],
  },
  typescript: {
    // 在生產構建時忽略 TypeScript 錯誤
    ignoreBuildErrors: true,
  },
  eslint: {
    // 在生產構建時忽略 ESLint 錯誤
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 