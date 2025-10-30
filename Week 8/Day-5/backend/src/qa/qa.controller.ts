import { Controller, Post, Body } from '@nestjs/common';
import { QaService } from './qa.service';
import type { QueryRequest, QueryResponse } from './qa.service';

@Controller()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post('query')
  async postQuery(@Body() body: QueryRequest): Promise<QueryResponse> {
    return this.qaService.answerQuery(body);
  }
}
