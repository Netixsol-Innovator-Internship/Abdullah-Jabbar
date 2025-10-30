// main.ts

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Stripe requires the raw body to verify webhook signatures for the /webhooks/stripe route
  app.use('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  // Enable very permissive CORS (all origins). For credentials, dynamic origin reflection is used.
  // NOTE: This is wide open. For production, restrict origins via an env var list.
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow all origins (including undefined like mobile apps / curl)
      callback(null, true);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    exposedHeaders: 'Content-Disposition',
    maxAge: 86400,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log('CORS enabled for all origins (development mode).');
}
void bootstrap();