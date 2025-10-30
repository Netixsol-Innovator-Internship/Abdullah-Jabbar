// File: src/database/repositories/query.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query as QueryEntity } from '../../database/schemas/document.schema';

@Injectable()
export class QueryRepository {
  private readonly logger = new Logger(QueryRepository.name);

  constructor(
    @InjectModel(QueryEntity.name)
    private readonly queryModel: Model<QueryEntity & any>,
  ) {}

  async saveQuery(query: Partial<QueryEntity>): Promise<void> {
    this.logger.log('Saving query record');
    await this.queryModel.create(query as any);
  }

  async findAnswers(queryText: string): Promise<any[]> {
    // Simple text search on 'question' and 'answer' fields
    const regex = new RegExp(queryText, 'i');
    return this.queryModel
      .find({ $or: [{ question: regex }, { answer: regex }] })
      .lean()
      .exec();
  }

  async create(record: Partial<QueryEntity>): Promise<any> {
    this.logger.log('Query create called');
    const created = await this.queryModel.create(record as any);
    return created.toObject ? created.toObject() : created;
  }
}
