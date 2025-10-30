import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';
import * as fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class ExtractNode {
  private readonly logger = new Logger(ExtractNode.name);
  private readonly chunkSize = parseInt(process.env.CHUNK_SIZE || '1000');
  private readonly chunkOverlap = parseInt(process.env.CHUNK_OVERLAP || '200');

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    try {
      this.logger.log(`Extraction started: ${state.docId}`);

      let dataBuffer: Buffer;

      // Handle both file path and buffer approaches
      if (state.bufferData) {
        // Use the buffer directly if provided
        dataBuffer = state.bufferData;
        this.logger.log(
          `Using provided buffer for PDF parsing: ${state.docId}`,
        );
      } else if (state.filePath) {
        // Read from file path if provided (legacy approach)
        dataBuffer = await fs.readFile(state.filePath);
        this.logger.log(`Read file from disk: ${state.filePath}`);
      } else {
        throw new Error('Neither bufferData nor filePath provided');
      }

      // Extract text with page boundaries
      const pdfData = await pdfParse(dataBuffer, {
        pagerender: this.pageRenderFunction,
      });

      const text = pdfData.text;
      const pageCount = pdfData.numpages;

      // Check for excessive page count
      const MAX_PAGES = parseInt(process.env.MAX_PDF_PAGES || '100');
      if (pageCount > MAX_PAGES) {
        throw new Error(
          `Document has too many pages (${pageCount}). Maximum allowed is ${MAX_PAGES} pages. Please upload a smaller document.`,
        );
      }

      // Extract page boundaries
      const pageTexts = this.extractPageTexts(pdfData);

      // Create sentence-aware chunks
      const chunks = await this.createChunks(text, pageTexts);

      this.logger.log(
        `Extraction complete: ${state.docId}, ${chunks.length} chunks created`,
      );

      return {
        text,
        chunks,
        pageCount,
      };
    } catch (error) {
      this.logger.error(`Extraction failed: ${error.message}`);
      return {
        error: `Extraction failed: ${error.message}`,
      };
    }
  }

  private pageRenderFunction(pageData: any) {
    const render = pageData.getTextContent();
    return render.then((textContent: any) => {
      let text = '';
      for (const item of textContent.items) {
        text += item.str + ' ';
      }
      return text + '\n[PAGE_BREAK]\n';
    });
  }

  private extractPageTexts(pdfData: any): Map<number, string> {
    const pageTexts = new Map<number, string>();
    const pages = pdfData.text.split('[PAGE_BREAK]');

    pages.forEach((pageText, index) => {
      if (pageText.trim()) {
        pageTexts.set(index + 1, pageText.trim());
      }
    });

    return pageTexts;
  }

  private async createChunks(
    fullText: string,
    pageTexts: Map<number, string>,
  ): Promise<
    Array<{
      text: string;
      pageStart: number;
      pageEnd: number;
      tokenCount: number;
    }>
  > {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
      separators: ['\n\n', '\n', '. ', ', ', ' ', ''],
      keepSeparator: true,
    });

    const chunks = await splitter.createDocuments([fullText]);
    
    // If no chunks were created but we have text, create at least one chunk
    if (chunks.length === 0 && fullText.trim().length > 0) {
      this.logger.log(
        'No chunks created by splitter, creating a single chunk for the entire document',
      );
      return [
        {
          text: fullText.trim(),
          pageStart: 1,
          pageEnd: pageTexts.size || 1,
          tokenCount: this.estimateTokenCount(fullText.trim()),
        },
      ];
    }

    return chunks.map((chunk) => {
      const chunkText = chunk.pageContent;
      const { pageStart, pageEnd } = this.findPageBoundaries(
        chunkText,
        pageTexts,
      );
      const tokenCount = this.estimateTokenCount(chunkText);

      return {
        text: chunkText,
        pageStart,
        pageEnd,
        tokenCount,
      };
    });
  }

  private findPageBoundaries(
    chunkText: string,
    pageTexts: Map<number, string>,
  ): { pageStart: number; pageEnd: number } {
    let pageStart = 1;
    let pageEnd = 1;

    // Find which pages this chunk spans
    for (const [pageNum, pageText] of pageTexts.entries()) {
      if (pageText.includes(chunkText.substring(0, 50))) {
        pageStart = pageNum;
        break;
      }
    }

    for (const [pageNum, pageText] of pageTexts.entries()) {
      if (pageText.includes(chunkText.substring(chunkText.length - 50))) {
        pageEnd = pageNum;
        break;
      }
    }

    return { pageStart, pageEnd };
  }

  private estimateTokenCount(text: string): number {
    // Rough estimate: 1 token per 4 characters
    return Math.ceil(text.length / 4);
  }
}
