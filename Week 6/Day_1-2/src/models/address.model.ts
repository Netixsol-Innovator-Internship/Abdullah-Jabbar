import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  userId: Types.ObjectId;
  label?: string;
  fullName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: String,
    fullName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AddressModel = mongoose.model<IAddress>('Address', AddressSchema);