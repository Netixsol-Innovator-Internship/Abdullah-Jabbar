import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocDocument = Document & {
  title: string;
  topic?: string;
  content: string;
  createdAt: Date;
};

@Schema()
export class Doc {
  @Prop({ required: true }) title: string;
  @Prop() topic?: string;
  @Prop({ required: true }) content: string;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Doc);
DocumentSchema.index({ title: 'text', topic: 'text', content: 'text' });
