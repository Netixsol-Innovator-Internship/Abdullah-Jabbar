import { Injectable, BadRequestException } from '@nestjs/common';
// pdf-parse exports a default callable function; use require to avoid TS namespace import issues
const pdfParse: any = require('pdf-parse');
import {
  cleanText,
  extractStudentMetadata,
} from '../common/utils/text-cleaner';

@Injectable()
export class PdfService {
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      // Extract raw text from PDF using pdf-parse
      const data = await pdfParse(fileBuffer);
      const rawText = data.text;

      if (!rawText || rawText.trim().length === 0) {
        throw new BadRequestException('PDF file appears to be empty');
      }

      // Clean the extracted text
      const cleanedText = cleanText(rawText);

      return cleanedText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new BadRequestException(
        'Failed to extract text from PDF. Please ensure the file is a valid PDF.',
      );
    }
  }

  async extractTextWithMetadata(fileBuffer: Buffer): Promise<{
    text: string;
    studentName: string;
    rollNumber: string;
  }> {
    const rawText = await this.extractText(fileBuffer);
    const metadata = extractStudentMetadata(rawText);

    return {
      text: rawText,
      studentName: metadata.studentName,
      rollNumber: metadata.rollNumber,
    };
  }
}
