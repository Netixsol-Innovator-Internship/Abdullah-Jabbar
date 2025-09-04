import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  maxUses?: number;
  usesCount?: number;
  perUserLimit?: number;
  validFrom?: Date;
  validUntil?: Date;
  minOrderTotal?: mongoose.Types.Decimal128;
  appliesTo?: { scope: 'all' | 'products' | 'categories'; ids?: Types.ObjectId[] };
  createdBy?: Types.ObjectId;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], required: true },
    value: { type: Number, required: true },
    maxUses: Number,
    usesCount: { type: Number, default: 0 },
    perUserLimit: Number,
    validFrom: Date,
    validUntil: Date,
    minOrderTotal: { type: Schema.Types.Decimal128 },
    appliesTo: {
      scope: { type: String, enum: ['all', 'products', 'categories'], default: 'all' },
      ids: [{ type: Schema.Types.ObjectId }],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model<ICoupon>('Coupon', CouponSchema);