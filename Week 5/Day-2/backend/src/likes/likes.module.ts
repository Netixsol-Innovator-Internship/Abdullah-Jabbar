import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { NotificationModule } from '../notification/notification.module';
import { Comment, CommentSchema } from '../comment/schemas/comment.schema';

const LikeSchema = new (require('mongoose').Schema)({
  userId: { type: String, required: true, index: true },
  commentId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Like', schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    NotificationModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
