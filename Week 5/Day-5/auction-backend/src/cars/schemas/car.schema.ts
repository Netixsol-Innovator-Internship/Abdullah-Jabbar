/* eslint-disable prettier/prettier */
// car.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({
    required: true,
    enum: ['sedan', 'sports', 'hatchback', 'convertible'],
  })
  bodyType: string;

  @Prop()
  category: string;

  @Prop([String])
  photos: string[];

  @Prop({ required: true })
  startingPrice: number;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop([{ type: Types.ObjectId, ref: 'Bid' }])
  bids: Types.ObjectId[];

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);
