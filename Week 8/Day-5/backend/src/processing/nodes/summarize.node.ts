import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';
import { LLMService } from '../../ai/llm.service';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class SummarizeNode {
  private readonly logger = new Logger(SummarizeNode.name);

  constructor(private readonly llmService: LLMService) {}

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    try {
      this.logger.log(`Summarization started: ${state.docId}`);

      // Use full text for summarization (or first N chunks if too large)
      const maxChunks = 20;
      const contextChunks =
        state.chunks && state.chunks.length > 0
          ? state.chunks.slice(0, maxChunks)
          : [];
      const context = contextChunks.map((c) => c.text).join('\n\n');

      // Generate summary
      const summaryPrompt = PromptTemplate.fromTemplate(`
        Create an executive summary of the following document.
        
        Document type: {category}
        
        Content:
        {context}
        
        Instructions:
        1. Write exactly 3 paragraphs in neutral, professional tone
        2. Each paragraph should be 3-4 sentences
        3. Focus on the main themes, key findings, and important conclusions
        4. Do not include any formatting or headers
        
        Summary:
      `);

      const summaryInput = await summaryPrompt.format({
        category: state.category,
        context,
      });

      const summary = await this.llmService.invoke(summaryInput);

      // Generate highlights
      const highlightsPrompt = PromptTemplate.fromTemplate(`
        Create key highlights from the following document.
        
        Document type: {category}
        
        Content:
        {context}
        
        Instructions:
        1. Generate up to 10 bullet points
        2. Each bullet point must be 25 words or less
        3. Focus on the most important facts, findings, or recommendations
        4. Start each point with a strong action word or key concept
        5. Return ONLY the bullet points, one per line, with no bullet symbols or numbering
        
        Highlights:
      `);

      const highlightsInput = await highlightsPrompt.format({
        category: state.category,
        context,
      });

      const highlightsRaw = await this.llmService.invoke(highlightsInput);
      const highlights = this.parseHighlights(highlightsRaw);

      this.logger.log(`Summarization complete: ${state.docId}`);

      return {
        summary: summary.trim(),
        highlights,
      };
    } catch (error) {
      this.logger.error(`Summarization failed: ${error.message}`);
      return {
        error: `Summarization failed: ${error.message}`,
      };
    }
  }

  private parseHighlights(raw: string): string[] {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Remove any bullet symbols if present
        return line.replace(/^[-•*]\s*/, '').trim();
      })
      .slice(0, 10); // Ensure max 10 highlights
  }
}
