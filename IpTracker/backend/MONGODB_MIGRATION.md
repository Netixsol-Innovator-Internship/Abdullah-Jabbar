# MongoDB Migration Summary

This document summarizes the changes made to migrate from file-based logging to MongoDB for Vercel deployment.

## What Changed

### Architecture
- **Before:** File system logging to `logs/` directory with separate files per path
- **After:** MongoDB database with two collections: `ip_logs` and `ip_resource_logs`

### Why MongoDB?
Vercel's serverless environment has a **read-only file system**, making file-based logging impossible. MongoDB provides:
- ✅ Persistent storage across serverless invocations
- ✅ Fast queries with indexes
- ✅ Scalability for high traffic
- ✅ MongoDB Atlas free tier (512MB)

## File Changes

### New Files
1. **`ip-resource-log.entity.ts`** - Mongoose schema for resource-specific tracking
2. **`VERCEL_DEPLOYMENT.md`** - Complete deployment guide
3. **`example-product.controller.ts`** - Example of resource tracking

### Modified Files

#### `ip-logger.service.ts` (Complete Rewrite)
**Removed:**
- `logByPath()` - file-based logging
- `getLogsByPath()` - file reading
- All `fs` module usage

**Added:**
```typescript
// Save to main collection
log(params: LogParams): Promise<IpLog>

// Save to resource collection
logByResource(params: LogResourceParams): Promise<IpResourceLog>

// Query methods
getIpsByPath(path: string): Promise<IpLog[]>
getUniqueIpsByPath(path: string): Promise<string[]>
getIpsByResource(resourceType, resourceId): Promise<IpResourceLog[]>
getUniqueIpsByResource(resourceType, resourceId): Promise<string[]>
getIpsByResourceAction(resourceType, resourceId, action): Promise<IpResourceLog[]>
getResourceStats(resourceType, resourceId): Promise<ResourceStats>
```

#### `ip-log.entity.ts`
**Before:** TypeORM entity with `@Entity`, `@Column`, `@CreateDateColumn`
**After:** Mongoose schema with `@Schema()`, `@Prop()`, indexes

```typescript
// Indexes for performance
@Index({ hashedIp: 1, createdAt: -1 })
@Index({ path: 1, createdAt: -1 })
@Index({ createdAt: -1 })
```

#### `ip-logger.module.ts`
**Before:**
```typescript
imports: [TypeOrmModule.forFeature([IpLog])]
```

**After:**
```typescript
imports: [
  MongooseModule.forFeature([
    { name: IpLog.name, schema: IpLogSchema },
    { name: IpResourceLog.name, schema: IpResourceLogSchema },
  ]),
]
```

#### `app.module.ts`
**Added MongoDB connection:**
```typescript
imports: [
  MongooseModule.forRoot(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/ip-tracker',
  ),
  // ...
]
```

#### `ip-logger.controller.ts`
**New endpoint:**
```typescript
@Get('/resources/:type/:id/stats')
getResourceStats(@Param('type') type, @Param('id') id) {
  return this.ipLogger.getResourceStats(type, id);
}
```

Response includes:
- `views` - Total views
- `orders` - Total orders
- `uniqueIps` - Unique visitors
- `conversionRate` - (orders / views) * 100

#### `ip-logger.middleware.ts`
**Removed:** `logByPath()` call (file-based)
**Kept:** `log()` call (MongoDB)

#### `main.ts`
**Added Vercel detection:**
```typescript
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

if (isProduction) {
  server.set('trust proxy', true); // Trust Vercel proxy
} else {
  server.set('trust proxy', 'loopback, linklocal, uniquelocal'); // Local only
}
```

#### `.env.example`
**Added:**
- `MONGODB_URI` - Connection string
- `IP_SALT` - Hashing salt (required)
- Documentation for each variable

#### `vercel.json`
**Added environment variables:**
```json
"env": {
  "MONGODB_URI": "@mongodb_uri",
  "IP_SALT": "@ip_salt"
}
```

## Database Schema

### Collection: `ip_logs`
Stores all HTTP requests:
```javascript
{
  _id: ObjectId,
  ip: String,           // Raw IP (if STORE_RAW_IP=true)
  hashedIp: String,     // SHA-256 hash
  userAgent: String,
  method: String,       // GET, POST, etc.
  path: String,         // /products/123
  createdAt: Date
}
```

### Collection: `ip_resource_logs`
Stores resource-specific tracking:
```javascript
{
  _id: ObjectId,
  resourceType: String,  // 'product', 'order', 'article', etc.
  resourceId: String,    // '123', 'abc', etc.
  action: String,        // 'view', 'order', 'download', etc.
  ip: String,            // Raw IP (optional)
  hashedIp: String,      // SHA-256 hash
  userAgent: String,
  method: String,
  path: String,
  metadata: Mixed,       // Additional data (orderId, timestamp, etc.)
  createdAt: Date
}
```

## API Changes

### Existing Endpoints (Still Work)
```http
GET /ip-logs/by-path?path=/products
GET /ip-logs/unique-ips?path=/products
```

### New Endpoints
```http
# Get all views for a product
GET /ip-logs/products/:id

# Get stats (views, orders, conversion rate)
GET /ip-logs/resources/:type/:id/stats
```

### Example Usage

**Track a product view:**
```typescript
// Automatic via middleware
GET /products/123
```

**Track a product order:**
```typescript
@Post('products/:id/order')
async orderProduct(@Param('id') id: string, @Req() req: Request) {
  await this.ipLogger.logByResource({
    ip: req.ip,
    storeRaw: false,
    resourceType: 'product',
    resourceId: id,
    action: 'order',
    userAgent: req.get('User-Agent'),
    method: 'POST',
    path: `/products/${id}/order`,
  });
  
  // ... process order
}
```

**Get product stats:**
```bash
curl https://your-app.vercel.app/ip-logs/resources/product/123/stats
```

Response:
```json
{
  "resourceType": "product",
  "resourceId": "123",
  "views": 50,
  "orders": 12,
  "uniqueIps": 35,
  "conversionRate": 24.00
}
```

## Migration Steps for Existing Projects

If you had the old file-based version running:

1. **Backup existing logs:**
   ```bash
   cp -r logs/ logs_backup/
   ```

2. **Install MongoDB dependencies:**
   ```bash
   pnpm add mongoose @nestjs/mongoose
   ```

3. **Set up MongoDB:**
   - Create MongoDB Atlas cluster (free tier)
   - Get connection string
   - Add to `.env`

4. **Update code:**
   - All files are already updated in this repository
   - Copy new files to your project

5. **Test locally:**
   ```bash
   pnpm install
   pnpm start:dev
   ```

6. **Deploy to Vercel:**
   - Follow `VERCEL_DEPLOYMENT.md` guide
   - Set environment variables in Vercel dashboard
   - Deploy

## Performance Considerations

### Indexes Created
MongoDB automatically creates these indexes via Mongoose:

**ip_logs:**
- `{ hashedIp: 1, createdAt: -1 }` - Fast IP lookups
- `{ path: 1, createdAt: -1 }` - Fast path queries
- `{ createdAt: -1 }` - Fast time-based queries

**ip_resource_logs:**
- `{ resourceType: 1, resourceId: 1, createdAt: -1 }` - Fast resource queries
- `{ hashedIp: 1, resourceType: 1, resourceId: 1 }` - Unique IP counting
- `{ action: 1, createdAt: -1 }` - Action-based filtering

### Query Performance
- ✅ Path-based queries: O(log n) with index
- ✅ Unique IP counting: Uses aggregation pipeline
- ✅ Resource stats: Single aggregation query (1 database call)
- ✅ Date filtering: Indexed for fast time ranges

### Scaling
MongoDB Atlas free tier supports:
- 512MB storage (~1-5 million logs depending on data size)
- Shared cluster (sufficient for small-medium traffic)
- Auto-scaling available with paid tiers

## Security Improvements

### IP Privacy
- IPs are hashed with SHA-256 + salt by default
- Raw IPs only stored if `STORE_RAW_IP=true`
- Salt stored securely in Vercel environment variables

### Trust Proxy
- Production: Trusts Vercel's proxy infrastructure
- Development: Only trusts local/private networks
- Prevents IP spoofing attacks

### MongoDB Security
- Network access restricted in Atlas
- Database user has minimal required permissions
- Connection string stored as Vercel secret

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in `.env`
- Verify Network Access in Atlas (allow 0.0.0.0/0 for Vercel)
- Test connection locally first

### "No data being saved"
- Check Vercel logs: `vercel logs`
- Verify middleware is applied
- Check `IP_SALT` environment variable

### "conversionRate is NaN"
- Occurs when no views exist
- Check if product ID matches exactly
- Verify both 'view' and 'order' actions are logged

## Next Steps

1. **Deploy to Vercel:** Follow `VERCEL_DEPLOYMENT.md`
2. **Add authentication:** Protect admin endpoints
3. **Add rate limiting:** Prevent abuse
4. **Set up monitoring:** MongoDB Charts or Vercel Analytics
5. **Add data retention:** Auto-delete old logs (30/60/90 days)

## Support

For issues or questions:
1. Check `VERCEL_DEPLOYMENT.md` for deployment help
2. Check `PATH_TRACKING_GUIDE.md` for usage examples
3. Review Mongoose docs: https://mongoosejs.com/docs
4. Review NestJS Mongoose docs: https://docs.nestjs.com/techniques/mongodb

## Resources

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Vercel:** https://vercel.com/docs
- **Mongoose:** https://mongoosejs.com
- **NestJS:** https://docs.nestjs.com
