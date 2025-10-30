// src/vercel.ts
// Vercel Serverless Functions entrypoint for NestJS (Express adapter)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

// Reuse the Express server and initialized Nest app across invocations
const expressServer = express();
let isNestInitialized = false;

async function ensureNestApp() {
  if (!isNestInitialized) {
    const adapter = new ExpressAdapter(expressServer);
    const app = await NestFactory.create(AppModule, adapter);
    const configService = app.get(ConfigService);
    app.enableCors();
    // Apply any other global pipes/filters here if needed
    await app.init();
    isNestInitialized = true;
    // Optional: log environment for debugging (won't affect response)
    const env = configService.get('NODE_ENV') || 'production';
    // eslint-disable-next-line no-console
    console.log(`Nest app initialized for Vercel (env=${env})`);
  }
}

// Default export conforms to Vercel's Node.js function signature
export default async function handler(req: Request, res: Response) {
  await ensureNestApp();
  return (expressServer as any)(req, res);
}
