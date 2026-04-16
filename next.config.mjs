/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow optimizing local /public images.
    // Add remote domains here when integrating a CDN or headless CMS.
    remotePatterns: [],
  },
};

export default nextConfig;
