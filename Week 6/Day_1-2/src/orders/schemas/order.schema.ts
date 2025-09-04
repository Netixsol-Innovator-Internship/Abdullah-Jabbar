import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class OrderItem {
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
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
  userId?: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  items: OrderItem[];

  @Prop()
  subtotal?: Types.Decimal128;

  @Prop()
  discounts?: Types.Decimal128;

  @Prop()
  couponCode?: string;

  @Prop()
  couponDiscountAmount?: Types.Decimal128;

  @Prop()
  deliveryFee?: Types.Decimal128;

  @Prop()
  tax?: Types.Decimal128;

  @Prop()
  total?: Types.Decimal128;

  @Prop({ default: 'USD' })
  currency?: string;

  @Prop({ default: 'pending' })
  paymentStatus?: string;

  @Prop({ default: 'pending' })
  fulfillmentStatus?: string;

  @Prop()
  paymentMethod?: string;

  @Prop({ type: Object })
  shippingAddress?: any;

  @Prop({ type: Object })
  billingAddress?: any;

  @Prop()
  placedAt?: Date;

  @Prop()
  loyaltyPointsEarned?: number;

  @Prop()
  loyaltyPointsSpent?: number;

  @Prop({ type: Object, default: {} })
  meta?: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, createdAt: -1 });