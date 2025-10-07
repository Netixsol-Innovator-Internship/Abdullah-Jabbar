import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { PdfService } from '../files/pdf.service';
import { EvaluationService } from '../evaluation/evaluation.service';
import { ExcelService } from '../files/excel.service';
import { QueueService } from '../common/queue.service';

interface EvaluationQueueItem {
  submissionId: string;
  assignmentId: string;
}

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);
  private evaluationQueue: QueueService<EvaluationQueueItem>;

  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private readonly pdfService: PdfService,
    private readonly evaluationService: EvaluationService,
    private readonly excelService: ExcelService,
  ) {
    // Initialize evaluation queue
    this.evaluationQueue = new QueueService<EvaluationQueueItem>();
    this.evaluationQueue.setProcessor(this.processEvaluation.bind(this));
  }

  // Process single evaluation from queue
  private async processEvaluation(item: EvaluationQueueItem): Promise<void> {
    const submission = await this.submissionModel.findById(item.submissionId);
    if (!submission) {
      throw new Error(`Submission ${item.submissionId} not found`);
    }

    const assignment = await this.assignmentModel.findById(item.assignmentId);
    if (!assignment) {
      throw new Error(`Assignment ${item.assignmentId} not found`);
    }

    try {
      // Update status to in-progress
      submission.status = 'in-progress';
      await submission.save();

      // Convert documents to plain objects for evaluation
      const assignmentObj = assignment.toObject() as any;
      const submissionObj = submission.toObject() as any;

      // Call evaluation service
      const result = await this.evaluationService.evaluate(
        assignmentObj,
        submissionObj,
      );

      // Update submission with evaluation results
      submission.score = result.score;
      submission.remarks = result.remarks;
      submission.feedback = result.remarks; // Also set feedback for frontend compatibility
      submission.status = 'evaluated';
      submission.evaluatedAt = new Date();
      await submission.save();

      this.logger.log(`Successfully evaluated submission ${item.submissionId}`);
    } catch (error) {
      this.logger.error(
        `Error evaluating submission ${item.submissionId}:`,
        error.message,
      );
      submission.status = 'failed';
      submission.error = error.message;
      submission.remarks = `Evaluation failed: ${error.message}`;
      await submission.save();
      throw error; // Re-throw to allow queue retry
    }
  }

  // Create a new assignment
  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = new this.assignmentModel({
      topic: createAssignmentDto.topic,
      instructions: createAssignmentDto.instructions,
      wordCount: createAssignmentDto.wordCount,
      mode: createAssignmentDto.mode,
      createdAt: new Date(),
    });

    await assignment.save();
    this.logger.log(`Created assignment ${assignment._id}`);
    return assignment.toObject();
  }

  // Get assignment by ID
  async getAssignment(id: string): Promise<Assignment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid assignment ID: ${id}`);
    }

    const assignment = await this.assignmentModel.findById(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment.toObject();
  }

  // Update assignment
  async updateAssignment(
    id: string,
    updateData: UpdateAssignmentDto,
  ): Promise<Assignment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid assignment ID: ${id}`);
    }

    const assignment = await this.assignmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    this.logger.log(`Updated assignment ${id}`);
    return assignment.toObject();
  }

  // Get all assignments
  async getAllAssignments(): Promise<Assignment[]> {
    const assignments = await this.assignmentModel
      .find()
      .sort({ createdAt: -1 });
    return assignments.map((a) => a.toObject());
  }

  // Get assignment with submissions
  async getAssignmentWithSubmissions(id: string): Promise<{
    assignment: Assignment;
    submissions: Submission[];
  }> {
    const assignment = await this.getAssignment(id);
    const submissions = await this.submissionModel
      .find({ assignmentId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 });

    return {
      assignment,
      submissions: submissions.map((s) => s.toObject()),
    };
  }

  // Upload and process submissions (batch processing)
  async uploadSubmissions(
    assignmentId: string,
    files: Express.Multer.File[],
  ): Promise<Submission[]> {
    const assignment = await this.getAssignment(assignmentId);
    const newSubmissions: Submission[] = [];
    const evaluationItems: Array<{ id: string; data: EvaluationQueueItem }> =
      [];

    this.logger.log(
      `Processing ${files.length} PDF uploads for assignment ${assignmentId}`,
    );

    for (const file of files) {
      try {
        // Extract text and metadata from PDF
        const { text, studentName, rollNumber } =
          await this.pdfService.extractTextWithMetadata(file.buffer);

        // Create submission entity with status='pending'
        const submission = new this.submissionModel({
          assignmentId: new Types.ObjectId(assignmentId),
          studentName,
          rollNumber,
          fileName: file.originalname,
          filePath: `uploads/${assignmentId}/${file.originalname}`, // Virtual path for now
          rawText: text,
          status: 'pending',
          createdAt: new Date(),
        });

        await submission.save();
        newSubmissions.push(submission.toObject());

        // Add to evaluation queue
        const subId = (submission._id as Types.ObjectId).toString();
        evaluationItems.push({
          id: subId,
          data: {
            submissionId: subId,
            assignmentId: assignmentId,
          },
        });

        this.logger.log(
          `Created submission ${subId} for ${studentName} (${rollNumber})`,
        );
      } catch (error) {
        this.logger.error(
          `Error processing file ${file.originalname}:`,
          error.message,
        );
        // Continue processing other files
      }
    }

    // Do NOT auto-enqueue for evaluation - let user decide when to evaluate
    this.logger.log(
      `Created ${newSubmissions.length} submissions with pending status`,
    );

    return newSubmissions;
  }

  // Delete a specific submission
  async deleteSubmission(
    assignmentId: string,
    submissionId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(assignmentId)) {
      throw new NotFoundException(`Invalid assignment ID: ${assignmentId}`);
    }
    if (!Types.ObjectId.isValid(submissionId)) {
      throw new NotFoundException(`Invalid submission ID: ${submissionId}`);
    }

    // Verify assignment exists
    await this.getAssignment(assignmentId);

    // Find and delete the submission
    const submission = await this.submissionModel.findOneAndDelete({
      _id: new Types.ObjectId(submissionId),
      assignmentId: new Types.ObjectId(assignmentId),
    });

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} not found in assignment ${assignmentId}`,
      );
    }

    this.logger.log(
      `Deleted submission ${submissionId} from assignment ${assignmentId}`,
    );
  }

  // Evaluate all pending submissions for an assignment
  async evaluateSubmissions(assignmentId: string): Promise<Submission[]> {
    return this.evaluateSubmissionsWithFilter(assignmentId, 'pending');
  }

  // Evaluate all submissions for an assignment (reevaluate)
  async reevaluateAllSubmissions(assignmentId: string): Promise<Submission[]> {
    return this.evaluateSubmissionsWithFilter(assignmentId, 'all');
  }

  // Helper method to evaluate submissions with filter
  private async evaluateSubmissionsWithFilter(
    assignmentId: string,
    filter: 'pending' | 'all',
  ): Promise<Submission[]> {
    await this.getAssignment(assignmentId); // Verify assignment exists

    const queryFilter: any = {
      assignmentId: new Types.ObjectId(assignmentId),
    };

    if (filter === 'pending') {
      queryFilter.status = 'pending';
    }

    const submissions = await this.submissionModel.find(queryFilter);

    if (submissions.length === 0) {
      this.logger.log(
        `No ${filter === 'pending' ? 'pending' : ''} submissions for assignment ${assignmentId}`,
      );
      return [];
    }

    this.logger.log(
      `Found ${submissions.length} ${filter === 'pending' ? 'pending' : ''} submissions for assignment ${assignmentId}`,
    );

    // Reset status to pending for all submissions being evaluated
    await this.submissionModel.updateMany(
      { _id: { $in: submissions.map((s) => s._id) } },
      {
        status: 'pending',
        score: undefined,
        remarks: undefined,
        feedback: undefined,
      },
    );

    // Enqueue all submissions
    const evaluationItems = submissions.map((sub) => {
      const subId = (sub._id as Types.ObjectId).toString();
      return {
        id: subId,
        data: {
          submissionId: subId,
          assignmentId: assignmentId,
        },
      };
    });

    await this.evaluationQueue.enqueueMany(evaluationItems);
    this.logger.log(
      `Enqueued ${evaluationItems.length} submissions for evaluation`,
    );

    return submissions.map((s) => s.toObject());
  }

  // Get submissions for an assignment
  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    await this.getAssignment(assignmentId); // Verify assignment exists
    const submissions = await this.submissionModel
      .find({ assignmentId: new Types.ObjectId(assignmentId) })
      .sort({ createdAt: -1 });
    return submissions.map((s) => s.toObject());
  }

  // Re-evaluate failed submissions
  async retryFailedSubmissions(assignmentId: string): Promise<void> {
    await this.getAssignment(assignmentId); // Verify assignment exists

    const failedSubmissions = await this.submissionModel.find({
      assignmentId: new Types.ObjectId(assignmentId),
      status: 'failed',
    });

    if (failedSubmissions.length === 0) {
      this.logger.log(`No failed submissions for assignment ${assignmentId}`);
      return;
    }

    this.logger.log(`Retrying ${failedSubmissions.length} failed submissions`);

    const evaluationItems = failedSubmissions.map((sub) => {
      const subId = (sub._id as Types.ObjectId).toString();
      return {
        id: subId,
        data: {
          submissionId: subId,
          assignmentId: assignmentId,
        },
      };
    });

    await this.evaluationQueue.enqueueMany(evaluationItems);
  }

  // Generate marks sheet
  async generateMarksSheet(
    assignmentId: string,
    format: 'xlsx' | 'csv' = 'xlsx',
  ): Promise<string> {
    const assignment = await this.getAssignment(assignmentId);
    const submissions = await this.submissionModel.find({
      assignmentId: new Types.ObjectId(assignmentId),
    });

    if (submissions.length === 0) {
      throw new NotFoundException('No submissions found for this assignment');
    }

    const submissionObjects = submissions.map((s) => s.toObject() as any);

    if (format === 'csv') {
      return await this.excelService.generateCSV(
        submissionObjects,
        assignment.topic,
      );
    } else {
      return await this.excelService.generateMarksSheet(
        submissionObjects,
        assignment.topic,
      );
    }
  }

  // Get queue status
  getQueueStatus(): { queueSize: number; isProcessing: boolean } {
    return {
      queueSize: this.evaluationQueue.getQueueSize(),
      isProcessing: this.evaluationQueue.isProcessing(),
    };
  }
}
