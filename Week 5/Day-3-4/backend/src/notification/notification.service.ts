import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';

export enum NotificationType {
  Comment = 'comment',
  Reply = 'reply',
  Like = 'like',
  Follow = 'follow',
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private gateway: NotificationGateway,
  ) {}

  async createForUser(userId: string, payload: Partial<Notification>) {
    const doc = await this.notificationModel.create({ userId, ...payload });
    // send socket event to the specific user's room
    this.gateway.sendToUser(userId, 'notification.created', doc);
    return doc;
  }

  async createBroadcast(payload: Partial<Notification>) {
    // For comment created broadcast to all: Persisting a generic notification to all users would be heavy.
    // Instead, gateway emits a broadcast event and frontend can choose how to display.
    this.gateway.server.emit('comment.created', payload);
    // Optionally persist a system-wide notification or skip persistence.
    return payload;
  }

  async markRead(userId: string, notificationId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true },
    );
  }

  async list(userId: string, page = 0, limit = 20) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
  }
}
