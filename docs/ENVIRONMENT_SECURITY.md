# Environment Configuration Security

## Overview

This application has been configured to use environment variables securely without hardcoded fallback URLs in the source code. This prevents accidental exposure of backend URLs in client bundles.

## Required Environment Variables

### For Development (.env)
```bash
NEXT_PUBLIC_API_URL=https://your-api-url-here
BACKEND_API_URL=https://your-api-url-here
```

### For Production
Set these environment variables in your deployment platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_API_URL` and `BACKEND_API_URL`

**Google Cloud Run:**
```bash
gcloud run deploy your-service-name \
  --set-env-vars NEXT_PUBLIC_API_URL=https://your-api-url-here,BACKEND_API_URL=https://your-api-url-here
```

## Security Improvements

✅ **Removed hardcoded API URLs** - No fallback URLs in source code
✅ **Environment validation** - App fails fast if URLs not configured  
✅ **Removed cPanel references** - Cleaned up deployment scripts
✅ **Secure configuration** - Uses `lib/env-config.ts` for validation

## Configuration Files

- `lib/env-config.ts` - Centralized environment variable validation
- `lib/api-config.ts` - API configuration using secure env vars
- `lib/api.ts` - Main API client with secure configuration
- `.env` - Development environment variables
- `.env.production` - Production environment variables

## Deployment Checklist

Before deploying:

1. ✅ Set environment variables in your deployment platform
2. ✅ Test locally with `npm run build` 
3. ✅ Verify no hardcoded URLs in source code
4. ✅ Check that API calls work in production

## Error Handling

If environment variables are not set, you'll see:
```
Error: API URL not configured. Please set NEXT_PUBLIC_API_URL or BACKEND_API_URL environment variable.
```

This is intentional - the app will not start without proper configuration.
