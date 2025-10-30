import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({ collection: 'documents' })
export class Document {
  @Prop({ required: true, unique: true, index: true })
  docId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  storedName: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  pageCount: number;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  highlights: string[];

  @Prop({ default: null })
  errorMessage?: string;

  @Prop({ default: 'ready' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

// DocumentChunk Schema
@Schema({ collection: 'document_chunks' })
export class DocumentChunk {
  @Prop({ required: true, index: true })
  docId: string;

  @Prop({ required: true, unique: true })
  chunkId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: [Number], required: true })
  embedding: number[];

  @Prop({ required: true })
  pageStart: number;

  @Prop({ required: true })
  pageEnd: number;

  @Prop({ required: true })
  tokenCount: number;
}

export const DocumentChunkSchema = SchemaFactory.createForClass(DocumentChunk);

// Create index for vector similarity search
DocumentChunkSchema.index({ docId: 1, embedding: 1 });

// Query Schema
@Schema({ collection: 'queries' })
export class Query {
  @Prop({ required: true, index: true })
  docId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ type: Array, default: [] })
  sources: Array<{
    pageNumbers: number[];
    snippet?: string;
  }>;

  @Prop()
  userId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuerySchema = SchemaFactory.createForClass(Query);
