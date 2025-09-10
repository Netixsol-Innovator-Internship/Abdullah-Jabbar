// likes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
// import {
//   NotificationService,
//   NotificationType,
// } from '../notification/notification.service'; // Disabled for Vercel
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';

const LikeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  reviewId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});
LikeSchema.index({ userId: 1, reviewId: 1 }, { unique: true });

@Injectable()
export class LikesService {
  constructor(
    @InjectModel('Like') private likeModel: Model<any>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    // private notifications: NotificationService, // Disabled for Vercel
  ) {}

  async like(userId: string, reviewId: string) {
    try {
      await this.likeModel.create({ userId, reviewId });

      await this.reviewModel.findByIdAndUpdate(reviewId, {
        $inc: { likesCount: 1 },
      });

      // fetch review with proper typing
      const review = await this.reviewModel.findById(reviewId).lean();

      if (review && review.author && review.author.toString() !== userId) {
        // await this.notifications.createForUser(review.author.toString(), {
        //   type: NotificationType.Like,
        //   actorId: userId,
        //   reviewId,
        //   postId: review.postId,
        // }); // Disabled for Vercel
      }

      return { liked: true };
    } catch (err) {
      return { liked: false, error: err.message };
    }
  }

  async unlike(userId: string, reviewId: string) {
    const removed = await this.likeModel.findOneAndDelete({
      userId,
      reviewId,
    });
    if (removed) {
      await this.reviewModel.findByIdAndUpdate(reviewId, {
        $inc: { likesCount: -1 },
      });
      return { liked: false };
    }
    return { liked: false };
  }

  async isLiked(userId: string, reviewId: string) {
    const found = await this.likeModel.findOne({ userId, reviewId });
    return !!found;
  }
}
