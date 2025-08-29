import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  auctionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  bidderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: Date.now })
  placedAt: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
