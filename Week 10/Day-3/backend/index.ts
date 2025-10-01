import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    // Enable CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://abdullah-week9-day5-frontend.vercel.app', // Your frontend domain
        'https://abdullah-week10-day2.vercel.app', // Alternative frontend domain
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global prefix for API routes
    app.setGlobalPrefix('api');

    await app.init();

    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(req, res);
}
