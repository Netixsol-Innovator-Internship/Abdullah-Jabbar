import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document as MongooseDocument } from 'mongoose';
import { DocumentChunk } from '../schemas/document.schema';

type DocumentChunkDoc = DocumentChunk & MongooseDocument;

@Injectable()
export class DocumentChunkRepository {
  private readonly logger = new Logger(DocumentChunkRepository.name);

  constructor(
    @InjectModel('DocumentChunk') private model: Model<DocumentChunkDoc>,
  ) {}

  async insertMany(docs: Partial<DocumentChunk>[]): Promise<void> {
    if (!docs || docs.length === 0) return;
    try {
      await this.model.insertMany(docs, { ordered: false });
      this.logger.log(`Inserted ${docs.length} document chunks`);
    } catch (err) {
      this.logger.error(`insertMany error: ${err?.message ?? err}`);
    }
  }

  /**
   * Find the most similar chunks for a given document by computing cosine similarity in memory.
   * Note: For production use a vector DB or MongoDB-supported vector search instead of in-memory scoring.
   */
  async findSimilarChunks(
    docId: string,
    embedding: number[],
    topK = 5,
  ): Promise<Array<Partial<DocumentChunk> & { similarity: number }>> {
    const chunks = await this.model.find({ docId }).lean().exec();

    if (!chunks || chunks.length === 0) return [];

    const scores = (chunks as any[]).map((c) => ({
      ...c,
      similarity: cosineSimilarity(embedding, c.embedding || []),
    }));

    scores.sort((a, b) => b.similarity - a.similarity);

    return scores.slice(0, topK);
  }

  // Backward-compatible alias
  async findSimilar(
    docId: string,
    embedding: number[],
    topK = 5,
  ): Promise<Array<Partial<DocumentChunk> & { similarity: number }>> {
    return this.findSimilarChunks(docId, embedding, topK);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ai = a[i] || 0;
    const bi = b[i] || 0;
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
