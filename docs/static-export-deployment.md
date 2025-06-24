# Static Export Deployment Guide

This guide explains how to deploy the LiteFi Web App as a static export.

## Understanding Static Exports in Next.js

Next.js allows you to export your application to static HTML files that can be served by any static hosting service. This is done using the `output: 'export'` configuration in `next.config.mjs`.

When using static exports, there are certain limitations:
- API Routes need to be marked as `dynamic = 'force-static'`
- Server-side features like middleware have limited functionality
- Dynamic server-side rendering is not available

## API Routes in Static Exports

All API routes in the application must include the `dynamic = 'force-static'` export to be compatible with static exports. This tells Next.js to include these routes in the static export.

Example:
```typescript
// Add this line to make the route compatible with static exports
export const dynamic = 'force-static';
```

## Deployment Steps

1. **Build the application**:
   ```bash
   npm run build
   ```
   This will generate static files in the `out` directory.

2. **Deploy to a static hosting service**:
   - Upload the contents of the `out` directory to your hosting service
   - Configure your hosting service to handle client-side routing (see below)

## Hosting Configuration

### Vercel

Vercel automatically handles static exports from Next.js. Simply connect your repository and deploy.

### Other Static Hosts (like CPanel)

For hosts like CPanel, you need to:

1. Upload the contents of the `out` directory to your web root
2. Configure URL rewriting for client-side routing

#### Apache Configuration (for CPanel)

Create or edit `.htaccess` file in your web root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle client-side routing
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>
```

## Troubleshooting

### Missing `dynamic = 'force-static'` Export

If you encounter build errors about missing `dynamic = 'force-static'` exports, you can run the provided script to add this to all API routes:

```bash
node scripts/fix-api-routes.js
```

### API Functionality

Remember that in a static export, API routes don't function as true server endpoints. They are included in the JavaScript bundle and run on the client side. For true server functionality, you need a server-side deployment.

## Backend Communication

This static frontend should be configured to communicate with your backend API. Make sure the environment variables in `next.config.mjs` are set correctly:

```javascript
env: {
  NEXT_PUBLIC_API_URL: 'https://your-backend-url.com',
  BACKEND_API_URL: 'https://your-backend-url.com'
}
``` 