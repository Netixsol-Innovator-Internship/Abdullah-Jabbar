// workflow.service.ts
import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { TracesService } from '../traces/traces.service';
// interfaces
import { SplitterInterface } from './nodes/interfaces/splitter.interface';
import { SummarizerInterface } from './nodes/interfaces/summarizer.interface';
import { CrossCheckerInterface } from './nodes/interfaces/cross-checker.interface';
import { FinalWriterInterface } from './nodes/interfaces/final-writer.interface';
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
import { rankDocsByQuery } from '../../common/utils/text-processing';
// node config
import { nodeConfig } from './nodes.config';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly docs: DocumentsService,
    private readonly questions: QuestionsService,
    private readonly answers: AnswersService,
    private readonly traces: TracesService,
    // code implementations
    private readonly splitterCode: SplitterCode,
    private readonly summarizerCode: SummarizerCode,
    private readonly crossCheckerCode: CrossCheckerCode,
    private readonly finalWriterCode: FinalWriterCode,
    // llm implementations
    private readonly splitterLLM: SplitterLLM,
    private readonly summarizerLLM: SummarizerLLM,
    private readonly crossCheckerLLM: CrossCheckerLLM,
    private readonly finalWriterLLM: FinalWriterLLM,
  ) {}

  /**
   * Helper to choose implementation based on per-node config
   */
  private pick<T>(
    node: keyof typeof nodeConfig,
    globalMode: 'code' | 'llm',
    codeImpl: T,
    llmImpl: T,
  ): T {
    const mode = nodeConfig[node] ?? globalMode;
    console.log(`[WorkflowService] Node "${node}" using mode: ${mode}`);
    return mode === 'llm' ? llmImpl : codeImpl;
  }

  async run(question: string, globalMode: 'code' | 'llm') {
    // persist question
    const q = await this.questions.create({ question, mode: globalMode });

    // create trace
    const trace = await this.traces.create(q._id.toString());
    const traceId = (trace as any)._id.toString();

    // 1) Splitter
    const splitter = this.pick<SplitterInterface>(
      'splitter',
      globalMode,
      this.splitterCode,
      this.splitterLLM,
    );
    await this.traces.appendStep(traceId, {
      node: 'splitter:start',
      input: question,
    });
    const subQuestions = await splitter.split(question);
    await this.traces.appendStep(traceId, {
      node: 'splitter:end',
      output: subQuestions,
    });

    // For each sub-question: find docs, rank, summarize
    const summaries: string[] = [];
    for (const subQ of subQuestions) {
      await this.traces.appendStep(traceId, {
        node: 'finder:start',
        input: subQ,
      });
      // Document Finder (code version: text search)
      const found = await this.docs.findText(subQ, 10);
      await this.traces.appendStep(traceId, {
        node: 'finder:end',
        outputCount: found.length,
      });

      // Ranker: TF-IDF cosine
      const ranked = rankDocsByQuery(found, subQ).slice(0, 5);
      await this.traces.appendStep(traceId, {
        node: 'ranker',
        results: ranked.map((r) => ({ id: r.doc._id, score: r.score })),
      });

      // Summarizer
      const summarizer = this.pick<SummarizerInterface>(
        'summarizer',
        globalMode,
        this.summarizerCode,
        this.summarizerLLM,
      );

      // Merge contents of top documents
      const combinedText = ranked.map((r) => r.doc.content).join('\n\n');
      await this.traces.appendStep(traceId, {
        node: 'summarizer:start',
        inputSnippet: combinedText.slice(0, 300),
      });
      const summary = await summarizer.summarize(combinedText);
      await this.traces.appendStep(traceId, {
        node: 'summarizer:end',
        output: summary,
      });

      summaries.push(summary);
    }

    // Cross-checker
    const crossChecker = this.pick<CrossCheckerInterface>(
      'crossChecker',
      globalMode,
      this.crossCheckerCode,
      this.crossCheckerLLM,
    );
    await this.traces.appendStep(traceId, {
      node: 'crosschecker:start',
      inputSummariesCount: summaries.length,
    });
    const checks = await crossChecker.check(summaries);
    await this.traces.appendStep(traceId, {
      node: 'crosschecker:end',
      output: checks,
    });

    // Final writer
    const finalWriter = this.pick<FinalWriterInterface>(
      'finalWriter',
      globalMode,
      this.finalWriterCode,
      this.finalWriterLLM,
    );
    await this.traces.appendStep(traceId, { node: 'finalwriter:start' });
    const finalAnswer = await finalWriter.compose(
      subQuestions,
      summaries,
      checks,
    );
    await this.traces.appendStep(traceId, {
      node: 'finalwriter:end',
      output: finalAnswer,
      outputSnippet: finalAnswer.slice(0, 500),
    });

    // Save answer
    const answer = await this.answers.create({
      questionId: q._id.toString(),
      finalAnswer,
    });
    await this.questions.updateAnswer(
      q._id.toString(),
      (answer as any)._id.toString(),
    );

    return { answer, traceId };
  }
}
