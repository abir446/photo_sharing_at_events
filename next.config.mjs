/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all paths under the Cloudinary domain
      },
      
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/subscribe',
        destination: 'http://localhost:5000/api/subscribe',
      },
      {
        source: '/api/event/:id/sse',
        destination: 'http://localhost:5000/api/events/:id/sse',
      },
    ];
  },
};

export default nextConfig;
