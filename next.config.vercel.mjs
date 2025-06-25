/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ensure static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://litefi-backend.onrender.com',
    BACKEND_API_URL: 'https://litefi-backend.onrender.com',
    NEXT_DISABLE_MIDDLEWARE: '1',
    NEXT_EXPORT: 'true'
  },
  // Disable middleware completely
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig; 