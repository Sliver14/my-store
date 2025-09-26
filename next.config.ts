import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'picsum.photos'],
  },
  /* config options here */
};

export default nextConfig;
