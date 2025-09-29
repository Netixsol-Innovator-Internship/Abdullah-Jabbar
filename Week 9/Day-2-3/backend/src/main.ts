import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');

  // Enable CORS for frontend integration
  const frontendUrls = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : [];

  app.enableCors({
    origin: [
      ...frontendUrls,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  // Simple request/response logger to help debug all requests
  app.use((req, res, next) => {
    logger.log(
      `Incoming ${req.method} ${req.url} Content-Type: ${req.headers['content-type']} Auth: ${req.headers.authorization ? 'Present' : 'Missing'}`,
    );
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.log(
        `Response ${res.statusCode} for ${req.method} ${req.url} (${duration}ms)`,
      );
    });
    next();
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '10mb' }));
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 4000}`);
}

bootstrap();
