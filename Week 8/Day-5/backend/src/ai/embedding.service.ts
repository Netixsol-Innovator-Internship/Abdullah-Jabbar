// File: src/ai/embedding.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  async embedText(text: string): Promise<number[]> {
    // Minimal stub: return a small deterministic vector (not useful for real similarity)
    this.logger.log('Stub embedText called');
    return text.split('').map((c) => (c.charCodeAt(0) % 100) / 100);
  }

  async embedDocuments(docs: string[]): Promise<number[][]> {
    return Promise.all(docs.map((d) => this.embedText(d)));
  }
}
