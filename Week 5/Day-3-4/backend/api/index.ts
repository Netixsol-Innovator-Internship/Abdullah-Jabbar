import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

// Single express instance reused across invocations to speed cold starts
const server = express();
let initialized = false;

async function init() {
  if (initialized) return;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['https://abdullah-week4-day5-tea-app-fronten.vercel.app/'];

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  server.use(cookieParser());
  server.use(json({ limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // initialize Nest (does not start listening on a port)
  await app.init();
  initialized = true;
}

export default async function handler(req: any, res: any) {
  try {
    await init();
    // Let the underlying express instance handle the request
    server(req, res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Vercel handler error', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
