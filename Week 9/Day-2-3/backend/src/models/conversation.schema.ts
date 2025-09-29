import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, type: Object })
  answer: {
    type: string;
    data: any;
    meta?: any;
  };

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
