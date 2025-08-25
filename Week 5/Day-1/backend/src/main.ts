// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000); // Backend runs on port 4000
  console.log(`🚀 Server running on http://localhost:4000`);
}
bootstrap();
