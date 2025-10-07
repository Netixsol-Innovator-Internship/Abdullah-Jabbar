// Shared types and interfaces can be defined here.
export interface EvaluationResult {
  studentName: string;
  rollNumber: string;
  score: number;
  remarks: string;
}

export interface StudentMetadata {
  studentName: string;
  rollNumber: string;
}

export type SubmissionStatus =
  | 'pending'
  | 'in-progress'
  | 'evaluated'
  | 'failed';
