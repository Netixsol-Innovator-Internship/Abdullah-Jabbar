import { Injectable } from '@nestjs/common';
import { CrossCheckerInterface } from '../interfaces/cross-checker.interface';
import { callGemini } from '../../../../common/utils/gemini-client';

@Injectable()
export class CrossCheckerLLM implements CrossCheckerInterface {
  async check(summaries: string[]): Promise<{ contradictions: string[] }> {
    const prompt = `You are a fact-checker. Given the following summaries, list any contradictions or disagreements between them (short bullets):\n\n${summaries.map((s, i) => `Summary ${i+1}: ${s}`).join('\n\n')}\n\nAnswer as JSON: {"contradictions": ["..."]}`;
    const res = await callGemini(prompt);
    try {
      const parsed = JSON.parse(res);
      if (Array.isArray(parsed?.contradictions)) return { contradictions: parsed.contradictions };
    } catch { /* ignore */ }
    // fallback: return textual output as single element
    return { contradictions: [res] };
  }
}
