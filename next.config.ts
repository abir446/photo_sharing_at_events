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
      bodySizeLimit: '50mb', // Increases the limit to 5MB
    },
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;