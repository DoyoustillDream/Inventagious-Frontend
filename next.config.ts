import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // SEO Optimizations
  compress: true,
  poweredByHeader: false,

  // Note: NEXT_PUBLIC_* environment variables are automatically exposed by Next.js
  // No need for explicit env section - it can cause issues if values are undefined at config load time

  // Webpack configuration for Solana/Anchor dependencies (when using webpack)
  webpack: (config, { isServer, dev }) => {
    // Memory optimizations for build process
    if (!dev) {
      // Optimize memory usage during production builds
      config.optimization = {
        ...config.optimization,
        // Reduce memory usage by limiting parallel processing
        moduleIds: 'deterministic',
        // Split chunks more aggressively to reduce memory pressure
        splitChunks: {
          ...(config.optimization?.splitChunks || {}),
          maxInitialRequests: 25,
          minSize: 20000,
        },
      };

      // Limit worker pool size to reduce memory usage
      // Next.js 16 may use SWC minifier, but we check for TerserPlugin as fallback
      if (config.plugins) {
        const terserPlugin = config.plugins.find(
          (plugin: any) => plugin?.constructor?.name === 'TerserPlugin'
        );
        if (terserPlugin && terserPlugin.options) {
          terserPlugin.options = {
            ...terserPlugin.options,
            parallel: 2, // Limit parallel workers to reduce memory usage
          };
        }
      }
    }

    if (!isServer) {
      // For client-side, we need to handle Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },

  // Turbopack configuration for Next.js 16
  // Turbopack handles Node.js polyfills automatically, but we can add custom config if needed
  turbopack: {
    // Set root directory explicitly to the frontend directory
    // This tells Turbopack that the frontend directory is the workspace root
    // Use absolute path resolution to ensure Turbopack finds the Next.js package correctly
    // When running from frontend/, process.cwd() should be the frontend directory
    root: path.resolve(process.cwd()),
    resolveAlias: {
      // Turbopack automatically handles Node.js polyfills, but we can add aliases if needed
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow images from Supabase Storage, Moddio, and Solana
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.modd.io',
        pathname: '/_next/static/**',
      },
      {
        protocol: 'https',
        hostname: 'solana.com',
        pathname: '/_next/**',
      },
    ],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // API Proxy - Rewrite API requests to backend
  // SECURITY: This hides the backend URL from clients by proxying all /api/* requests
  async rewrites() {
    // Use server-side env var (BACKEND_URL) - this should NEVER be exposed to client
    // NEXT_PUBLIC_API_URL should only be '/api' (the proxy path)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Validate that we're not accidentally using a public env var for backend URL
    if (process.env.NEXT_PUBLIC_API_URL && 
        (process.env.NEXT_PUBLIC_API_URL.startsWith('http://') || 
         process.env.NEXT_PUBLIC_API_URL.startsWith('https://'))) {
      throw new Error(
        'SECURITY ERROR: NEXT_PUBLIC_API_URL must be "/api" (proxy path), not a direct backend URL. ' +
        'Use BACKEND_URL (server-side only) for the actual backend URL.'
      );
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
