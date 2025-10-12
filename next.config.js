/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization configuration
  images: {
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    // Allow unoptimized images for external sources
    unoptimized: false,
    // Increase timeout for slow image sources
    minimumCacheTTL: 60,
  },
  
  // Experimental features for better CSS optimization
  experimental: {
    optimizeCss: true,
  },
  
  // Ensure all pages can be dynamically rendered
  output: 'standalone',
}

module.exports = nextConfig
