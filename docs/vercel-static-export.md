# Vercel Static Export Guide

This document outlines the steps taken to enable static export deployment on Vercel for this Next.js application.

## Background

Next.js static exports (`output: 'export'`) are incompatible with certain features, particularly middleware. When deploying to Vercel, this can cause a `MIDDLEWARE_INVOCATION_FAILED` error.

## Solution

We've implemented a solution that completely disables middleware for Vercel deployments while maintaining a clean build process.

### Key Components

1. **Minimal middleware.ts file**
   - Contains a placeholder middleware that does nothing
   - Uses `export const dynamic = 'force-static'` to ensure static compatibility
   - Has an empty matcher to prevent it from running on any routes

2. **Vercel-specific Next.js config**
   - `next.config.vercel.mjs` is used specifically for Vercel deployments
   - Contains all necessary settings for static export
   - Sets environment variables to disable middleware

3. **Cleanup script**
   - `scripts/cleanup-for-vercel.js` removes all middleware-related files from the build output
   - Creates minimal placeholder files needed for Vercel compatibility

4. **Minimal vercel.json**
   - Contains only essential configuration for static export
   - Avoids complex routing rules that might conflict with static export

### Build Process

The build process for Vercel is defined in package.json:

```json
"vercel-build": "cp next.config.vercel.mjs next.config.mjs && next build && node scripts/cleanup-for-vercel.js"
```

This process:
1. Uses the Vercel-specific Next.js config
2. Builds the application
3. Runs the cleanup script to remove middleware files and create minimal placeholders

## Troubleshooting

If you encounter the `MIDDLEWARE_INVOCATION_FAILED` error or `Route at index X must define either 'handle' or 'src' property` error:

1. Ensure vercel.json is minimal and doesn't contain complex routing rules
2. Verify that all middleware files are properly removed from the build output
3. Check that the cleanup script is running correctly

## References

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview) 