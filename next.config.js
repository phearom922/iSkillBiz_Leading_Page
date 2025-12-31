/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles Next.js automatically, no need for static export
  // Next.js will automatically generate static pages for pages without server-side features
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

module.exports = nextConfig;

