import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

let app: NestExpressApplication;
let appPromise: Promise<NestExpressApplication>;

async function createNestApp() {
  if (app) return app;
  if (!appPromise) {
    appPromise = (async () => {
      console.log('Bootstrapping Nest app...');

      const nestApp = await NestFactory.create<NestExpressApplication>(
        AppModule,
        {
          logger: ['error', 'warn'], // keep logs
        },
      );

      // Serve template static assets
      const candidates = [
        join(__dirname, '..', 'templates'),
        join(__dirname, '..', '..', 'templates'),
        join(process.cwd(), 'templates'),
      ];
      const templatesPath = candidates.find((p) => existsSync(p));
      console.log('Resolved templatesPath:', templatesPath);

      if (templatesPath) {
        nestApp.use('/template', express.static(templatesPath));
      } else {
        console.warn('⚠️ No templates folder found in any candidate path');
      }

      nestApp.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      });

      await nestApp.init();
      app = nestApp;
      return nestApp;
    })().catch((err) => {
      console.error('Nest app failed to init:', err);
      throw err;
    });
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await createNestApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}
