/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gzip / Brotli compression for all responses
  compress: true,

  // Don't expose source maps in production builds
  productionBrowserSourceMaps: false,

  /**
   * Proxy all /backend/** requests through Vercel's server to the EC2 backend.
   * This eliminates CORS entirely — the browser only ever talks to Vercel (same
   * origin), and Vercel's edge forwards the request to EC2 server-side.
   *
   * Required Vercel env vars:
   *   BACKEND_URL          = http://<EC2-IP>   (server-side only, no trailing slash)
   *   NEXT_PUBLIC_API_URL  = /backend/api/v1   (used by the browser)
   */
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  images: {
    // Add remote domains here when integrating a CDN or headless CMS.
    remotePatterns: [],
  },
};

export default nextConfig;
