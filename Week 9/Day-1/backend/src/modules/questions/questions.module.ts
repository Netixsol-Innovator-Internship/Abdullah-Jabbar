import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionEntity, QuestionSchema } from './schemas/question.schema';
import { QuestionsService } from './questions.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: QuestionEntity.name, schema: QuestionSchema }])],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
