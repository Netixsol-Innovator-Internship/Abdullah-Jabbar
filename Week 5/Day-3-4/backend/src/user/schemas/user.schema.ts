import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ❌ Remove duplicate indexes, since `unique: true` already creates them.
// UserSchema.index({ username: 1 });
// UserSchema.index({ email: 1 });
