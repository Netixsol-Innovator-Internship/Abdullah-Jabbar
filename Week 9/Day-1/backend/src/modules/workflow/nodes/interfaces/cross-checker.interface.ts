export interface CrossCheckerInterface {
  check(summaries: string[]): Promise<{ contradictions: string[] }>;
}
