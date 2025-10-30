// File: src/upload/upload.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ProcessingService } from '../processing/processing.service';
import { DocumentService } from '../document/document.service';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResponse {
  docId: string;
  category: string;
  summary: string;
  highlights: string[];
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly processingService: ProcessingService,
    private readonly documentService: DocumentService,
  ) {}

  async processDocument(
    filePath: string,
    originalName: string,
    storedName: string,
    requestId: string,
  ): Promise<UploadResponse> {
    const docId = uuidv4();

    try {
      this.logger.log(
        `Processing document ${docId} - Request ID: ${requestId}`,
      );

      // Run the LangGraph processing pipeline
      const processingResult = await this.processingService.runPipeline({
        docId,
        filePath,
        originalName,
        storedName,
        requestId,
      });

      // Save document metadata
      await this.documentService.createDocument({
        docId,
        fileName: originalName,
        storedName,
        category: processingResult.category,
        pageCount: processingResult.pageCount,
        summary: processingResult.summary,
        highlights: processingResult.highlights,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.logger.log(`Document ready: ${docId} - Request ID: ${requestId}`);

      return {
        docId,
        category: processingResult.category,
        summary: processingResult.summary,
        highlights: processingResult.highlights,
      };
    } catch (error) {
      this.logger.error(
        `Processing failed for ${docId}: ${error.message} - Request ID: ${requestId}`,
      );

      // Save error state
      await this.documentService.setErrorState(docId, error.message);
      throw error;
    }
  }

  async processDocumentFromBuffer(
    fileBuffer: Buffer,
    originalName: string,
    storedName: string,
    requestId: string,
  ): Promise<UploadResponse> {
    const docId = uuidv4();

    try {
      this.logger.log(
        `Processing document from buffer ${docId} - Request ID: ${requestId}`,
      );

      // Run the LangGraph processing pipeline with buffer instead of file path
      const processingResult =
        await this.processingService.runPipelineFromBuffer({
          docId,
          fileBuffer,
          originalName,
          storedName,
          requestId,
        });

      // Save document metadata
      await this.documentService.createDocument({
        docId,
        fileName: originalName,
        storedName,
        category: processingResult.category,
        pageCount: processingResult.pageCount,
        summary: processingResult.summary,
        highlights: processingResult.highlights,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.logger.log(`Document ready: ${docId} - Request ID: ${requestId}`);

      return {
        docId,
        category: processingResult.category,
        summary: processingResult.summary,
        highlights: processingResult.highlights,
      };
    } catch (error) {
      this.logger.error(
        `Processing failed for ${docId}: ${error.message} - Request ID: ${requestId}`,
      );

      // Save error state
      await this.documentService.setErrorState(docId, error.message);
      throw error;
    }
  }
}
