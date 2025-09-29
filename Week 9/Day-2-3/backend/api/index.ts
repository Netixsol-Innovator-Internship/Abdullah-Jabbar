import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { json } from 'express';
import { Logger } from '@nestjs/common';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    const logger = new Logger('HTTP');

    // Enable CORS for production
    const frontendUrls = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
      : [];

    app.enableCors({
      origin: [
        ...frontendUrls,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        /\.vercel\.app$/,
        /\.netlify\.app$/,
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

    // Configure middleware
    app.use(json({ limit: '50mb' }));

    // Simple request logger
    app.use((req, res, next) => {
      if (req.url && req.url.startsWith('/upload')) {
        logger.log(
          `Incoming ${req.method} ${req.url} Content-Type: ${req.headers['content-type']}`,
        );
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          logger.log(
            `Response ${res.statusCode} for ${req.method} ${req.url} (${duration}ms)`,
          );
        });
      }
      next();
    });

    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await createApp();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
}
