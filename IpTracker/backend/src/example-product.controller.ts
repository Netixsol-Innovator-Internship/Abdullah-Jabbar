import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { IpLoggerService } from './ip-logger/ip-logger.service';

/**
 * Example Product Controller demonstrating path-based IP tracking
 * This shows how to track which IPs viewed or ordered specific products
 */
@Controller('products')
export class ProductController {
  constructor(private readonly ipLogger: IpLoggerService) {}

  /**
   * View a product - tracks IP to product-specific log
   * Example: GET /products/123
   * Creates: logs/products_123.log
   */
  @Get(':id')
  async getProduct(@Param('id') id: string, @Req() req: Request) {
    // Your business logic to fetch product
    const product = { id, name: 'Sample Product', price: 99.99 };

    // Track IP for this specific product (if path logging enabled)
    // This happens automatically via middleware when ENABLE_PATH_LOGGING=true

    return product;
  }

  /**
   * Order a product - explicitly track order with resource ID
   * Example: POST /products/123/order
   * Stores in MongoDB: ip_resource_logs collection
   */
  @Post(':id/order')
  async orderProduct(@Param('id') productId: string, @Req() req: Request) {
    // Extract IP from request (same logic as middleware)
    const ip = req.ip || req.socket?.remoteAddress || null;
    const storeRaw = process.env.STORE_RAW_IP === 'true';

    // Explicitly log this order with MongoDB resource tracking
    await this.ipLogger.logByResource({
      ip,
      storeRaw,
      resourceType: 'product',
      resourceId: productId,
      action: 'order',
      userAgent: req.get('User-Agent'),
      method: 'POST',
      path: `/products/${productId}/order`,
      metadata: {
        orderId: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });

    // Your order processing logic
    return {
      success: true,
      orderId: `ORD-${Date.now()}`,
      productId,
      message: 'Order placed successfully',
    };
  }

  /**
   * Get statistics for a specific product
   * Example: GET /products/123/stats
   */
  @Get(':id/stats')
  async getProductStats(@Param('id') productId: string) {
    const viewPath = `/products/${productId}`;
    const orderPath = `/products/${productId}/order`;

    const views = await this.ipLogger.getIpsByPath(viewPath);
    const orders = await this.ipLogger.getIpsByPath(orderPath);

    const uniqueViewers = await this.ipLogger.getUniqueIpsByPath(viewPath);
    const uniqueBuyers = await this.ipLogger.getUniqueIpsByPath(orderPath);

    return {
      productId,
      views: {
        total: views.length,
        unique: uniqueViewers.length,
      },
      orders: {
        total: orders.length,
        unique: uniqueBuyers.length,
      },
      conversionRate:
        views.length > 0
          ? ((orders.length / views.length) * 100).toFixed(2) + '%'
          : '0%',
    };
  }
}
