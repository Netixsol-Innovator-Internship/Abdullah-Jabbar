import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionEntity } from './schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(QuestionEntity.name) private qModel: Model<QuestionEntity>) {}

  async create(payload: { question: string; mode: 'code' | 'llm' }) {
    const q = new this.qModel(payload);
    return q.save();
  }

  async updateAnswer(questionId: string, answerId: string) {
    return this.qModel.findByIdAndUpdate(questionId, { answerId }, { new: true });
  }
}
