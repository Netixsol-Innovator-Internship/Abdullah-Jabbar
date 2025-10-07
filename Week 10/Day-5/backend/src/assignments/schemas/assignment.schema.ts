import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  wordCount: number;

  @Prop({ required: true, enum: ['strict', 'loose'] })
  mode: 'strict' | 'loose';

  @Prop()
  createdAt: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
