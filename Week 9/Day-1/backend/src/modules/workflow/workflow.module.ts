import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { TracesModule } from '../traces/traces.module';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';

// code implementations
import { SplitterCode } from './nodes/code/splitter.code';
import { SummarizerCode } from './nodes/code/summarizer.code';
import { CrossCheckerCode } from './nodes/code/cross-checker.code';
import { FinalWriterCode } from './nodes/code/final-writer.code';

// llm implementations
import { SplitterLLM } from './nodes/llm/splitter.llm';
import { SummarizerLLM } from './nodes/llm/summarizer.llm';
import { CrossCheckerLLM } from './nodes/llm/cross-checker.llm';
import { FinalWriterLLM } from './nodes/llm/final-writer.llm';

@Module({
  imports: [DocumentsModule, QuestionsModule, AnswersModule, TracesModule],
  providers: [
    WorkflowService,
    // register both implementations so DI can inject them; selection happens at runtime
    SplitterCode,
    SummarizerCode,
    CrossCheckerCode,
    FinalWriterCode,
    SplitterLLM,
    SummarizerLLM,
    CrossCheckerLLM,
    FinalWriterLLM,
  ],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
