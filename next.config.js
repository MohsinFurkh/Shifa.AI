/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Remove the deprecated options
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack: (config) => {
    // This is to handle the native dependencies
    config.externals.push({
      'mongodb-client-encryption': 'mongodb-client-encryption',
    });
    return config;
  },
};

module.exports = nextConfig; 