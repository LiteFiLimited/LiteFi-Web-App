/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export', // Ensure static export
  // Configure static export to ignore API routes
  staticPageGenerationTimeout: 120,
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
  // Only include supported experimental features
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
};

export default nextConfig; 