import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return {
      message: 'OK',
      name: 'Backend API',
      version: '1.0',
      uptime: process.uptime(),
      docs: '/docs',
      endpoints: {
        ask: 'POST /ask',
        upload: 'POST /upload',
        trace: 'GET /trace/:id',
      },
      note: 'Set NEXT_PUBLIC_API_URL in the frontend to this deployment URL.',
    };
  }
}
