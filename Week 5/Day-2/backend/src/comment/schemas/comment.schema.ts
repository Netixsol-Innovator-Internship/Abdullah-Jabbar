// comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  postId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentCommentId?: Types.ObjectId;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  repliesCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Factory
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

// ✅ Type alias for correct typing in services
export type CommentDocument = Comment & Document;
