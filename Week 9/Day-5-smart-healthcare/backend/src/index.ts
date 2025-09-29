import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    // Enable CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || true,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global prefix
    app.setGlobalPrefix('api');

    await app.init();

    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(req, res);
}
