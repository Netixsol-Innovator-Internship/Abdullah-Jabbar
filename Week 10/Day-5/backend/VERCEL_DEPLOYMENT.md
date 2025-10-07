# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Your backend code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the `backend` folder as your root directory

### 2. Configure Build Settings

Vercel should automatically detect your Node.js project. If needed, configure:

- **Framework Preset**: Other
- **Root Directory**: `backend` (if deploying from a monorepo)
- **Build Command**: `pnpm vercel-build` or `npm run vercel-build`
- **Output Directory**: Leave empty (Vercel will use the serverless function)
- **Install Command**: `pnpm install` or `npm install`

### 3. Set Environment Variables

In your Vercel project settings, go to "Environment Variables" and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://leoplaner211_db_user:123@cluster0.rrzzvyt.mongodb.net/AI_Assignments_Checker?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyDAnjHZf61h62co_zaApoM_bK3EoY3vhaM
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
OUTPUT_DIR=./output
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_WORD_COUNT=5000
```

**Note**: For security reasons, consider using Vercel's environment variable management or a service like Doppler for production secrets.

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a URL like `https://your-project.vercel.app`

## Local Development with Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` with your actual credentials

3. Run locally:
   ```bash
   pnpm install
   pnpm run start:dev
   ```

## Testing Your Deployment

Once deployed, test your endpoints:

```bash
# Health check
curl https://your-project.vercel.app/

# Get assignments
curl https://your-project.vercel.app/assignments

# Upload and evaluate (replace with your actual file)
curl -X POST -F "file=@test.pdf" -F "assignmentTitle=Test Assignment" https://your-project.vercel.app/assignments/upload-and-evaluate
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Function Timeouts**: Increase timeout in `vercel.json` (max 60s for hobby plan)
3. **Environment Variables**: Ensure all required env vars are set in Vercel dashboard
4. **File Uploads**: Vercel has request size limits (4.5MB for hobby plan)

### Logs

Check function logs in Vercel dashboard under "Functions" tab to debug issues.

### File Storage

Note: Vercel's serverless functions are stateless. Files uploaded to `/tmp` or local directories will be lost between requests. Consider using:

- Vercel Blob for file storage
- AWS S3
- Google Cloud Storage
- Or another cloud storage service

## Production Considerations

1. **Database**: Use a production MongoDB instance (MongoDB Atlas recommended)
2. **API Keys**: Use Vercel's environment variables or a secret management service
3. **File Storage**: Implement cloud storage for uploaded files
4. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)
5. **Rate Limiting**: Implement rate limiting for API endpoints