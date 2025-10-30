
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, index: true, maxlength: 320 })
  email: string;

  // SHA256 hash of the OTP code
  @Prop({ required: true })
  codeHash: string;

  // TTL index: document will be removed by MongoDB when expiresAt passes
  @Prop({ required: true, index: true, expires: 0 })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;

  @Prop({ default: 0 })
  attempts: number;

  // The timestamps are added by Mongoose (timestamps: true), but declare them here
  // so TypeScript knows they exist on the document.
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type OtpDocument = Otp & Document;
export const OtpSchema = SchemaFactory.createForClass(Otp);
