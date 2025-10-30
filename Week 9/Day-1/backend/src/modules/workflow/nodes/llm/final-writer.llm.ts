import { Injectable } from '@nestjs/common';
import { FinalWriterInterface } from '../interfaces/final-writer.interface';
import { callGemini } from '../../../../common/utils/gemini-client';

@Injectable()
export class FinalWriterLLM implements FinalWriterInterface {
  async compose(subQuestions: string[], summaries: string[], checks: { contradictions: string[] }): Promise<string> {
    const prompt = `You are an expert researcher. Given sub-questions and summaries, compose a final structured, clear answer with an executive summary, per-subquestion answers, and a contradictions section if needed.\n\nSubQuestions:\n${subQuestions.map((q,i)=>`${i+1}. ${q}`).join('\n')}\n\nSummaries:\n${summaries.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\nContradictions:\n${(checks?.contradictions && checks.contradictions.length) ? checks.contradictions.join('\n') : 'None'}\n\nFinal Answer:`;
    const res = await callGemini(prompt);
    return res;
  }
}
