import { Injectable } from '@nestjs/common';
import { SplitterInterface } from '../interfaces/splitter.interface';
import { callGemini } from '../../../../common/utils/gemini-client';

/**
 * Uses Gemini to split into sub-questions.
 */
@Injectable()
export class SplitterLLM implements SplitterInterface {
  async split(question: string): Promise<string[]> {
    const prompt = `Split the following user question into concise sub-questions (as a JSON array of strings). Question: "${question}". Return JSON only.`;
    const res = await callGemini(prompt);
    try {
      const parsed = JSON.parse(res);
      if (Array.isArray(parsed)) return parsed.map((s: any) => String(s).trim());
    } catch { /* ignore parse error */ }
    // fallback: split by heuristics
    return question.split(/[,;]|\band\b/i).map(s => s.trim()).filter(Boolean);
  }
}
