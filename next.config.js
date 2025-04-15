/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the new serverExternalPackages option instead of the deprecated one
  serverExternalPackages: ['mongoose'],
  webpack: (config) => {
    // This is to handle the native dependencies
    config.externals.push({
      'mongodb-client-encryption': 'mongodb-client-encryption',
    });
    return config;
  },
};
module.exports = nextConfig;
