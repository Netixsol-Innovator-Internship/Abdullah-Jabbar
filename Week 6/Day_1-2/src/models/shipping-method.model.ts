import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IShippingMethod extends Document {
  name: string;
  flatFee?: mongoose.Types.Decimal128;
  minFreeShippingAmount?: mongoose.Types.Decimal128;
  regions?: string[];
  estimatedDays?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ShippingMethodSchema = new Schema<IShippingMethod>(
  {
    name: { type: String, required: true },
    flatFee: Schema.Types.Decimal128,
    minFreeShippingAmount: Schema.Types.Decimal128,
    regions: [String],
    estimatedDays: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ShippingMethodModel = mongoose.model<IShippingMethod>('ShippingMethod', ShippingMethodSchema);