import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, index: true })
  code: string;

  @Prop({ required: true })
  type: 'percentage' | 'fixed' | 'free_shipping';

  @Prop({ required: true })
  value: number;

  @Prop()
  maxUses?: number;

  @Prop({ default: 0 })
  usesCount?: number;

  @Prop()
  perUserLimit?: number;

  @Prop()
  validFrom?: Date;

  @Prop()
  validUntil?: Date;

  @Prop()
  minOrderTotal?: Types.Decimal128;

  @Prop({ type: Object, default: { scope: 'all', ids: [] } })
  appliesTo?: { scope: string; ids?: Types.ObjectId[] };

  @Prop()
  createdBy?: Types.ObjectId;

  @Prop({ default: true })
  isActive?: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);