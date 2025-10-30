import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';
import { EmbeddingService } from '../../ai/embedding.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmbedNode {
  private readonly logger = new Logger(EmbedNode.name);

  constructor(private readonly embeddingService: EmbeddingService) {}

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    try {
      if (!state.chunks || state.chunks.length === 0) {
        throw new Error('No chunks to embed');
      }

      this.logger.log(
        `Embedding started: ${state.docId}, ${state.chunks.length} chunks`,
      );

      const embeddings = await Promise.all(
        state.chunks.map(async (chunk) => {
          const chunkId = uuidv4();
          const embedding = await this.embeddingService.embedText(chunk.text);

          return {
            chunkId,
            text: chunk.text,
            embedding,
            pageStart: chunk.pageStart,
            pageEnd: chunk.pageEnd,
            tokenCount: chunk.tokenCount,
          };
        }),
      );

      this.logger.log(
        `Embeddings created: ${state.docId}, ${embeddings.length} embeddings`,
      );

      return {
        embeddings,
      };
    } catch (error) {
      this.logger.error(`Embedding failed: ${error.message}`);
      return {
        error: `Embedding failed: ${error.message}`,
      };
    }
  }
}
