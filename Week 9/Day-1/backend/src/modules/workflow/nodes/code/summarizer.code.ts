import { Injectable } from '@nestjs/common';
import { SummarizerInterface } from '../interfaces/summarizer.interface';
import { extractiveSummarize } from '../../../../common/utils/text-processing';

@Injectable()
export class SummarizerCode implements SummarizerInterface {
  async summarize(text: string): Promise<string> {
    // extractive summarization (simple)
    return extractiveSummarize(text, 3);
  }
}
