import mongoose, { Document, Schema, Types } from 'mongoose';

export interface AddressSnapshot {
  _id?: Types.ObjectId;
  label?: string;
  fullName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  roles: string[];
  phone?: string;
  avatarUrl?: string;
  addresses: AddressSnapshot[];
  loyaltyPoints: number;
  loyaltyTier?: string;
  isEmailVerified: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<AddressSnapshot>(
  {
    label: String,
    fullName: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    name: String,
    roles: { type: [String], default: ['user'] },
    phone: String,
    avatarUrl: String,
    addresses: { type: [AddressSchema], default: [] },
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: String,
    isEmailVerified: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

UserSchema.index({ roles: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);