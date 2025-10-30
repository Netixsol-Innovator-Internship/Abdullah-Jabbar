import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('api')
  getApiInfo() {
    return {
      message: 'CV Generator API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        preview: '/api/cv/preview',
        generate: '/api/cv/generate',
      },
    };
  }
}
