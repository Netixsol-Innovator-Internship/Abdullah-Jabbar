import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  findPublicById(id: string) {
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).select('-passwordHash').exec();
  }

  async updateProfile(userId: string, patch: Partial<User>) {
    try {
      console.log('Updating user', userId, 'with', patch);
      return await this.userModel
        .findByIdAndUpdate(userId, patch, { new: true })
        .select('-passwordHash')
        .exec();
    } catch (err) {
      console.error('UpdateProfile error:', err);
      throw err;
    }
  }

  async incFollowers(userId: string, delta: number) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $inc: { followersCount: delta } },
        { new: true },
      )
      .exec();
  }

  async incFollowing(userId: string, delta: number) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $inc: { followingCount: delta } },
        { new: true },
      )
      .exec();
  }
}
