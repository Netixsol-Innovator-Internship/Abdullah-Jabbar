import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  auctionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ required: true })
  amountPaid: number;

  @Prop({
    enum: ['pending', 'inTransit', 'delivered', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({ default: Date.now })
  paymentDate: Date;

  @Prop([{ status: String, updatedAt: { type: Date, default: Date.now } }])
  deliveryUpdates: { status: string; updatedAt: Date }[];

  @Prop()
  transactionID?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
