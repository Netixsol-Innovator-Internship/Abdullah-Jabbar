import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';
import { LLMService } from '../../ai/llm.service';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class ClassifyNode {
  private readonly logger = new Logger(ClassifyNode.name);
  private readonly categories = [
    'research paper',
    'business report',
    'user manual',
    'legal contract',
    'financial statement',
  ];

  constructor(private readonly llmService: LLMService) {}

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    try {
      this.logger.log(`Classification started: ${state.docId}`);

      // Use first 8 chunks for classification
      const contextChunks =
        state.chunks && state.chunks.length > 0 ? state.chunks.slice(0, 8) : [];
      const context = contextChunks.map((c) => c.text).join('\n\n');

      const promptTemplate = PromptTemplate.fromTemplate(`
        Analyze the following document excerpt and classify it into exactly one of these categories:
        ${this.categories.map((c) => `- ${c}`).join('\n')}
        
        Document metadata:
        - File name: {fileName}
        - Page count: {pageCount}
        
        Document excerpt:
        {context}
        
        Based on the content, structure, language, and purpose of the document, 
        classify it into one of the above categories.
        
        Response format: Return ONLY the category name, nothing else.
        Category:
      `);

      const prompt = await promptTemplate.format({
        fileName: state.originalName,
        pageCount: state.pageCount,
        context,
      });

      const category = await this.llmService.invoke(prompt);
      const normalizedCategory = this.normalizeCategory(category);

      this.logger.log(
        `Classification complete: ${state.docId} -> ${normalizedCategory}`,
      );

      return {
        category: normalizedCategory,
      };
    } catch (error) {
      this.logger.error(`Classification failed: ${error.message}`);
      return {
        error: `Classification failed: ${error.message}`,
      };
    }
  }

  private normalizeCategory(rawCategory: string): string {
    const cleaned = rawCategory.toLowerCase().trim();

    for (const category of this.categories) {
      if (cleaned.includes(category)) {
        return category;
      }
    }

    // Default fallback
    return 'business report';
  }
}
