// File: src/processing/processing.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { StateGraph, StateGraphArgs } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { ExtractNode } from './nodes/extract.node';
import { EmbedNode } from './nodes/embed.node';
import { StoreNode } from './nodes/store.node';
import { ClassifyNode } from './nodes/classify.node';
import { SummarizeNode } from './nodes/summarize.node';
import { ReadyNode } from './nodes/ready.node';

export interface ProcessingState {
  docId: string;
  filePath?: string;
  originalName: string;
  storedName: string;
  requestId: string;
  text?: string;
  bufferData?: Buffer;
  chunks?: Array<{
    text: string;
    pageStart: number;
    pageEnd: number;
    tokenCount: number;
  }>;
  embeddings?: Array<{
    chunkId: string;
    text: string;
    embedding: number[];
    pageStart: number;
    pageEnd: number;
    tokenCount: number;
  }>;
  category?: string;
  summary?: string;
  highlights?: string[];
  pageCount?: number;
  error?: string;
  messages?: BaseMessage[];
}

export interface ProcessingResult {
  category: string;
  summary: string;
  highlights: string[];
  pageCount: number;
}

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);
  private graph: StateGraph<ProcessingState>;

  constructor(
    private readonly extractNode: ExtractNode,
    private readonly embedNode: EmbedNode,
    private readonly storeNode: StoreNode,
    private readonly classifyNode: ClassifyNode,
    private readonly summarizeNode: SummarizeNode,
    private readonly readyNode: ReadyNode,
  ) {
    this.initializeGraph();
  }

  private initializeGraph(): void {
    const graphConfig: StateGraphArgs<ProcessingState> = {
      channels: {
        docId: null,
        filePath: null,
        originalName: null,
        storedName: null,
        requestId: null,
        text: null,
        bufferData: null,
        chunks: null,
        embeddings: null,
        category: null,
        summary: null,
        highlights: null,
        pageCount: null,
        error: null,
        messages: null,
      },
    };

    // cast to any to avoid strict StateGraph type disagreements in this simplified project
    this.graph = new (StateGraph as any)(
      graphConfig,
    ) as StateGraph<ProcessingState>;

    // Add nodes
    this.graph.addNode('extract', async (state) => {
      this.logger.log(
        `Extract node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.extractNode.execute(state);
    });

    this.graph.addNode('embed', async (state) => {
      this.logger.log(
        `Embed node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.embedNode.execute(state);
    });

    this.graph.addNode('store', async (state) => {
      this.logger.log(
        `Store node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.storeNode.execute(state);
    });

    this.graph.addNode('classify', async (state) => {
      this.logger.log(
        `Classify node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.classifyNode.execute(state);
    });

    this.graph.addNode('summarize', async (state) => {
      this.logger.log(
        `Summarize node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.summarizeNode.execute(state);
    });

    this.graph.addNode('ready', async (state) => {
      this.logger.log(
        `Ready node: ${state.docId} - Request ID: ${state.requestId}`,
      );
      return await this.readyNode.execute(state);
    });

    // Wire nodes: Upload → Extract → Embed → Store → Classify → Summarize → Ready
    // use any casts for graph wiring to avoid strict type mismatches with the langchain lib types
    (this.graph as any).setEntryPoint('extract');
    (this.graph as any).addEdge('extract', 'embed');
    (this.graph as any).addEdge('embed', 'store');
    (this.graph as any).addEdge('store', 'classify');
    (this.graph as any).addEdge('classify', 'summarize');
    (this.graph as any).addEdge('summarize', 'ready');
    (this.graph as any).setFinishPoint('ready');
  }

  async runPipeline(
    initialState: Partial<ProcessingState>,
  ): Promise<ProcessingResult> {
    const compiledGraph = (this.graph as any).compile();

    const finalState = (await compiledGraph.invoke(
      initialState as any,
    )) as Partial<ProcessingState>;

    if (finalState.error) {
      throw new Error(
        typeof finalState.error === 'string'
          ? finalState.error
          : JSON.stringify(finalState.error),
      );
    }

    return {
      category: (finalState.category as string) || 'unknown',
      summary: (finalState.summary as string) || '',
      highlights: (finalState.highlights as string[]) || [],
      pageCount: (finalState.pageCount as number) || 0,
    };
  }

  async runPipelineFromBuffer(
    initialState: Partial<ProcessingState> & { fileBuffer: Buffer },
  ): Promise<ProcessingResult> {
    const compiledGraph = (this.graph as any).compile();

    // Create modified state without fileBuffer but with additional bufferData property
    const stateForGraph: Partial<ProcessingState> = {
      ...initialState,
      bufferData: initialState.fileBuffer,
    };

    // Remove the fileBuffer to avoid serialization issues
    delete (stateForGraph as any).fileBuffer;

    const finalState = (await compiledGraph.invoke(
      stateForGraph as any,
    )) as Partial<ProcessingState>;

    if (finalState.error) {
      throw new Error(
        typeof finalState.error === 'string'
          ? finalState.error
          : JSON.stringify(finalState.error),
      );
    }

    return {
      category: (finalState.category as string) || 'unknown',
      summary: (finalState.summary as string) || '',
      highlights: (finalState.highlights as string[]) || [],
      pageCount: (finalState.pageCount as number) || 0,
    };
  }
}
