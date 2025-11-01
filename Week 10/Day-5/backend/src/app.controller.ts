import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const dbStatus = this.connection.readyState;
    const dbStatusText =
      ['disconnected', 'connected', 'connecting', 'disconnecting'][dbStatus] ||
      'unknown';

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusText,
        readyState: dbStatus,
        connected: dbStatus === 1,
      },
      services: {
        mongodb: !!process.env.MONGODB_URI,
        gemini: !!process.env.GEMINI_API_KEY,
      },
    };
  }
}
