# Path-Based IP Tracking - Usage Guide

## Overview

The IP Logger now supports tracking IPs per path/resource, allowing you to see which IPs accessed specific endpoints like products, orders, or any other resource.

## Features

### 1. **Automatic Path Logging** (Optional)
When `ENABLE_PATH_LOGGING=true`, every request is logged to both:
- Main log: `logs/ip-requests.log` (all requests)
- Path-specific log: `logs/<sanitized-path>.log` (per-path tracking)

### 2. **Manual Path Logging**
Use `ipLogger.logByPath()` in your controllers to explicitly track specific actions:

```typescript
await this.ipLogger.logByPath({
  ip: req.ip,
  storeRaw: false,
  userAgent: req.get('User-Agent'),
  method: 'POST',
  path: `/products/${productId}/order`,
  resourceId: productId, // Optional: for filtering
});
```

### 3. **Query IP Logs**
Retrieve IPs that accessed specific paths:

```typescript
// Get all entries for a path
const entries = await this.ipLogger.getIpsByPath('/products/123');

// Get unique IPs for a path
const uniqueIps = await this.ipLogger.getUniqueIpsByPath('/products/123');
```

## Environment Variables

```env
# Enable automatic path-based logging (creates separate log files per path)
ENABLE_PATH_LOGGING=true

# Other existing variables
STORE_RAW_IP=false
IP_SALT=your_secret_salt
```

## Log File Structure

### Main Log
`logs/ip-requests.log` - Contains all requests

### Path-Specific Logs
Examples:
- `/products/123` → `logs/products_123.log`
- `/api/orders` → `logs/api_orders.log`
- `/users/profile` → `logs/users_profile.log`
- `/` → `logs/root.log`

## API Endpoints

### Query IP Logs

#### Get all IPs by path
```bash
GET /ip-logs/by-path?path=/products/123
```

Response:
```json
{
  "path": "/products/123",
  "totalRequests": 15,
  "entries": [
    {
      "hashedIp": "abc123...",
      "rawIp": null,
      "userAgent": "Mozilla/5.0...",
      "method": "GET",
      "resourceId": null,
      "createdAt": "2025-11-13T10:00:00.000Z"
    }
  ]
}
```

#### Get unique IPs by path
```bash
GET /ip-logs/unique-ips?path=/products/123
```

Response:
```json
{
  "path": "/products/123",
  "uniqueIpCount": 8,
  "hashedIps": ["abc123...", "def456..."]
}
```

#### Get product viewers (example)
```bash
GET /ip-logs/products/123
```

Response:
```json
{
  "productId": "123",
  "totalViews": 15,
  "uniqueVisitors": 8,
  "hashedIps": ["abc123...", "def456..."],
  "recentViews": [...]
}
```

## Use Cases

### 1. **Track Product Views**
See which IPs viewed a specific product:

```typescript
@Get('products/:id')
async getProduct(@Param('id') id: string) {
  // Middleware automatically logs to logs/products_{id}.log
  // if ENABLE_PATH_LOGGING=true
  
  const product = await this.productService.findOne(id);
  return product;
}
```

### 2. **Track Orders**
Explicitly log orders with resource ID:

```typescript
@Post('products/:id/order')
async orderProduct(@Param('id') productId: string, @Req() req: Request) {
  await this.ipLogger.logByPath({
    ip: req.ip,
    method: 'POST',
    path: `/products/${productId}/order`,
    resourceId: productId,
  });
  
  // Process order...
}
```

### 3. **Analytics Dashboard**
Get conversion rates and visitor stats:

```typescript
@Get('products/:id/stats')
async getStats(@Param('id') id: string) {
  const views = await this.ipLogger.getIpsByPath(`/products/${id}`);
  const orders = await this.ipLogger.getIpsByPath(`/products/${id}/order`);
  const uniqueViewers = await this.ipLogger.getUniqueIpsByPath(`/products/${id}`);
  
  return {
    totalViews: views.length,
    uniqueVisitors: uniqueViewers.length,
    orders: orders.length,
    conversionRate: ((orders.length / views.length) * 100).toFixed(2) + '%'
  };
}
```

### 4. **Fraud Detection**
Check if same IP ordered multiple times:

```typescript
const orders = await this.ipLogger.getIpsByPath('/products/123/order');
const ipCounts = orders.reduce((acc, entry) => {
  acc[entry.hashedIp] = (acc[entry.hashedIp] || 0) + 1;
  return acc;
}, {});

const suspiciousIps = Object.entries(ipCounts)
  .filter(([ip, count]) => count > 3)
  .map(([ip]) => ip);
```

## Example: Complete Product Tracking

```typescript
import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { IpLoggerService } from './ip-logger/ip-logger.service';

@Controller('products')
export class ProductController {
  constructor(private readonly ipLogger: IpLoggerService) {}

  // View product (auto-tracked if ENABLE_PATH_LOGGING=true)
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return { id, name: 'Product Name' };
  }

  // Order product (explicit tracking)
  @Post(':id/order')
  async orderProduct(@Param('id') id: string, @Req() req: Request) {
    await this.ipLogger.logByPath({
      ip: req.ip,
      path: `/products/${id}/order`,
      resourceId: id,
      method: 'POST',
    });
    
    return { success: true };
  }

  // Get product statistics
  @Get(':id/analytics')
  async getAnalytics(@Param('id') id: string) {
    const views = await this.ipLogger.getIpsByPath(`/products/${id}`);
    const orders = await this.ipLogger.getIpsByPath(`/products/${id}/order`);
    const uniqueViewers = await this.ipLogger.getUniqueIpsByPath(`/products/${id}`);
    const uniqueBuyers = await this.ipLogger.getUniqueIpsByPath(`/products/${id}/order`);
    
    return {
      views: { total: views.length, unique: uniqueViewers.length },
      orders: { total: orders.length, unique: uniqueBuyers.length },
    };
  }
}
```

## Testing

### 1. Enable path logging
```bash
# .env
ENABLE_PATH_LOGGING=true
```

### 2. Make requests to different paths
```bash
# View product
curl http://localhost:3000/products/123

# Order product
curl -X POST http://localhost:3000/products/123/order

# View another product
curl http://localhost:3000/products/456
```

### 3. Check log files
```bash
ls logs/
# Output:
# ip-requests.log       (all requests)
# products_123.log      (product 123 views)
# products_123_order.log (product 123 orders)
# products_456.log      (product 456 views)
```

### 4. Query IPs via API
```bash
# Get all IPs that viewed product 123
curl "http://localhost:3000/ip-logs/by-path?path=/products/123"

# Get unique IPs
curl "http://localhost:3000/ip-logs/unique-ips?path=/products/123"

# Get product stats
curl http://localhost:3000/ip-logs/products/123
```

## Best Practices

1. **Use path logging selectively**: Enable `ENABLE_PATH_LOGGING` only if you need it, or use explicit `logByPath()` calls for important actions only

2. **Include resource IDs**: When logging orders/actions, include `resourceId` for easier filtering

3. **Regular cleanup**: Path-specific logs can accumulate. Set up log rotation or periodic cleanup

4. **Privacy first**: Keep `STORE_RAW_IP=false` unless absolutely necessary

5. **Monitor disk space**: Many path-specific logs can consume significant storage

## Migration from Simple Logging

If you're already using the IP logger and want path-based tracking:

1. Keep existing setup (works as before)
2. Set `ENABLE_PATH_LOGGING=true` for automatic path logs
3. Or use `logByPath()` selectively in controllers
4. Query logs via new endpoints or service methods

No breaking changes - all existing functionality remains intact!
