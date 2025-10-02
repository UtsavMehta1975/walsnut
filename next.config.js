/** @type {import('next').NextConfig} */
const nextConfig = {
  // Linting configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpaperaccess.com',
        pathname: '/**',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'jose'],
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.cashfree.com; connect-src 'self' https://api.cashfree.com;"
          }
        ]
      }
    ]
  },
  
  // Webpack configuration to handle jose module
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('jose')
    }
    // Ensure jose is available for middleware
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'jose': require.resolve('jose')
    }
    return config
  },
  
  // Disable static generation for error pages to prevent Html import issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Skip static generation for error pages
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/404',
          destination: '/api/not-found',
        },
        {
          source: '/500',
          destination: '/api/server-error',
        },
      ],
    }
  },
  
  // Compression
  compress: true,
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|avif|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

