# Vercel Static Export Guide

This document outlines the steps taken to enable static export deployment on Vercel for this Next.js application.

## Background

Next.js static exports (`output: 'export'`) are incompatible with certain features, particularly middleware. When deploying to Vercel, this can cause a `MIDDLEWARE_INVOCATION_FAILED` error or routing errors like `Route at index X must define either 'handle' or 'src' property`.

## Solution

We've implemented a solution that completely disables middleware for Vercel deployments and ensures proper routing configuration.

### Key Components

1. **Minimal middleware.ts file**
   - Contains only the necessary configuration to be ignored during build
   - Uses `export const dynamic = 'force-static'` to ensure static compatibility
   - Has an empty matcher to prevent it from running on any routes

2. **Vercel-specific Next.js config**
   - `next.config.vercel.mjs` contains only essential settings for static export
   - Disables middleware completely with `skipMiddlewareUrlNormalize` and `skipTrailingSlashRedirect`

3. **Cleanup script**
   - `scripts/cleanup-for-vercel.js` removes all middleware-related files from the build output
   - Creates a minimal routes-manifest.json file

4. **Vercel output script**
   - `scripts/create-vercel-output.js` creates the proper Vercel output structure
   - Copies build output to `.vercel/output/static`
   - Creates a valid config.json with proper routes configuration

5. **Minimal vercel.json**
   - Contains only essential configuration for static export
   - Avoids complex routing rules that might conflict with static export

### Build Process

The build process for Vercel is defined in package.json:

```json
"vercel-build": "cp next.config.vercel.mjs next.config.mjs && next build && node scripts/cleanup-for-vercel.js && node scripts/create-vercel-output.js"
```

This process:
1. Uses the Vercel-specific Next.js config
2. Builds the application
3. Runs the cleanup script to remove middleware files
4. Creates the proper Vercel output structure

## Troubleshooting

If you encounter the `MIDDLEWARE_INVOCATION_FAILED` error or `Route at index X must define either 'handle' or 'src' property` error:

1. Ensure vercel.json is minimal and doesn't contain complex routing rules
2. Verify that all middleware files are properly removed from the build output
3. Check that the Vercel output structure is correctly formatted
4. Make sure the routes configuration in `.vercel/output/config.json` is valid

## References

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Vercel Build Output API](https://vercel.com/docs/build-output-api/v3)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview) 