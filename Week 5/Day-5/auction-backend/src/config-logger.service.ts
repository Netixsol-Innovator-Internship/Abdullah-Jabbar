// src/config-logger.service.ts
// config-logger.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ConfigLoggerService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGO_URI');
    console.log('MONGO_URI from ConfigService:', mongoUri);
  }
}
