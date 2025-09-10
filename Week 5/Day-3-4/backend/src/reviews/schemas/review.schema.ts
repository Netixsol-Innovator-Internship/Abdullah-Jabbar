// review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  postId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  author?: Types.ObjectId;

  @Prop({ required: false, default: 'Anonymous User' })
  authorName: string;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: Number,
    min: 0.5,
    max: 5,
    required: false, // Make optional since replies don't need ratings
    validate: {
      validator: function (value: number) {
        // Allow half-star increments: 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
        // Also allow null/undefined for replies
        if (value === null || value === undefined) return true;
        return value >= 0.5 && value <= 5 && (value * 2) % 1 === 0;
      },
      message: 'Rating must be between 0.5 and 5 in 0.5 increments',
    },
  })
  rating?: number;

  @Prop({ type: Types.ObjectId, ref: 'Review', default: null })
  parentReviewId?: Types.ObjectId;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  repliesCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Factory
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ postId: 1, parentReviewId: 1, createdAt: -1 });

// ✅ Type alias for correct typing in services
export type ReviewDocument = Review & Document;
