/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.BIOLINKS_BUILD_DIR || '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Cloudinary CDN
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/jiosaavn-api/**', '**/node_modules/**'],
    }
    return config
  },
}

module.exports = nextConfig
