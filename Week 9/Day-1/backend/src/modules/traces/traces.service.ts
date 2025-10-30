import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TraceEntity } from './schemas/trace.schema';

@Injectable()
export class TracesService {
  constructor(@InjectModel(TraceEntity.name) private tModel: Model<TraceEntity>) {}

  async create(questionId: string) {
    const t = new this.tModel({ questionId, steps: [] });
    return t.save();
  }

  async appendStep(traceId: string, step: any) {
    return this.tModel.findByIdAndUpdate(traceId, { $push: { steps: step } }, { new: true });
  }

  async findById(id: string) {
    return this.tModel.findById(id).lean();
  }
}
