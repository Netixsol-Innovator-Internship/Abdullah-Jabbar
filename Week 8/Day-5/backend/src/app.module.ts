// File: src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentService } from './document/document.service';
import { DocumentChunkRepository } from './database/repositories/document-chunk.repository';
import { QueryRepository } from './database/repositories/query.repository';
import {
  Document,
  DocumentSchema,
  DocumentChunk,
  DocumentChunkSchema,
  Query,
  QuerySchema,
} from './database/schemas/document.schema';
import { UploadController } from './upload/upload.controller';
import { DocumentController } from './document/document.controller';
import { QaController } from './qa/qa.controller';
import { QaService } from './qa/qa.service';
import { UploadService } from './upload/upload.service';
import { ProcessingService } from './processing/processing.service';
import { ExtractNode } from './processing/nodes/extract.node';
import { EmbedNode } from './processing/nodes/embed.node';
import { StoreNode } from './processing/nodes/store.node';
import { ClassifyNode } from './processing/nodes/classify.node';
import { SummarizeNode } from './processing/nodes/summarize.node';
import { ReadyNode } from './processing/nodes/ready.node';
import { EmbeddingService } from './ai/embedding.service';
import { LLMService } from './ai/llm.service';

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/documents_db';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || mongoUri),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
      { name: Query.name, schema: QuerySchema },
    ]),
  ],
  controllers: [
    AppController,
    UploadController,
    DocumentController,
    QaController,
  ],
  providers: [
    AppService,
    // Mongoose-backed services / repositories
    DocumentService,
    DocumentChunkRepository,
    QueryRepository,
    // Upload / processing related providers
    UploadService,
    ProcessingService,
    ExtractNode,
    EmbedNode,
    StoreNode,
    ClassifyNode,
    SummarizeNode,
    ReadyNode,
    // AI integrations
    EmbeddingService,
    LLMService,
    // QA
    QaService,
  ],
})
export class AppModule {}
