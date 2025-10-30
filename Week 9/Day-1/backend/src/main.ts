// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  const port = configService.get('PORT') || 4000;
  await app.listen(port);
  console.log(`Server listening on ${port}`);
}
bootstrap();
