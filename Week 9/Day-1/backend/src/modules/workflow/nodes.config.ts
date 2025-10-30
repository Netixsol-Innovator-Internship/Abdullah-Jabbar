//nodes.config.ts
export const nodeConfig: Record<string, 'code' | 'llm'> = {
  splitter: 'llm', // use code implementation
  summarizer: 'code', // force summarizer to use LLM
  crossChecker: 'code', // default to code
  finalWriter: 'llm', // default to code
};
