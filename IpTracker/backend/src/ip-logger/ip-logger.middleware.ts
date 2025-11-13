import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpLoggerService } from './ip-logger.service';
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
 * - For X-Forwarded-For, skip private IPs and return first public IP
 */
function extractIp(req: Request): string | null {
  // Express sets req.ip when trust proxy is enabled
  if (req.ip) return normalizeIp(req.ip);

  // X-Forwarded-For may contain a list, find first public IP (skip private/internal ones)
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) {
    const ips = xff.split(',').map((ip) => ip.trim());
    for (const ip of ips) {
      if (!isPrivateIp(ip)) {
        return normalizeIp(ip);
      }
    }
    // If all are private, return the first one anyway
    return normalizeIp(ips[0]);
  }

  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.length) return normalizeIp(cf);

  const xr = req.headers['x-real-ip'];
  if (typeof xr === 'string' && xr.length) return normalizeIp(xr);

  return normalizeIp(req.socket?.remoteAddress ?? null);
}

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: IpLoggerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = extractIp(req);
      const ua = req.get('User-Agent') ?? undefined;
      // Decide whether you want to persist raw IPs — default: false
      const storeRaw = process.env.STORE_RAW_IP === 'true';

      // Fire and forget: don't block request on DB write
      this.logger
        .log({
          ip,
          storeRaw,
          userAgent: ua,
          method: req.method,
          path: req.originalUrl ?? req.url,
        })
        .catch(() => {
          // optionally log DB error somewhere; avoid throwing
          // console.error('ip log failed');
        });
    } finally {
      next();
    }
  }
}
