import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TraceDocument = Document & {
  questionId: string;
  steps: any[];
  createdAt: Date;
};

@Schema()
export class TraceEntity {
  @Prop({ required: true }) questionId: string;
  @Prop({ type: Array, default: [] }) steps: any[];
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const TraceSchema = SchemaFactory.createForClass(TraceEntity);
