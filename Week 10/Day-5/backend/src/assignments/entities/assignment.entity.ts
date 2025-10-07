export class Assignment {
  _id?: any; // MongoDB ID
  topic: string;
  instructions: string;
  wordCount: number;
  mode: 'strict' | 'loose';
  createdAt: Date;
}
