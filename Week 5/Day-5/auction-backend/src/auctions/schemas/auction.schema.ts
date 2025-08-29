import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({
  timestamps: true,
  collection: 'auctions',
})
export class Auction {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ required: true, type: Date })
  endTime: Date;

  @Prop({
    type: String,
    default: 'upcoming',
    enum: ['upcoming', 'live', 'ended', 'completed'],
  })
  status: string;

  @Prop({ type: Number, default: 0 })
  currentPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
  winningBid: Types.ObjectId | null;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
