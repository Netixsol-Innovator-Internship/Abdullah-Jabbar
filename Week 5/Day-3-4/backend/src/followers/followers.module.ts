import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { UserModule } from '../user/user.module';
import { Schema } from 'mongoose';

const FollowSchema = new Schema({
  followerId: { type: String, required: true, index: true },
  followeeId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});
FollowSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
    UserModule,
  ],
  providers: [FollowersService],
  controllers: [FollowersController],
  exports: [FollowersService],
})
export class FollowersModule {}
