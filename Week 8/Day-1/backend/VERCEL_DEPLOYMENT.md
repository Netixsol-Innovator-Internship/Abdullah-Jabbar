# Vercel Deployment Guide

## Files Added/Modified for Vercel Deployment

### 1. `vercel.json`
- Configures Vercel to use the serverless function approach
- Routes all requests to the `/api/index.ts` handler
- Sets maximum duration to 30 seconds for CV generation

### 2. `api/index.ts`
- Serverless function that wraps your NestJS application
- Initializes the app once and reuses it for subsequent requests
- Handles all routes through the NestJS router

### 3. `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces bundle size and deployment time

### 4. Updated `package.json`
- Added `vercel-build` script for Vercel's build process

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Testing the Deployment

Once deployed, you can test these endpoints:

- `GET /` - Welcome message
- `GET /health` - Health check endpoint  
- `GET /api` - API information
- `POST /api/cv/preview` - CV preview endpoint
- `POST /api/cv/generate` - CV generation endpoint

## Common Issues and Solutions

### 404 Errors
- Make sure all routes are properly defined in your controllers
- Verify the `vercel.json` routing configuration
- Check that the `api/index.ts` file is properly set up

### Build Errors
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test
- Check for TypeScript compilation errors

### Function Timeouts
- Increase the `maxDuration` in `vercel.json` if needed
- Optimize heavy operations (PDF/DOCX generation)
- Consider caching strategies

### Static File Serving
- Templates are served from the `/template` route
- Make sure template files are included in the deployment
- Update `.vercelignore` if excluding important files

## Environment Variables

If you need environment variables, add them in the Vercel dashboard or use:
```bash
vercel env add VARIABLE_NAME
```

## Local Development

For local development, continue using:
```bash
npm run dev
```

The serverless function setup only affects Vercel deployment, not local development.