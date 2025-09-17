import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow NextJS to display images from picsum.photos.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
