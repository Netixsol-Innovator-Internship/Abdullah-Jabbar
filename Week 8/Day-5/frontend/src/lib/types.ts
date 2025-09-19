// Type definitions used across the frontend

export type Highlight = {
  snippet: string;
  pageNumbers: number[];
};

export type Document = {
  id: string;
  fileName: string;
  pageCount: number;
  category: string;
  summary: string;
  highlights: string[]; // array of short highlight strings
  rawHighlights?: Highlight[]; // optional detailed highlights with snippets + pages
};

export type QueryResponse = {
  answer: string;
  sources?: Array<{
    pageNumbers: number[];
    snippet?: string;
  }>;
};