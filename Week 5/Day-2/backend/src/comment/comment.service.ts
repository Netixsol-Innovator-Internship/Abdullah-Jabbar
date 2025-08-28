// comment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private notifications: NotificationService,
  ) {}

  async createParent(authorId: string, postId: string, text: string) {
    const created = await this.commentModel.create({
      author: new Types.ObjectId(authorId),
      postId,
      text,
    });
    // broadcast notification (created) via notification service
    await this.notifications.createBroadcast({
      type: NotificationType.Comment,
      actorId: authorId,
      postId,
      commentId: created._id.toString(),
    });
    return created;
  }

  async createReply(
    authorId: string,
    postId: string,
    parentCommentId: string,
    text: string,
  ) {
    const reply = await this.commentModel.create({
      author: new Types.ObjectId(authorId),
      postId,
      text,
      parentCommentId: new Types.ObjectId(parentCommentId),
    });
    // increment parent repliesCount
    await this.commentModel.findByIdAndUpdate(parentCommentId, {
      $inc: { repliesCount: 1 },
    });
    // notify original comment author
    const parent = await this.commentModel.findById(parentCommentId).lean();
    if (parent && parent.author.toString() !== authorId) {
      await this.notifications.createForUser(parent.author.toString(), {
        type: NotificationType.Reply,
        actorId: authorId,
        postId,
        commentId: parentCommentId,
      });
    }
    return reply;
  }

  async listCommentsForPost(postId: string, page = 0, limit = 20) {
    // list parent comments (parentCommentId == null)
    const docs = await this.commentModel
      .find({ postId, parentCommentId: null })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .lean();
    return docs;
  }

  async fetchReplies(parentCommentId: string, page = 0, limit = 20) {
    const docs = await this.commentModel
      .find({ parentCommentId })
      .sort({ createdAt: 1 })
      .skip(page * limit)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .lean();
    return docs;
  }

  async getById(id: string) {
    console.log('Looking for comment:', id);
    console.log('Valid ObjectId?', Types.ObjectId.isValid(id));

    const doc = await this.commentModel
      .findById(id)
      .populate('author', 'username profilePicture')
      .lean();

    console.log('Found in doc:', doc);
    return doc;
  }
}
