import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IpLoggerService {
  private readonly logPath: string;

  constructor() {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logPath = path.join(logsDir, 'ip-requests.log');
  }

  private hashIp(ip: string | undefined): string | null {
    if (!ip) return null;
    const salt = process.env.IP_SALT || 'default_salt_change_in_prod';
    return crypto
      .createHash('sha256')
      .update(ip + salt)
      .digest('hex');
  }

  async log(data: {
    ip?: string | null;
    storeRaw?: boolean;
    userAgent?: string;
    method?: string;
    path?: string;
  }) {
    const hashedIp = this.hashIp(data.ip || undefined);
    const entry = {
      hashedIp: hashedIp ?? null,
      rawIp: data.storeRaw ? (data.ip ?? null) : null,
      userAgent: data.userAgent ?? null,
      method: data.method ?? null,
      path: data.path ?? null,
      createdAt: new Date().toISOString(),
    };

    const line = JSON.stringify(entry) + '\n';
    await fs.promises.appendFile(this.logPath, line, 'utf8');
    return entry;
  }
}
