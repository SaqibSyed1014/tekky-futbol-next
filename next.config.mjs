import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,

  // Keep Turbopack (if used) scoped to this app, not the parent workspace.
  turbopack: {
    root: __dirname,
  },

  experimental: {
    webpackMemoryOptimizations: true,
  },

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
