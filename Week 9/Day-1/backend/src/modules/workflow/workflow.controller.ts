import { Controller, Post, Body, Query } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { AskQuestionDto } from '../../common/dto/ask-question.dto';

@Controller()
export class WorkflowController {
  constructor(private readonly wf: WorkflowService) {}

  /**
   * POST /ask
   * body: { question: string, mode?: 'code' | 'llm' }
   * or send ?mode=llm
   */
  @Post('ask')
  async ask(@Body() body: AskQuestionDto, @Query('mode') qmode?: string) {
    const mode = (body.mode || (qmode as any) || 'code') as 'code' | 'llm';
    if (!body?.question) return { ok: false, message: 'question is required' };
    const res = await this.wf.run(body.question, mode);
    return { ok: true, answerId: (res.answer as any)._id, traceId: res.traceId, finalAnswer: (res.answer as any).finalAnswer };
  }
}
