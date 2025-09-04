import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string | Types.ObjectId) {
    return this.userModel.findById(id).exec();
  }

  async create(payload: { email: string; passwordHash: string; name?: string }) {
    const created = new this.userModel({
      email: payload.email,
      passwordHash: payload.passwordHash,
      name: payload.name,
    });
    return created.save();
  }

  async list(skip = 0, limit = 20) {
    return this.userModel.find().skip(skip).limit(limit).exec();
  }
}