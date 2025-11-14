import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import * as crypto from 'crypto';
import { IpLog } from './ip-log.entity';
import { IpResourceLog } from './ip-resource-log.entity';
import { IpOtherLog } from './ip-other-log.entity';

/**
 * IP Logger Service - MongoDB Implementation
 * Optimized for Vercel deployment with MongoDB Atlas
 */
@Injectable()
export class IpLoggerService {
  private productModels: Map<string, Model<any>> = new Map();
  private connectionReady: boolean = false;

  constructor(
    @InjectModel(IpLog.name) private ipLogModel: Model<IpLog>,
    @InjectModel(IpResourceLog.name)
    private ipResourceLogModel: Model<IpResourceLog>,
    @InjectModel(IpOtherLog.name)
    private ipOtherLogModel: Model<IpOtherLog>,
    @InjectConnection() private connection: Connection,
  ) {
    // Ensure connection is ready and warm it up
    void this.warmupConnection();
  }

  /**
   * Warm up MongoDB connection to prevent cold start delays
   * This runs once when service is instantiated
   */
  private async warmupConnection() {
    try {
      // Check if connection is already ready (readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (this.connection.readyState === 1) {
        this.connectionReady = true;
        return;
      }

      // Wait for connection to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 5000);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (this.connection.readyState === 1) {
          clearTimeout(timeout);
          this.connectionReady = true;
          resolve();
        } else {
          this.connection.once('connected', () => {
            clearTimeout(timeout);
            this.connectionReady = true;
            resolve();
          });
          this.connection.once('error', (err: Error) => {
            clearTimeout(timeout);
            reject(err);
          });
        }
      });

      // Perform a lightweight operation to fully warm up the connection
      await this.ipLogModel.countDocuments().limit(1).exec();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('MongoDB warmup failed:', message);
      // Don't throw - allow app to continue, connection will be retried on first log
    }
  }

  /**
   * Ensure connection is ready before performing operations
   */
  private async ensureConnection() {
    if (!this.connectionReady) {
      await this.warmupConnection();
    }
  }

  private hashIp(ip: string | undefined): string | null {
    if (!ip) return null;
    const salt = process.env.IP_SALT || 'default_salt_change_in_prod';
    return crypto
      .createHash('sha256')
      .update(ip + salt)
      .digest('hex');
  }

  /**
   * Log to main IP logs collection (for / path only)
   */
  async log(data: {
    ip?: string | null;
    storeRaw?: boolean;
    userAgent?: string;
    method?: string;
    path?: string;
  }) {
    await this.ensureConnection();

    const hashedIp = this.hashIp(data.ip || undefined);

    const logEntry = new this.ipLogModel({
      hashedIp,
      rawIp: data.storeRaw ? data.ip : undefined,
      userAgent: data.userAgent,
      method: data.method,
      path: data.path,
    });

    await logEntry.save();
    return logEntry.toObject();
  }

  /**
   * Log to 'other' collection for miscellaneous requests
   */
  async logOther(data: {
    ip?: string | null;
    storeRaw?: boolean;
    userAgent?: string;
    method?: string;
    path?: string;
  }) {
    await this.ensureConnection();

    const hashedIp = this.hashIp(data.ip || undefined);

    const logEntry = new this.ipOtherLogModel({
      hashedIp,
      rawIp: data.storeRaw ? data.ip : undefined,
      userAgent: data.userAgent,
      method: data.method,
      path: data.path,
    });

    await logEntry.save();
    return logEntry.toObject();
  }

  /**
   * Log to product-specific collection (e.g., ip_product_123, ip_product_456)
   * Each product gets its own MongoDB collection
   */
  async logProduct(data: {
    productId: string;
    ip?: string | null;
    storeRaw?: boolean;
    userAgent?: string;
    method?: string;
    path?: string;
  }) {
    await this.ensureConnection();

    const hashedIp = this.hashIp(data.ip || undefined);
    const collectionName = `ip_product_${data.productId}`;

    // Get or create model for this product
    let model = this.productModels.get(collectionName);
    if (!model) {
      // Create schema dynamically using the IpLog schema structure
      const schema = new this.connection.base.Schema(
        {
          hashedIp: { type: String, required: true, index: true },
          rawIp: String,
          userAgent: String,
          method: { type: String, index: true },
          path: { type: String, required: true, index: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        },
        { timestamps: true },
      );

      model = this.connection.model(collectionName, schema, collectionName);
      this.productModels.set(collectionName, model);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const logEntry = new model({
      hashedIp,
      rawIp: data.storeRaw ? data.ip : undefined,
      userAgent: data.userAgent,
      method: data.method,
      path: data.path,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await logEntry.save();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return logEntry.toObject();
  }

  /**
   * Log to resource-specific collection for tracking IPs per product/order/etc
   * Example: logByResource({ ip: '1.2.3.4', resourceType: 'product', resourceId: '123', action: 'view' })
   */
  async logByResource(data: {
    ip?: string | null;
    storeRaw?: boolean;
    resourceType: string; // 'product', 'order', 'article', etc.
    resourceId: string; // '123', 'abc-def', etc.
    action?: string; // 'view', 'order', 'download', etc.
    userAgent?: string;
    method?: string;
    path?: string;
    metadata?: Record<string, any>;
  }) {
    await this.ensureConnection();

    const hashedIp = this.hashIp(data.ip || undefined);

    const resourceLog = new this.ipResourceLogModel({
      hashedIp,
      rawIp: data.storeRaw ? data.ip : undefined,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      action: data.action,
      userAgent: data.userAgent,
      method: data.method,
      path: data.path,
      metadata: data.metadata,
    });

    await resourceLog.save();
    return resourceLog.toObject();
  }

  /**
   * Get all IPs that accessed a specific path
   */
  async getIpsByPath(path: string): Promise<IpLog[]> {
    return this.ipLogModel.find({ path }).sort({ createdAt: -1 }).lean().exec();
  }

  /**
   * Get unique IPs that accessed a specific path
   */
  async getUniqueIpsByPath(path: string): Promise<string[]> {
    const results = await this.ipLogModel
      .find({ path })
      .distinct('hashedIp')
      .exec();
    return results.filter(Boolean);
  }

  /**
   * Get all IPs for a specific resource (e.g., product 123)
   */
  async getIpsByResource(
    resourceType: string,
    resourceId: string,
  ): Promise<IpResourceLog[]> {
    return this.ipResourceLogModel
      .find({ resourceType, resourceId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Get unique IPs for a specific resource
   */
  async getUniqueIpsByResource(
    resourceType: string,
    resourceId: string,
  ): Promise<string[]> {
    const results = await this.ipResourceLogModel
      .find({ resourceType, resourceId })
      .distinct('hashedIp')
      .exec();
    return results.filter(Boolean);
  }

  /**
   * Get IPs by resource and action (e.g., product 123 orders)
   */
  async getIpsByResourceAction(
    resourceType: string,
    resourceId: string,
    action: string,
  ): Promise<IpResourceLog[]> {
    return this.ipResourceLogModel
      .find({ resourceType, resourceId, action })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Get statistics for a resource
   */
  async getResourceStats(resourceType: string, resourceId: string) {
    const views = await this.ipResourceLogModel
      .countDocuments({ resourceType, resourceId, action: 'view' })
      .exec();

    const orders = await this.ipResourceLogModel
      .countDocuments({ resourceType, resourceId, action: 'order' })
      .exec();

    const uniqueViewers = await this.getUniqueIpsByResource(
      resourceType,
      resourceId,
    );

    const uniqueBuyers = (
      await this.ipResourceLogModel
        .find({ resourceType, resourceId, action: 'order' })
        .distinct('hashedIp')
        .exec()
    ).filter(Boolean);

    return {
      views: {
        total: views,
        unique: uniqueViewers.length,
      },
      orders: {
        total: orders,
        unique: uniqueBuyers.length,
      },
      conversionRate:
        views > 0 ? ((orders / views) * 100).toFixed(2) + '%' : '0%',
    };
  }

  /**
   * Get recent logs (for debugging/monitoring)
   */
  async getRecentLogs(limit = 100): Promise<IpLog[]> {
    return this.ipLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  /**
   * Get recent resource logs
   */
  async getRecentResourceLogs(limit = 100): Promise<IpResourceLog[]> {
    return this.ipResourceLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}
