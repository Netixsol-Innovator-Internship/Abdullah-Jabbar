// main.server.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Express } from 'express';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

export async function createServer(): Promise<Express> {
  try {
    console.log('🚀 Creating NestJS application...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

    // Don't create express instance manually - let NestJS do it
    const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
      logger: ['error', 'warn', 'log'],
      abortOnError: false, // Don't abort on connection errors
    });

    // Enable CORS
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const messages = errors.map(
            (error) =>
              `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
          );
          return new BadRequestException(messages);
        },
      }),
    );

    app.setGlobalPrefix('');

    await app.init();

    console.log('✅ NestJS application initialized successfully');

    // Get the express instance that NestJS created
    const httpAdapter = app.getHttpAdapter();
    return httpAdapter.getInstance();
  } catch (error) {
    console.error('❌ Failed to create server:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
