import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignmentId: Types.ObjectId;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  fileName: string;

  @Prop()
  filePath?: string;

  @Prop({ required: true })
  rawText: string;

  @Prop()
  score?: number;

  @Prop()
  remarks?: string;

  @Prop()
  feedback?: string;

  @Prop({
    required: true,
    enum: ['pending', 'in-progress', 'evaluated', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'in-progress' | 'evaluated' | 'failed';

  @Prop()
  error?: string;

  @Prop()
  evaluatedAt?: Date;

  @Prop()
  createdAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
