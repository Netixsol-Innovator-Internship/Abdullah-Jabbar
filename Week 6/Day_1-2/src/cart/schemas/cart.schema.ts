import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'ProductVariant' })
  variantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId?: Types.ObjectId;

  @Prop()
  title?: string;

  @Prop()
  sku?: string;

  @Prop({ default: 1 })
  qty: number;

  @Prop()
  unitPrice?: Types.Decimal128;

  @Prop()
  unitPointsPrice?: number;

  @Prop({ type: Object })
  selectedOptions?: Record<string, any>;

  @Prop()
  lineDiscount?: Types.Decimal128;

  @Prop()
  lineTotal?: Types.Decimal128;

  @Prop()
  addedAt?: Date;

  @Prop({ default: true })
  removable?: boolean;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
  userId?: Types.ObjectId;

  @Prop({ index: true, sparse: true })
  sessionId?: string;

  @Prop({ type: [Object], default: [] })
  items: CartItem[];

  @Prop()
  couponCode?: string;

  @Prop()
  couponDiscountAmount?: Types.Decimal128;

  @Prop()
  discountPercentApplied?: number;

  @Prop()
  subtotal?: Types.Decimal128;

  @Prop()
  discounts?: Types.Decimal128;

  @Prop()
  deliveryFee?: Types.Decimal128;

  @Prop()
  tax?: Types.Decimal128;

  @Prop()
  total?: Types.Decimal128;

  @Prop({ default: 'USD' })
  currency?: string;

  @Prop({ type: Object })
  estimatedShipping?: { method?: string; fee?: Types.Decimal128 };
}

export const CartSchema = SchemaFactory.createForClass(Cart);