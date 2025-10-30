import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Document & {
  question: string;
  mode: 'code' | 'llm';
  answerId?: string;
  createdAt: Date;
};

@Schema()
export class QuestionEntity {
  @Prop({ required: true }) question: string;
  @Prop({ default: 'code' }) mode: 'code' | 'llm';
  @Prop() answerId?: string;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);
