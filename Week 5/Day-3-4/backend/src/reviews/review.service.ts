// review.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
// import { NotificationService } from '../notification/notification.service'; // Disabled for Vercel
// import { NotificationType } from '../notification/notification.service'; // Disabled for Vercel

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    // private notifications: NotificationService, // Disabled for Vercel
  ) {}

  async createParent(
    authorId: string,
    postId: string,
    text: string,
    authorName?: string,
    rating?: number,
  ) {
    const reviewData: any = {
      postId,
      text,
      rating: rating || 5, // Default to 5 stars if not provided
      authorName: authorName || 'Anonymous User',
    };

    // Only set author ObjectId if it's a valid ObjectId (not 'anonymous')
    if (authorId !== 'anonymous' && Types.ObjectId.isValid(authorId)) {
      reviewData.author = new Types.ObjectId(authorId);
    }

    const created = await this.reviewModel.create(reviewData);

    // broadcast notification (created) via notification service
    // await this.notifications.createBroadcast({
    //   type: NotificationType.Review,
    //   actorId: authorId,
    //   postId,
    //   reviewId: created._id.toString(),
    // }); // Disabled for Vercel
    return created;
  }

  async createReply(
    authorId: string,
    postId: string,
    parentReviewId: string,
    text: string,
    authorName?: string,
  ) {
    console.log('💾 Creating reply with data:', {
      authorId,
      postId,
      parentReviewId,
      text,
      authorName,
    });

    const replyData: any = {
      postId,
      text,
      parentReviewId: new Types.ObjectId(parentReviewId),
      authorName: authorName || 'Anonymous User',
    };

    // Only set author ObjectId if it's a valid ObjectId (not 'anonymous')
    if (authorId !== 'anonymous' && Types.ObjectId.isValid(authorId)) {
      replyData.author = new Types.ObjectId(authorId);
    }

    console.log('💾 Reply data to save:', replyData);
    const reply = await this.reviewModel.create(replyData);
    console.log('💾 Reply saved with ID:', reply._id);

    // Populate the author field for consistent response format
    const populatedReply = await this.reviewModel
      .findById(reply._id)
      .populate('author', 'username profilePicture')
      .lean();

    // increment parent repliesCount
    await this.reviewModel.findByIdAndUpdate(parentReviewId, {
      $inc: { repliesCount: 1 },
    });
    // notify original review author
    const parent = await this.reviewModel.findById(parentReviewId).lean();
    if (parent && parent.author && parent.author.toString() !== authorId) {
      // await this.notifications.createForUser(parent.author.toString(), {
      //   type: NotificationType.Reply,
      //   actorId: authorId,
      //   postId,
      //   reviewId: parentReviewId,
      // }); // Disabled for Vercel
    }
    return populatedReply || reply;
  }

  async listReviewsForPost(postId: string, page = 0, limit = 20) {
    // list parent reviews (parentReviewId == null)
    const docs = await this.reviewModel
      .find({ postId, parentReviewId: null })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .lean();
    return docs;
  }

  async fetchReplies(parentReviewId: string, page = 0, limit = 20) {
    console.log('🔍 Fetching replies for parentReviewId:', parentReviewId);
    console.log(
      '🔍 Is valid ObjectId?',
      Types.ObjectId.isValid(parentReviewId),
    );

    const docs = await this.reviewModel
      .find({ parentReviewId: new Types.ObjectId(parentReviewId) })
      .sort({ createdAt: 1 })
      .skip(page * limit)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .lean();

    console.log('🔍 Found replies:', docs.length);
    console.log('🔍 Reply docs:', docs);
    return docs;
  }

  async getById(id: string) {
    console.log('Looking for review:', id);
    console.log('Valid ObjectId?', Types.ObjectId.isValid(id));

    const doc = await this.reviewModel
      .findById(id)
      .populate('author', 'username profilePicture')
      .lean();

    console.log('Found in doc:', doc);
    return doc;
  }
}
