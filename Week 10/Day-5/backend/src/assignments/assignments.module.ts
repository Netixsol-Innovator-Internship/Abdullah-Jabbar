import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { FilesModule } from '../files/files.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { Submission, SubmissionSchema } from './schemas/submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    FilesModule,
    EvaluationModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
