import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Add trailing slashes for better compatibility
  trailingSlash: false,

  transpilePackages: ['@datakit/react-core', 'framer-motion'],

  serverExternalPackages: ['@react-pdf/renderer'],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        zlib: false,
      };
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8788/api/:path*',
      },
    ];
  },

  turbopack: {},
};

export default nextConfig;
