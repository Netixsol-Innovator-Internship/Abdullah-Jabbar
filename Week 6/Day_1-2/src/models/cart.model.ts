import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
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
  addedAt?: Date;
  removable?: boolean;
}

export interface ICart extends Document {
  userId?: Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  couponDiscountAmount?: mongoose.Types.Decimal128;
  discountPercentApplied?: number;
  subtotal?: mongoose.Types.Decimal128;
  discounts?: mongoose.Types.Decimal128;
  deliveryFee?: mongoose.Types.Decimal128;
  tax?: mongoose.Types.Decimal128;
  total?: mongoose.Types.Decimal128;
  currency?: string;
  estimatedShipping?: { method?: string; fee?: mongoose.Types.Decimal128 };
  createdAt?: Date;
  updatedAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>(
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
    addedAt: { type: Date, default: Date.now },
    removable: { type: Boolean, default: true },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    sessionId: { type: String, index: true, sparse: true },
    items: { type: [CartItemSchema], default: [] },
    couponCode: String,
    couponDiscountAmount: Schema.Types.Decimal128,
    discountPercentApplied: Number,
    subtotal: Schema.Types.Decimal128,
    discounts: Schema.Types.Decimal128,
    deliveryFee: Schema.Types.Decimal128,
    tax: Schema.Types.Decimal128,
    total: Schema.Types.Decimal128,
    currency: { type: String, default: 'USD' },
    estimatedShipping: { method: String, fee: Schema.Types.Decimal128 },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICart>('Cart', CartSchema);