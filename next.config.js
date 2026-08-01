/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  
  // Exclude jiosaavn-api from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Exclude jiosaavn-api folder from build
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/jiosaavn-api/**', '**/node_modules/**'],
    }
    return config
  },
}

module.exports = nextConfig