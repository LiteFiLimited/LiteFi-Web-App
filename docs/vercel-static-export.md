# Deploying Next.js Static Exports to Vercel

This document explains how to deploy a Next.js application with static exports (`output: 'export'`) to Vercel.

## The Problem

When using `output: 'export'` in Next.js, the application is built as a static site without server components. However, Vercel's default Next.js deployment expects certain files like `routes-manifest.json` that are not generated in static export mode.

## The Solution

We've implemented the following changes to make the static export compatible with Vercel:

1. **Updated `next.config.mjs`**:
   - Removed `distDir: 'out'` as it conflicts with `output: 'export'`
   - Kept `output: 'export'` to generate static files

2. **Updated `vercel.json`**:
   - Changed `framework` from `"nextjs"` to `null` to tell Vercel not to use its Next.js-specific handling
   - Set `buildCommand` to `"npm run vercel-build"` to use our custom build script
   - Kept `outputDirectory: "out"` to specify where the built files are located

3. **Added a custom build script**:
   - Created `scripts/prepare-vercel-deploy.js` that generates a minimal `routes-manifest.json` file
   - Added a `vercel-build` script to package.json that runs the build and then the preparation script

## How It Works

1. When Vercel runs the build, it executes `npm run vercel-build`
2. This runs `next build` to generate the static export in the `out` directory
3. Then it runs `node scripts/prepare-vercel-deploy.js` which creates the missing `routes-manifest.json` file
4. Vercel serves the static files from the `out` directory

## API Routes in Static Exports

Remember that in a static export, API routes don't function as true server endpoints. They are included in the JavaScript bundle and run on the client side. All API routes must include:

```typescript
export const dynamic = 'force-static';
```

## Middleware in Static Exports

One of the most common issues when deploying a Next.js static export to Vercel is middleware. Next.js middleware is not supported in static exports, but Vercel still tries to load it, causing the error:

```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
```

We've implemented the following solutions to completely disable middleware:

1. **Replaced the middleware file with a dummy version**:
   - Completely emptied the middleware.ts file
   - Added `export const dynamic = 'force-static'` to the middleware file
   - Set an empty matcher array to prevent middleware from running on any routes

2. **Created special files for Vercel**:
   - Added `middleware-manifest.json` with empty configuration
   - Created a `server` directory with a dummy `middleware.js` file
   - Added `middleware.js.nft.json` to prevent middleware from loading

3. **Added environment variables**:
   - Set `NEXT_EXPORT: "true"` in vercel.json
   - Set `NEXT_DISABLE_MIDDLEWARE: "1"` in vercel.json

4. **Created a special build process for Vercel**:
   - Created a special `next.config.vercel.mjs` file with middleware disabled
   - Updated the `vercel-build` script to use this special config file
   - Added a script to remove middleware files from the build output

These changes ensure that Vercel doesn't try to execute the middleware in the static export, which would cause errors.

## Limitations

With this setup, there are some limitations:

1. No server-side rendering
2. No API routes (they're included in the bundle but don't function as true server endpoints)
3. No middleware functionality
4. No incremental static regeneration

## Benefits

1. Faster page loads (fully static)
2. Can be deployed to any static hosting provider
3. Lower hosting costs
4. Better reliability (no server to go down) 