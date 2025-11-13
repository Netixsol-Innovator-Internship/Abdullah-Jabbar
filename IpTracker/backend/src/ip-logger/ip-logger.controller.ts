import { Controller, Get, Param, Query } from '@nestjs/common';
import { IpLoggerService } from './ip-logger.service';

@Controller('ip-logs')
export class IpLoggerController {
  constructor(private readonly ipLogger: IpLoggerService) {}

  /**
   * Get all IPs that accessed a specific path
   * Example: GET /ip-logs/by-path?path=/products/123
   */
  @Get('by-path')
  async getIpsByPath(@Query('path') path: string) {
    if (!path) {
      return { error: 'path query parameter is required' };
    }

    const entries = await this.ipLogger.getIpsByPath(path);
    return {
      path,
      totalRequests: entries.length,
      entries,
    };
  }

  /**
   * Get unique IPs that accessed a specific path
   * Example: GET /ip-logs/unique-ips?path=/products/123
   */
  @Get('unique-ips')
  async getUniqueIpsByPath(@Query('path') path: string) {
    if (!path) {
      return { error: 'path query parameter is required' };
    }

    const uniqueIps = await this.ipLogger.getUniqueIpsByPath(path);
    return {
      path,
      uniqueIpCount: uniqueIps.length,
      hashedIps: uniqueIps,
    };
  }

  /**
   * Get IPs by resource (e.g., product ID)
   * Example: GET /ip-logs/products/123
   */
  @Get('products/:id')
  async getProductViewers(@Param('id') productId: string) {
    const entries = await this.ipLogger.getIpsByResource('product', productId);
    const uniqueIps = await this.ipLogger.getUniqueIpsByResource(
      'product',
      productId,
    );

    return {
      productId,
      totalViews: entries.length,
      uniqueVisitors: uniqueIps.length,
      hashedIps: uniqueIps,
      recentViews: entries.slice(0, 10), // First 10 views
    };
  }

  /**
   * Get resource statistics
   * Example: GET /ip-logs/resources/product/123/stats
   */
  @Get('resources/:type/:id/stats')
  async getResourceStats(
    @Param('type') resourceType: string,
    @Param('id') resourceId: string,
  ) {
    const stats = await this.ipLogger.getResourceStats(
      resourceType,
      resourceId,
    );
    return {
      resourceType,
      resourceId,
      ...stats,
    };
  }
}
