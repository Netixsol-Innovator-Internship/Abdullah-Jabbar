import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswerEntity } from './schemas/answer.schema';

@Injectable()
export class AnswersService {
  constructor(@InjectModel(AnswerEntity.name) private aModel: Model<AnswerEntity>) {}

  async create(payload: { questionId: string; finalAnswer: string }) {
    const a = new this.aModel(payload);
    return a.save();
  }

  async findById(id: string) {
    return this.aModel.findById(id).lean();
  }
}
