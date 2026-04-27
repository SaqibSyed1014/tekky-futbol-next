/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
