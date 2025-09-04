import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPromotion extends Document {
  title: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping';
  value: number;
  appliesTo: { scope: 'all' | 'products' | 'categories'; ids?: Types.ObjectId[] };
  startsAt?: Date;
  endsAt?: Date;
  isActive?: boolean;
  isStackable?: boolean;
  minPurchaseAmount?: mongoose.Types.Decimal128;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['percentage', 'fixed', 'buy_x_get_y', 'free_shipping'], required: true },
    value: { type: Number, required: true },
    appliesTo: {
      scope: { type: String, enum: ['all', 'products', 'categories'], default: 'all' },
      ids: [{ type: Schema.Types.ObjectId }],
    },
    startsAt: Date,
    endsAt: Date,
    isActive: { type: Boolean, default: true },
    isStackable: { type: Boolean, default: false },
    minPurchaseAmount: { type: Schema.Types.Decimal128 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PromotionModel = mongoose.model<IPromotion>('Promotion', PromotionSchema);