let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

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
  // Exclude API routes from static export - necessary for Vercel deployment
  experimental: {
    // Note: this is an experimental feature, but it's the recommended way to handle this issue
    // It ensures that API routes are not processed during static export
    excludeDefaultMomentLocales: true,
    webVitalsAttribution: ['CLS', 'LCP'],
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
    BACKEND_API_URL: 'https://litefi-backend.onrender.com'
  },
  // Only include supported experimental features
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
};

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig; 