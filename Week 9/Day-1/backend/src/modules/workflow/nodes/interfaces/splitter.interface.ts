export interface SplitterInterface {
  split(question: string): Promise<string[]>;
}
