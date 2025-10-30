import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';
import { DocumentChunkRepository } from '../../database/repositories/document-chunk.repository';

@Injectable()
export class StoreNode {
  private readonly logger = new Logger(StoreNode.name);

  constructor(private readonly chunkRepository: DocumentChunkRepository) {}

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    try {
      if (!state.embeddings || state.embeddings.length === 0) {
        throw new Error('No embeddings to store');
      }

      this.logger.log(
        `Storage started: ${state.docId}, ${state.embeddings.length} chunks`,
      );

      // Store chunks with embeddings in MongoDB
      const chunkDocuments = state.embeddings.map((embedding) => ({
        docId: state.docId,
        chunkId: embedding.chunkId,
        text: embedding.text,
        embedding: embedding.embedding,
        pageStart: embedding.pageStart,
        pageEnd: embedding.pageEnd,
        tokenCount: embedding.tokenCount,
      }));

      await this.chunkRepository.insertMany(chunkDocuments);

      this.logger.log(`Storage complete: ${state.docId}`);

      return {}; // No state changes, just storage
    } catch (error) {
      this.logger.error(`Storage failed: ${error.message}`);
      return {
        error: `Storage failed: ${error.message}`,
      };
    }
  }
}
