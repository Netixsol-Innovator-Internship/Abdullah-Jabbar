import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnswerDocument = Document & {
  questionId: string;
  finalAnswer: string;
  createdAt: Date;
};

@Schema()
export class AnswerEntity {
  @Prop({ required: true }) questionId: string;
  @Prop({ required: true }) finalAnswer: string;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(AnswerEntity);
