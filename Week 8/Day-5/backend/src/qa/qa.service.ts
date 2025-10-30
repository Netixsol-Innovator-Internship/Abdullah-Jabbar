import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DocumentChunkRepository } from '../database/repositories/document-chunk.repository';
import { QueryRepository } from '../database/repositories/query.repository';
import { EmbeddingService } from '../ai/embedding.service';
import { LLMService } from '../ai/llm.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { v4 as uuidv4 } from 'uuid';

export interface QueryRequest {
  docId: string;
  question: string;
}

export interface QueryResponse {
  answer: string;
  sources: Array<{
    pageNumbers: number[];
    snippet?: string;
  }>;
}

@Injectable()
export class QaService {
  private readonly logger = new Logger(QaService.name);
  private readonly topK = parseInt(process.env.TOP_K || '8');
  private readonly relevanceThreshold = parseFloat(
    process.env.RELEVANCE_THRESHOLD || '0.65',
  );
  private readonly noAnswerMessage =
    'The document does not provide sufficient information to answer that question.';

  constructor(
    private readonly chunkRepository: DocumentChunkRepository,
    private readonly queryRepository: QueryRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly llmService: LLMService,
  ) {}

  /**
   * Normalize the question text by:
   * - Lowercasing
   * - Trimming whitespace
   * - Removing filler phrases (e.g., "can you tell me", "please", "hey")
   * - Stripping punctuation/symbols
   */
  private normalizeQuestion(raw: string): string {
    let q = raw.toLowerCase().trim();

    // Remove common prefixes and polite fillers
    const fillers = [
      /^hey[, ]*/i,
      /^hi[, ]*/i,
      /^hello[, ]*/i,
      /^please[, ]*/i,
      /^plz[, ]*/i,
      /^can you[, ]*/i,
      /^could you[, ]*/i,
      /^would you[, ]*/i,
      /^kindly[, ]*/i,
      /^tell me[, ]*/i,
      /^i want to know[, ]*/i,
      /^i would like to know[, ]*/i,
      /^what's[, ]*/i,
    ];
    fillers.forEach((re) => {
      q = q.replace(re, '');
    });

    // Remove trailing polite words
    q = q.replace(/( please| thanks| thank you| kindly| plz)[.!?]*$/i, '');

    // Strip most punctuation/symbols (keep ? as it may hold meaning)
    q = q.replace(/[!.,;:()"'`]/g, '');

    // Normalize multiple spaces
    q = q.replace(/\s+/g, ' ').trim();

    return q;
  }

  async answerQuery(request: QueryRequest): Promise<QueryResponse> {
    const queryId = uuidv4();

    try {
      // Validate question length
      if (request.question.length > 1000) {
        throw new BadRequestException(
          'Question exceeds maximum length of 1000 characters',
        );
      }

      this.logger.log(
        `Query started: ${queryId} for document ${request.docId}`,
      );

      // Normalize question
      const normalizedQuestion = this.normalizeQuestion(request.question);

      // Generate embedding for normalized question
      const questionEmbedding =
        await this.embeddingService.embedText(normalizedQuestion);

      // Retrieve top-k chunks via similarity search
      const retrievedChunks = await this.chunkRepository.findSimilarChunks(
        request.docId,
        questionEmbedding,
        this.topK,
      );

      // Check relevance threshold
      const relevantChunks = retrievedChunks.filter(
        (chunk) => chunk.similarity >= this.relevanceThreshold,
      );

      if (relevantChunks.length === 0) {
        this.logger.log(`No relevant chunks found for query: ${queryId}`);

        await this.queryRepository.create({
          docId: request.docId,
          question: request.question,
          answer: this.noAnswerMessage,
          sources: [],
          createdAt: new Date(),
        });

        return {
          answer: this.noAnswerMessage,
          sources: [],
        };
      }

      // Build context from relevant chunks
      const context = relevantChunks
        .map((chunk) => {
          const start = chunk.pageStart ?? 1;
          const end = chunk.pageEnd ?? start;
          return `[Pages ${start}-${end}]: ${chunk.text}`;
        })
        .join('\n\n');

      // Create RAG prompt
      const promptTemplate = PromptTemplate.fromTemplate(`
        You are a document Q&A assistant. Answer the question based ONLY on the provided context.
        
        RULES:
        1. Use ONLY information from the provided context
        2. Use semantic understanding (e.g., "plagiarism" ↔ "similarity index", "first step" ↔ "STEP 1")
        3. If the context doesn't contain the answer, respond with exactly: "${this.noAnswerMessage}"
        4. Be concise and direct in your answer
        5. Cite page numbers when referencing specific information
        
        Context:
        {context}
        
        Question: {question}
        
        Answer:
      `);

      // Fill the prompt
      const prompt = await promptTemplate.format({
        context,
        question: normalizedQuestion,
      });

      // Get the answer from the LLM
      const answer = await this.llmService.generateText(prompt);

      // Log the query with answer
      await this.queryRepository.create({
        docId: request.docId,
        question: request.question,
        answer,
        sources: relevantChunks.map((chunk) => {
          const start = chunk.pageStart ?? 1;
          const end = chunk.pageEnd ?? start;
          return {
            pageNumbers: Array.from(
              { length: end - start + 1 },
              (_, i) => start + i,
            ),
            snippet: chunk.text,
          };
        }),
        createdAt: new Date(),
      });

      // Return the response
      return {
        answer,
        sources: relevantChunks.map((chunk) => {
          const start = chunk.pageStart ?? 1;
          const end = chunk.pageEnd ?? start;
          return {
            pageNumbers: Array.from(
              { length: end - start + 1 },
              (_, i) => start + i,
            ),
            snippet: chunk.text,
          };
        }),
      };
    } catch (error) {
      this.logger.error(`Error processing query ${queryId}: ${error.message}`);
      throw error;
    }
  }
}
