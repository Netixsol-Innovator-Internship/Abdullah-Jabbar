import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILoyaltyTransaction extends Document {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  change: number;
  balanceAfter: number;
  type: 'earn' | 'spend' | 'adjustment' | 'expire';
  reason?: string;
  reference?: Record<string, any>;
  createdAt?: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    change: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    type: { type: String, enum: ['earn', 'spend', 'adjustment', 'expire'], required: true },
    reason: String,
    reference: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LoyaltyTransactionModel = mongoose.model<ILoyaltyTransaction>(
  'LoyaltyTransaction',
  LoyaltyTransactionSchema
);