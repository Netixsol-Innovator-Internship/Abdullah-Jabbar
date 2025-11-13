# Vercel Deployment Guide

This guide walks you through deploying the IP Tracker backend to Vercel with MongoDB Atlas.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Vercel CLI** (optional): `npm i -g vercel`

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Free Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Build a Database"**
3. Choose **M0 (Free tier)**
4. Select a cloud provider and region (choose one close to your Vercel deployment region)
5. Name your cluster (e.g., `ip-tracker-cluster`)
6. Click **"Create"**

### 1.2 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required for Vercel's serverless functions, which have dynamic IPs
4. Click **"Confirm"**

### 1.3 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and generate a secure password
5. Under **"Database User Privileges"**, select **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Choose **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password
8. Add your database name after `.net/`:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/ip-tracker?retryWrites=true&w=majority
   ```

## Step 2: Prepare Your Project

### 2.1 Verify Files

Ensure these files exist in your `backend/` directory:

- ✅ `vercel.json` - Deployment configuration
- ✅ `package.json` - Dependencies with `@vercel/node`
- ✅ `.env.example` - Environment variable template
- ✅ `src/main.ts` - Production trust proxy configuration

### 2.2 Generate IP Salt

Generate a secure random salt for hashing IPs:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Node.js (any OS):**
```javascript
require('crypto').randomBytes(32).toString('base64')
```

Save this value - you'll need it for Vercel environment variables.

## Step 3: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..." → "Project"**
   - Import your GitHub repository
   - Select the repository containing your backend

3. **Configure Project:**
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** `pnpm install && pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

4. **Add Environment Variables:**
   Click **"Environment Variables"** and add:

   | Name | Value | Type |
   |------|-------|------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ip-tracker` | Secret |
   | `IP_SALT` | `<your-generated-salt>` | Secret |
   | `STORE_RAW_IP` | `false` | Plain Text |
   | `NODE_ENV` | `production` | Plain Text |

5. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)
   - Your API will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy from backend directory:**
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI production
   # Paste your MongoDB connection string when prompted
   
   vercel env add IP_SALT production
   # Paste your generated salt when prompted
   
   vercel env add STORE_RAW_IP production
   # Enter: false
   
   vercel env add NODE_ENV production
   # Enter: production
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Step 4: Test Deployment

### 4.1 Test Basic Endpoints

**Health Check:**
```bash
curl https://your-project.vercel.app
```

**Get All IP Logs:**
```bash
curl https://your-project.vercel.app/ip-logs/by-path?path=/
```

**Get Unique IPs:**
```bash
curl https://your-project.vercel.app/ip-logs/unique-ips?path=/
```

### 4.2 Test Resource Tracking

**View a Product (creates view log):**
```bash
curl https://your-project.vercel.app/products/123
```

**Get Product Viewers:**
```bash
curl https://your-project.vercel.app/ip-logs/products/123
```

**Order a Product:**
```bash
curl -X POST https://your-project.vercel.app/products/123/order
```

**Get Product Stats:**
```bash
curl https://your-project.vercel.app/ip-logs/resources/product/123/stats
```

Expected response:
```json
{
  "resourceType": "product",
  "resourceId": "123",
  "views": 5,
  "orders": 2,
  "uniqueIps": 3,
  "conversionRate": 40.00
}
```

## Step 5: Monitor MongoDB

### 5.1 View Data in Atlas

1. Go to **"Database"** in MongoDB Atlas
2. Click **"Browse Collections"**
3. Select your database (`ip-tracker`)
4. View collections:
   - `ip_logs` - All request logs
   - `ip_resource_logs` - Resource-specific tracking (products, orders)

### 5.2 Create Indexes (Optional)

Indexes are automatically created by Mongoose schemas, but you can verify:

**ip_logs indexes:**
- `{ hashedIp: 1, createdAt: -1 }`
- `{ path: 1, createdAt: -1 }`
- `{ createdAt: -1 }`

**ip_resource_logs indexes:**
- `{ resourceType: 1, resourceId: 1, createdAt: -1 }`
- `{ hashedIp: 1, resourceType: 1, resourceId: 1 }`
- `{ action: 1, createdAt: -1 }`

## Step 6: Update Application Routes

### 6.1 Frontend Integration

If you have a frontend, update API URLs:

```typescript
// .env.local (frontend)
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

### 6.2 CORS Configuration (if needed)

If your frontend is on a different domain, enable CORS in `src/main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });
  
  // ... rest of bootstrap
}
```

Redeploy after changes:
```bash
vercel --prod
```

## Troubleshooting

### Build Fails

**Error: `Cannot find module '@vercel/node'`**
- Ensure `@vercel/node` is in `dependencies`, not `devDependencies`
- Run: `pnpm add @vercel/node`

**Error: `Module not found: mongoose`**
- Ensure `mongoose` and `@nestjs/mongoose` are installed
- Check `package.json` dependencies

### Runtime Errors

**Error: `MongoServerError: Authentication failed`**
- Verify MongoDB connection string username/password
- Check Database User permissions in Atlas
- Ensure password is URL-encoded (replace special characters)

**Error: `IP is always 127.0.0.1`**
- Trust proxy is not configured correctly
- Verify `process.env.VERCEL === '1'` in production
- Check Vercel logs: `vercel logs`

**Error: `Cannot connect to MongoDB`**
- Verify Network Access allows 0.0.0.0/0 in Atlas
- Check connection string format
- Test connection string locally first

### No Data in MongoDB

**Logs not being created:**
1. Check Vercel logs: `vercel logs`
2. Verify middleware is applied to all routes
3. Test locally with MongoDB Atlas connection
4. Check `STORE_RAW_IP` and `IP_SALT` env vars

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ Yes | - | MongoDB connection string |
| `IP_SALT` | ✅ Yes | - | Salt for hashing IPs |
| `STORE_RAW_IP` | ❌ No | `false` | Store raw IPs (not recommended) |
| `NODE_ENV` | ❌ No | - | Set to `production` for Vercel |
| `PORT` | ❌ No | `3000` | Port (auto-assigned by Vercel) |
| `VERCEL` | ✅ Auto | `1` | Auto-set by Vercel (don't configure) |

## Security Checklist

- ✅ MongoDB Atlas: Network Access set to 0.0.0.0/0 (Vercel requirement)
- ✅ MongoDB Atlas: Database user has minimum required permissions
- ✅ Strong password for MongoDB user (20+ characters)
- ✅ Secure IP_SALT generated with cryptographic random
- ✅ STORE_RAW_IP=false (hash IPs for privacy)
- ✅ Trust proxy enabled in production
- ✅ Environment variables stored as Vercel Secrets

## Next Steps

1. **Set up monitoring:** Use Vercel Analytics or MongoDB Charts
2. **Configure alerts:** Set up Atlas alerts for database issues
3. **Add rate limiting:** Protect endpoints from abuse
4. **Implement authentication:** Secure admin endpoints
5. **Add data retention:** Auto-delete old logs after X days

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **NestJS Docs:** https://docs.nestjs.com
- **Mongoose Docs:** https://mongoosejs.com/docs

## Cost Estimates

**Free Tier:**
- Vercel: 100GB bandwidth/month
- MongoDB Atlas M0: 512MB storage, shared cluster
- **Total: $0/month** for small projects

**If you exceed free limits:**
- Vercel Pro: $20/month
- MongoDB Atlas M10: $0.08/hour (~$57/month)
