// Load environment variables from .env early so services can read them
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { OUTPUT_DIR, UPLOAD_DIR } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // In production, specify allowed origins
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

  // Create required directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  // console.log(`Output directory: ${OUTPUT_DIR}`);
  // console.log(`Upload directory: ${UPLOAD_DIR}`);
}
bootstrap();
