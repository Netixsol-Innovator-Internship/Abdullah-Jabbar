// File: src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { json } from 'express';

const logger = new Logger('Bootstrap');

// Disable mongoose debug to avoid verbose 'Mongoose: ...' logs in console
mongoose.set('debug', false);

// Log redacted host information to help diagnose connection issues without printing credentials
const usedMongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/documents_db';
let mongoHost = usedMongoUri;
const atIdx = usedMongoUri.indexOf('@');
if (atIdx !== -1) {
  mongoHost = usedMongoUri.slice(atIdx + 1);
}
mongoHost = mongoHost.split('/')[0];
logger.log(`Attempting MongoDB connection to host: ${mongoHost}`);

// Log a clean success message when mongoose opens a connection
mongoose.connection.once('open', () => {
  logger.log('Mongo DB Connection Successful');
});

// Log concise errors from mongoose connection
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err?.message ?? err}`);
});

async function bootstrap() {
  const port = process.env.PORT ?? 3001;

  const app = await NestFactory.create(AppModule);

  // Configure global limit for the application
  app.use(json({ limit: '30mb' }));

  // Enable CORS so the frontend can make requests (including preflight OPTIONS).
  // FRONTEND_ORIGIN env var can override the default during development.
  const frontendOrigin = process.env.FRONTEND_ORIGIN || '*';
  app.enableCors({
    origin: frontendOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
  });

  // initialize the app so Nest's own logs (startup) appear before our DB message
  await app.init();

  // Do not block server startup waiting for mongoose. Mongoose will connect
  // asynchronously via MongooseModule.forRoot in AppModule. If the DB is
  // unreachable, mongoose will log errors but the HTTP server will still start
  // so you can hit health endpoints or surface errors to the client.

  // Retrieve the Nest-managed mongoose connection and log success when ready.
  try {
    const conn = app.get<Connection>(getConnectionToken());
    // poll the connection for a short period (non-blocking for app startup)
    const start = Date.now();
    const timeoutMs = 10000;
    const poll = async (): Promise<void> => {
      // readyState === 1 means connected
      if ((conn as any).readyState === 1) {
        logger.log(
          'Mongo DB Connection Successful (verified via Nest connection)',
        );
        return;
      }
      if (Date.now() - start > timeoutMs) {
        logger.error(
          'Mongo DB did not become ready within 10s (checked Nest connection)',
        );
        return;
      }
      // schedule next poll without blocking server start
      setTimeout(poll, 250);
    };

    void poll();
  } catch (e) {
    logger.error('Could not retrieve Nest mongoose connection token');
  }

  await app.listen(port);

  // Print the exact server URL message requested
  const hostUrl = `http://localhost:${port}`;
  console.log(`Server running at ${hostUrl}`);
}

bootstrap();
