import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com']
  }
};

export default nextConfig;
