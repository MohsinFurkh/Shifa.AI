/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverExternalPackages: ['mongoose'],
    esmExternals: 'loose', // Support mixed module formats
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