import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPayment extends Document {
  orderId?: Types.ObjectId;
  userId?: Types.ObjectId;
  provider?: string;
  amount?: mongoose.Types.Decimal128;
  currency?: string;
  status?: string;
  providerResponse?: Record<string, any>;
  chargedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    provider: String,
    amount: Schema.Types.Decimal128,
    currency: { type: String, default: 'USD' },
    status: String,
    providerResponse: { type: Schema.Types.Mixed },
    chargedAt: Date,
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);