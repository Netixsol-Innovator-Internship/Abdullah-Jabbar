export class UploadSubmissionDto {
  assignmentId: string;
  studentName: string;
  rollNumber: string;
  file: any; // Consider using a more specific type for file uploads
}
