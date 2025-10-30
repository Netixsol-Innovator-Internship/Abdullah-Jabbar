import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve template static assets from /template
  const candidates = [
    join(__dirname, '..', 'templates'), // when running from src
    join(__dirname, '..', '..', 'templates'), // when running from dist
    join(process.cwd(), 'backend', 'templates'), // explicit project path
    join(process.cwd(), 'templates'),
  ];
  const templatesPath = candidates.find((p) => existsSync(p));
  if (templatesPath) {
    app.use('/template', express.static(templatesPath));
    console.log('Serving templates from', templatesPath);
  } else {
    console.warn('No templates folder found among candidates:', candidates);
  }

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.init();
  return app;
}

let app: NestExpressApplication | undefined;

// For local development
if (process.env.VERCEL !== '1') {
  bootstrap().then(async (app) => {
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

// For Vercel deployment
export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
