import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerEntity, AnswerSchema } from './schemas/answer.schema';
import { AnswersService } from './answers.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AnswerEntity.name, schema: AnswerSchema }])],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
