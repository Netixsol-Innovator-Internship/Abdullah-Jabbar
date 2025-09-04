import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventoryTransaction extends Document {
  variantId: Types.ObjectId;
  change: number;
  reason: 'order' | 'restock' | 'adjustment' | 'refund';
  orderId?: Types.ObjectId;
  meta?: Record<string, any>;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true, index: true },
    change: { type: Number, required: true },
    reason: { type: String, enum: ['order', 'restock', 'adjustment', 'refund'], required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    meta: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const InventoryTransactionModel = mongoose.model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
);