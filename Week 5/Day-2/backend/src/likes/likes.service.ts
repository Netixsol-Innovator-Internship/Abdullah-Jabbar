// likes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
// import {
//   NotificationService,
//   NotificationType,
// } from '../notification/notification.service'; // Disabled for Vercel
import { Comment, CommentDocument } from '../comment/schemas/comment.schema';

const LikeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  commentId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

@Injectable()
export class LikesService {
  constructor(
    @InjectModel('Like') private likeModel: Model<any>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    // private notifications: NotificationService, // Disabled for Vercel
  ) {}

  async like(userId: string, commentId: string) {
    try {
      await this.likeModel.create({ userId, commentId });

      await this.commentModel.findByIdAndUpdate(commentId, {
        $inc: { likesCount: 1 },
      });

      // fetch comment with proper typing
      const comment = await this.commentModel.findById(commentId).lean();

      if (comment && comment.author && comment.author.toString() !== userId) {
        // await this.notifications.createForUser(comment.author.toString(), {
        //   type: NotificationType.Like,
        //   actorId: userId,
        //   commentId,
        //   postId: comment.postId,
        // }); // Disabled for Vercel
      }

      return { liked: true };
    } catch (err) {
      return { liked: false, error: err.message };
    }
  }

  async unlike(userId: string, commentId: string) {
    const removed = await this.likeModel.findOneAndDelete({
      userId,
      commentId,
    });
    if (removed) {
      await this.commentModel.findByIdAndUpdate(commentId, {
        $inc: { likesCount: -1 },
      });
      return { liked: false };
    }
    return { liked: false };
  }

  async isLiked(userId: string, commentId: string) {
    const found = await this.likeModel.findOne({ userId, commentId });
    return !!found;
  }
}
