/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
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
};

module.exports = nextConfig; 