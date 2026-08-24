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

  // Dashboard HTML must not be cached across deploys — stale documents
  // point at deleted JS chunks and render a blank black page.
  async headers() {
    const noStore = [
      { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
    ];
    return [
      { source: '/admin', headers: noStore },
      { source: '/admin/:path*', headers: noStore },
      { source: '/user', headers: noStore },
      { source: '/user/:path*', headers: noStore },
    ];
  },
};

export default nextConfig;
