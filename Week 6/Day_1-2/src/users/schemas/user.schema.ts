import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  name?: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop()
  phone?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ type: [{ label: String, fullName: String, street1: String, street2: String, city: String, state: String, postalCode: String, country: String, phone: String, isDefault: Boolean }], default: [] })
  addresses: any[];

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop()
  loyaltyTier?: string;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ roles: 1 });