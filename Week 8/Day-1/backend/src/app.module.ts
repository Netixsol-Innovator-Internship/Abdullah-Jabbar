import { Module } from '@nestjs/common';
import { CvModule } from './cv/cv.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}