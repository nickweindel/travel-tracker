import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
