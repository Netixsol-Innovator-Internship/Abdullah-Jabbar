import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  variantId?: Types.ObjectId;
  productId?: Types.ObjectId;
  title?: string;
  sku?: string;
  qty: number;
  unitPrice?: mongoose.Types.Decimal128;
  unitPointsPrice?: number;
  selectedOptions?: Record<string, any>;
  lineDiscount?: mongoose.Types.Decimal128;
  lineTotal?: mongoose.Types.Decimal128;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: Types.ObjectId;
  items: IOrderItem[];
  subtotal?: mongoose.Types.Decimal128;
  discounts?: mongoose.Types.Decimal128;
  couponCode?: string;
  couponDiscountAmount?: mongoose.Types.Decimal128;
  deliveryFee?: mongoose.Types.Decimal128;
  tax?: mongoose.Types.Decimal128;
  total?: mongoose.Types.Decimal128;
  currency?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod?: string;
  shippingAddress?: any;
  billingAddress?: any;
  placedAt?: Date;
  loyaltyPointsEarned?: number;
  loyaltyPointsSpent?: number;
  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    sku: String,
    qty: { type: Number, default: 1 },
    unitPrice: Schema.Types.Decimal128,
    unitPointsPrice: Number,
    selectedOptions: { type: Schema.Types.Mixed, default: {} },
    lineDiscount: Schema.Types.Decimal128,
    lineTotal: Schema.Types.Decimal128,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: Schema.Types.Decimal128,
    discounts: Schema.Types.Decimal128,
    couponCode: String,
    couponDiscountAmount: Schema.Types.Decimal128,
    deliveryFee: Schema.Types.Decimal128,
    tax: Schema.Types.Decimal128,
    total: Schema.Types.Decimal128,
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentMethod: String,
    shippingAddress: { type: Schema.Types.Mixed },
    billingAddress: { type: Schema.Types.Mixed },
    placedAt: Date,
    loyaltyPointsEarned: Number,
    loyaltyPointsSpent: Number,
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, placedAt: -1 });

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);