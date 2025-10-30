import { Injectable } from '@nestjs/common';
import { SummarizerInterface } from '../interfaces/summarizer.interface';
import { callGemini } from '../../../../common/utils/gemini-client';

@Injectable()
export class SummarizerLLM implements SummarizerInterface {
  async summarize(text: string): Promise<string> {
    const prompt = `Please provide a concise, abstractive summary (2-4 sentences) of the following text:\n\n${text}\n\nSummary:`;
    const res = await callGemini(prompt);
    return res;
  }
}
