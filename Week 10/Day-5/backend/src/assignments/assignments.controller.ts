import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
  Res,
  HttpStatus,
  Query,
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import * as fs from 'fs';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // POST /assignments - Create a new assignment
  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    const assignment =
      await this.assignmentsService.createAssignment(createAssignmentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Assignment created successfully',
      data: assignment,
    };
  }

  // GET /assignments - Get all assignments
  @Get()
  async findAll() {
    const assignments = await this.assignmentsService.getAllAssignments();
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignments retrieved successfully',
      data: assignments,
    };
  }

  // GET /assignments/:id - Get assignment with submissions
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result =
      await this.assignmentsService.getAssignmentWithSubmissions(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment retrieved successfully',
      data: result,
    };
  }

  // PATCH /assignments/:id - Update assignment
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateAssignmentDto,
  ) {
    const assignment = await this.assignmentsService.updateAssignment(
      id,
      updateData,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment updated successfully',
      data: assignment,
    };
  }

  // POST /assignments/:id/submissions/upload - Upload multiple PDF submissions
  @Post(':id/submissions/upload')
  @UseInterceptors(FilesInterceptor('files', 50)) // Allow up to 50 files
  async uploadSubmissions(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => file.mimetype !== 'application/pdf',
    );
    if (invalidFiles.length > 0) {
      throw new BadRequestException(
        'Only PDF files are allowed. Invalid files: ' +
          invalidFiles.map((f) => f.originalname).join(', '),
      );
    }

    const submissions = await this.assignmentsService.uploadSubmissions(
      id,
      files,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: `${submissions.length} submission(s) uploaded successfully`,
      data: submissions,
    };
  }

  // POST /assignments/:id/evaluate - Evaluate all pending submissions
  @Post(':id/evaluate')
  async evaluateSubmissions(@Param('id') id: string) {
    const evaluatedSubmissions =
      await this.assignmentsService.evaluateSubmissions(id);

    return {
      statusCode: HttpStatus.OK,
      message: `${evaluatedSubmissions.length} pending submission(s) queued for evaluation`,
      data: evaluatedSubmissions,
    };
  }

  // POST /assignments/:id/reevaluate - Reevaluate all submissions
  @Post(':id/reevaluate')
  async reevaluateAllSubmissions(@Param('id') id: string) {
    const evaluatedSubmissions =
      await this.assignmentsService.reevaluateAllSubmissions(id);

    return {
      statusCode: HttpStatus.OK,
      message: `${evaluatedSubmissions.length} submission(s) queued for reevaluation`,
      data: evaluatedSubmissions,
    };
  }

  // GET /assignments/:id/submissions - Get all submissions for an assignment
  @Get(':id/submissions')
  async getSubmissions(@Param('id') id: string) {
    const submissions = await this.assignmentsService.getSubmissions(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Submissions retrieved successfully',
      data: submissions,
    };
  }

  // DELETE /assignments/:id/submissions/:submissionId - Delete a specific submission
  @Delete(':id/submissions/:submissionId')
  async deleteSubmission(
    @Param('id') assignmentId: string,
    @Param('submissionId') submissionId: string,
  ) {
    await this.assignmentsService.deleteSubmission(assignmentId, submissionId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Submission deleted successfully',
    };
  }

  // POST /assignments/:id/submissions/retry - Retry failed submissions
  @Post(':id/submissions/retry')
  async retryFailedSubmissions(@Param('id') id: string) {
    await this.assignmentsService.retryFailedSubmissions(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Failed submissions queued for retry',
    };
  }

  // GET /assignments/:id/queue-status - Get evaluation queue status
  @Get(':id/queue-status')
  getQueueStatus() {
    const status = this.assignmentsService.getQueueStatus();
    return {
      statusCode: HttpStatus.OK,
      message: 'Queue status retrieved successfully',
      data: status,
    };
  }

  // GET /assignments/:id/marks-sheet - Generate and download marks sheet
  @Get(':id/marks-sheet')
  async downloadMarksSheet(
    @Param('id') id: string,
    @Query('format') format: 'xlsx' | 'csv' = 'xlsx',
    @Res() res: Response,
  ) {
    // Validate format
    if (format !== 'xlsx' && format !== 'csv') {
      throw new BadRequestException('Format must be either xlsx or csv');
    }

    const filePath = await this.assignmentsService.generateMarksSheet(
      id,
      format,
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Failed to generate marks sheet');
    }

    // Set appropriate headers for file download
    const filename = filePath.split(/[\\/]/).pop() || 'marks_sheet';
    res.setHeader(
      'Content-Type',
      format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Clean up file after sending (optional)
    fileStream.on('end', () => {
      // Optionally delete the file after sending
      // fs.unlinkSync(filePath);
    });
  }
}
