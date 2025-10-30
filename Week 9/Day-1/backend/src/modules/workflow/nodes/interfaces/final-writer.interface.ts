export interface FinalWriterInterface {
  compose(
    subQuestions: string[],
    summaries: string[],
    checks: { contradictions: string[] },
  ): Promise<string>;
}
