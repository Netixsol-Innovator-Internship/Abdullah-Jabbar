export interface SummarizerInterface {
  summarize(text: string): Promise<string>;
}
