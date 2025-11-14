import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpLoggerService } from './ip-logger.service';
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ipaddr = require('ipaddr.js');

/**
 * Check if an IP address is private/reserved (not routable on public internet)
 * Returns true for: loopback, private ranges (10.x, 172.16-31.x, 192.168.x), link-local, etc.
 */
function isPrivateIp(ip: string): boolean {
  try {
    const addr = ipaddr.process(ip);
    const range = addr.range();

    // Private/reserved ranges
    return [
      'private',
      'loopback',
      'linkLocal',
      'uniqueLocal',
      'reserved',
      'carrierGradeNat',
    ].includes(range);
  } catch {
    // If we can't parse it, assume it's not safe to use
    return true;
  }
}

/**
 * Normalize an IP address to its canonical form:
 * - IPv4: standard dotted decimal
 * - IPv6: compressed canonical format (e.g., ::1 instead of 0000:0000:0000:0000:0000:0000:0000:0001)
 * - IPv4-mapped IPv6 (::ffff:192.0.2.1) converted to IPv4 (192.0.2.1)
 */
function normalizeIp(ip: string | null | undefined): string | null {
  if (!ip) return null;

  try {
    const addr = ipaddr.process(ip);

    // Convert IPv4-mapped IPv6 addresses to IPv4
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      return addr.toIPv4Address().toString();
    }

    // Return canonical form
    return addr.toString();
  } catch {
    // If parsing fails, return original (might be invalid, but we'll log it)
    return ip;
  }
}

/**
 * Extract client IP robustly:
 * - If app.set('trust proxy') is enabled, req.ip will be populated by Express.
 * - Otherwise check common headers in order: X-Forwarded-For, CF-Connecting-IP, X-Real-IP
 * - All IPs are normalized to canonical format
 * - For X-Forwarded-For, optionally skip private IPs based on FILTER_PRIVATE_IPS env var
 */
function extractIp(req: Request): string | null {
  // Express sets req.ip when trust proxy is enabled
  if (req.ip) return normalizeIp(req.ip);

  const filterPrivate = process.env.FILTER_PRIVATE_IPS !== 'false';

  // X-Forwarded-For may contain a list
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) {
    const ips = xff.split(',').map((ip) => ip.trim());

    if (filterPrivate) {
      // Find first public IP (skip private/internal ones)
      for (const ip of ips) {
        if (!isPrivateIp(ip)) {
          return normalizeIp(ip);
        }
      }
    }

    // Return the first IP (if filtering disabled or all are private)
    return normalizeIp(ips[0]);
  }

  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.length) return normalizeIp(cf);

  const xr = req.headers['x-real-ip'];
  if (typeof xr === 'string' && xr.length) return normalizeIp(xr);

  return normalizeIp(req.socket?.remoteAddress ?? null);
}

/**
 * Extract all IPs from request (for testing/debugging)
 * Returns an array of all IPs found in headers
 */
function extractAllIps(req: Request): string[] {
  const ips: string[] = [];

  if (req.ip) ips.push(normalizeIp(req.ip) || '');

  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) {
    const xffIps = xff
      .split(',')
      .map((ip) => normalizeIp(ip.trim()))
      .filter(Boolean);
    ips.push(...(xffIps as string[]));
  }

  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.length) ips.push(normalizeIp(cf) || '');

  const xr = req.headers['x-real-ip'];
  if (typeof xr === 'string' && xr.length) ips.push(normalizeIp(xr) || '');

  const remote = req.socket?.remoteAddress;
  if (remote) ips.push(normalizeIp(remote) || '');

  return [...new Set(ips.filter(Boolean))];
}

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: IpLoggerService) {}

  private logToFile(data: any) {
    const logsDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logsDir, 'ip-requests.log');

    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Append to log file
    fs.appendFileSync(logFile, JSON.stringify(data) + '\n');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const storeRaw = process.env.STORE_RAW_IP === 'true';
      const logToFile = process.env.LOG_TO_FILE === 'true';
      const ua = req.get('User-Agent') ?? undefined;
      const requestPath = req.originalUrl ?? req.url;

      if (logToFile) {
        // Local testing mode: log raw data to file
        const allIps = extractAllIps(req);
        const primaryIp = extractIp(req);

        const logData = {
          primaryIp,
          allIps: allIps.length > 1 ? allIps : undefined,
          userAgent: ua,
          method: req.method,
          path: requestPath,
          headers: {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'cf-connecting-ip': req.headers['cf-connecting-ip'],
            'x-real-ip': req.headers['x-real-ip'],
          },
          createdAt: new Date().toISOString(),
        };

        this.logToFile(logData);
      } else {
        // Production mode: log to MongoDB
        const ip = extractIp(req);

        // Determine which collection to log to based on path
        const logData = {
          ip,
          storeRaw,
          userAgent: ua,
          method: req.method,
          path: requestPath,
        };

        // Route to appropriate collection with retry logic
        const logWithRetry = async (logFn: Promise<any>, retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              await logFn;
              return; // Success
            } catch (error) {
              if (i === retries) {
                // Final attempt failed - log to console for debugging
                if (process.env.NODE_ENV !== 'production') {
                  console.error('Failed to log after retries:', error.message);
                }
              } else {
                // Wait before retry (exponential backoff)
                await new Promise((resolve) =>
                  setTimeout(resolve, 100 * (i + 1)),
                );
              }
            }
          }
        };

        if (requestPath === '/' && req.method === 'GET') {
          // Log GET / to main ip_logs collection
          logWithRetry(this.logger.log(logData));
        } else if (requestPath.match(/^\/products?\/\w+/i)) {
          // Log /product/:id or /products/:id to separate collection per product
          const match = requestPath.match(/^\/products?\/([\w-]+)/i);
          const productId = match ? match[1] : 'unknown';

          logWithRetry(
            this.logger.logProduct({
              productId,
              ...logData,
            }),
          );
        } else {
          // Log everything else to ip_other_logs
          logWithRetry(this.logger.logOther(logData));
        }
      }
    } finally {
      next();
    }
  }
}
