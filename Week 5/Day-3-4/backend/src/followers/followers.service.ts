import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Document } from 'mongoose';
import { UserService } from '../user/user.service';

export interface FollowDoc extends Document {
  followerId: string;
  followeeId: string;
  createdAt: Date;
}

@Injectable()
export class FollowersService {
  private FollowModel: Model<FollowDoc>;
  constructor(
    @InjectModel('Follow') private followModel: Model<FollowDoc>,
    private users: UserService,
  ) {
    this.FollowModel = followModel;
  }

  async follow(followerId: string, followeeId: string) {
    if (followerId === followeeId) throw new Error('Cannot follow yourself');
    const exists = await this.FollowModel.findOne({ followerId, followeeId });
    if (exists) return { already: true };
    await this.FollowModel.create({ followerId, followeeId });
    await this.users.incFollowers(followeeId, 1);
    await this.users.incFollowing(followerId, 1);
    return { ok: true };
  }

  async unfollow(followerId: string, followeeId: string) {
    const removed = await this.FollowModel.findOneAndDelete({
      followerId,
      followeeId,
    });
    if (!removed) return { already: false };
    await this.users.incFollowers(followeeId, -1);
    await this.users.incFollowing(followerId, -1);
    return { ok: true };
  }

  async isFollowing(followerId: string, followeeId: string) {
    const found = await this.FollowModel.findOne({ followerId, followeeId });
    return !!found;
  }

  async listFollowers(userId: string, page = 0, limit = 20) {
    const docs = await this.FollowModel.find({ followeeId: userId })
      .skip(page * limit)
      .limit(limit)
      .lean();
    return docs;
  }

  async listFollowing(userId: string, page = 0, limit = 20) {
    const docs = await this.FollowModel.find({ followerId: userId })
      .skip(page * limit)
      .limit(limit)
      .lean();
    return docs;
  }
}
