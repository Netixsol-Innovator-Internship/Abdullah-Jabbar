import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string; // "bidStart", "newBid", "bidWinner", "bidEnded"

  @Prop()
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId; // target user (if personal notification)

  @Prop({ type: Types.ObjectId, ref: 'Car', required: false })
  auctionId?: Types.ObjectId; // related auction

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
