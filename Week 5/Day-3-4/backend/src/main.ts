import express, { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Configure CORS to allow tea-app-frontend and deployed frontend
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173']; // Default to tea-app-frontend

  app.enableCors({
    // allow all origins (use `true` so browsers can send credentials)
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  return app;
}

// If this file is run directly (node dist/main.js or `nest start`), start the HTTP server
if (require && require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  (async () => {
    const app = await bootstrap();
    await app.listen(port);
    // Nest will log its own startup messages; add a simple console.log for clarity
    // when running via node directly.
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
  })();
}

export default bootstrap;
