import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow NextJS to display images from picsum.photos.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
};

export default nextConfig;
