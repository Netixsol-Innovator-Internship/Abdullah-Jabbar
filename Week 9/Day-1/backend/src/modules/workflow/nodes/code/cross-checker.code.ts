import { Injectable } from '@nestjs/common';
import { CrossCheckerInterface } from '../interfaces/cross-checker.interface';

@Injectable()
export class CrossCheckerCode implements CrossCheckerInterface {
  async check(summaries: string[]): Promise<{ contradictions: string[] }> {
    // naive approach: find sentences that contain negation vs affirmative across summaries on same topic keywords
    // For now, check conflicting presence of "not" or "no" plus keyword overlap
    const contradictions: string[] = [];
    for (let i = 0; i < summaries.length; i++) {
      for (let j = i + 1; j < summaries.length; j++) {
        const a = summaries[i].toLowerCase();
        const b = summaries[j].toLowerCase();
        // if one has 'not' + keyword present in other, mark possible contradiction
        const keywords = a.split(/\W+/).filter(Boolean).slice(0, 8);
        for (const kw of keywords) {
          if (kw.length < 3) continue;
          if (a.includes('not ' + kw) && b.includes(kw) && !b.includes('not ' + kw)) {
            contradictions.push(`Possible contradiction on "${kw}" between summary ${i} and ${j}`);
            break;
          }
        }
      }
    }
    return { contradictions };
  }
}
