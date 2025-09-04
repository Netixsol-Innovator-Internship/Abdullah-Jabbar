import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: string;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  read?: boolean;
  sentViaSocket?: boolean;
  createdAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: String,
    body: String,
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
    sentViaSocket: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);