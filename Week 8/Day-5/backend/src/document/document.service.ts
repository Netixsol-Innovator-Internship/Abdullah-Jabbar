// File: src/document/document.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document as DocumentEntity } from '../database/schemas/document.schema';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly documentModel: Model<DocumentEntity & any>,
  ) {}

  async createDocument(doc: Partial<DocumentEntity>): Promise<any> {
    this.logger.log(`Creating document record: ${doc.docId}`);
    const created = await this.documentModel.create(doc as any);
    return created.toObject ? created.toObject() : created;
  }

  async getDocument(docId: string): Promise<any | null> {
    this.logger.log(`Fetching document: ${docId}`);
    const doc = await this.documentModel.findOne({ docId }).lean();
    return doc || null;
  }

  async setErrorState(docId: string, errorMessage: string): Promise<void> {
    this.logger.log(`Setting error state for ${docId}: ${errorMessage}`);
    await this.documentModel.updateOne(
      { docId },
      { $set: { errorMessage, status: 'error', updatedAt: new Date() } },
    );
  }
}
