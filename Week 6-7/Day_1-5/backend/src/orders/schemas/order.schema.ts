
// order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define extended Document type that includes timestamp fields
export interface TimestampedDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = Order & TimestampedDocument;

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

export class OrderCustomer {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

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

  // Stripe / payment provider fields
  @Prop()
  paymentProvider?: string;

  @Prop()
  paymentProviderId?: string; // e.g., stripe payment intent or charge id

  @Prop()
  paymentSessionId?: string; // e.g., stripe checkout session id

  @Prop({ default: 'pending' })
  shippingStatus?: string;

  // Detailed payment method information from Stripe
  @Prop({ type: Object })
  paymentMethodDetails?: {
    type: string; // 'card', 'paypal', etc.
    brand?: string; // 'visa', 'mastercard', etc.
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    funding?: string; // 'credit', 'debit', 'prepaid'
    country?: string;
    wallet?: {
      type: string; // 'apple_pay', 'google_pay', 'samsung_pay'
    };
  };

  @Prop()
  stripePaymentIntentId?: string; // Store Stripe payment intent ID

  @Prop()
  stripeChargeId?: string; // Store Stripe charge ID

  @Prop({ type: Object })
  shippingAddress?: any;

  @Prop({ type: Object })
  billingAddress?: any;

  @Prop({ type: Object })
  customer?: OrderCustomer;

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
OrderSchema.index({ 'customer.userId': 1, createdAt: -1 });