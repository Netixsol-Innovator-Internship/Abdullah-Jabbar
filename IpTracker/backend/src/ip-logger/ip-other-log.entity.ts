import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema for logging other/miscellaneous requests (not / or /product/:id)
 */
@Schema({ collection: 'other_logs', timestamps: true })
export class IpOtherLog extends Document {
  @Prop({ required: true, index: true })
  hashedIp: string;

  @Prop()
  rawIp?: string;

  @Prop()
  userAgent?: string;

  @Prop({ index: true })
  method?: string;

  @Prop({ required: true, index: true })
  path: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const IpOtherLogSchema = SchemaFactory.createForClass(IpOtherLog);
