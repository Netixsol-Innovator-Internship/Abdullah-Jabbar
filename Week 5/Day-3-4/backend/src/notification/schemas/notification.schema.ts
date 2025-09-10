import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationType = 'comment' | 'reply' | 'like' | 'follow';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: NotificationType;

  @Prop()
  actorId?: string;

  @Prop()
  commentId?: string;

  @Prop()
  postId?: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
