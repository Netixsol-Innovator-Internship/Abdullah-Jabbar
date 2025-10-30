import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc } from './schemas/document.schema';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Doc.name) private docModel: Model<Doc>) {}

  async create(payload: { title: string; topic?: string; content: string }) {
    const doc = new this.docModel(payload);
    return doc.save();
  }

  async findText(query: string, limit = 10) {
    return this.docModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();
  }

  async findByIds(ids: string[]) {
    return this.docModel.find({ _id: { $in: ids } }).lean();
  }

  async listAll(limit = 50) {
    return this.docModel.find().limit(limit).lean();
  }
}
