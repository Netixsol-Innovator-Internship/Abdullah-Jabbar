export class Submission {
  _id?: any; // MongoDB ID
  assignmentId: any; // MongoDB ObjectId
  studentName: string;
  rollNumber: string;
  rawText: string;
  score?: number;
  remarks?: string;
  status: 'pending' | 'in-progress' | 'evaluated' | 'failed';
  error?: string;
  createdAt: Date;
}
