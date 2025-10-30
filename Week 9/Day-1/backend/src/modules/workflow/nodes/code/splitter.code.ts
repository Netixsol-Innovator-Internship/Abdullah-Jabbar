import { Injectable } from '@nestjs/common';
import { SplitterInterface } from '../interfaces/splitter.interface';

@Injectable()
export class SplitterCode implements SplitterInterface {
  async split(question: string): Promise<string[]> {
    // basic heuristic: split on 'and', ';', ',' for multi-part questions
    const parts = question.split(/[,;]|\band\b/i).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
    // fallback: try to split by clauses
    return [question.trim()];
  }
}
