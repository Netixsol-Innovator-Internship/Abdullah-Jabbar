// main.server.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Express } from 'express';

export async function createServer(): Promise<Express> {
  // Don't create express instance manually - let NestJS do it
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('');
  app.enableCors();

  await app.init();

  // Get the express instance that NestJS created
  const httpAdapter = app.getHttpAdapter();
  return httpAdapter.getInstance();
}
