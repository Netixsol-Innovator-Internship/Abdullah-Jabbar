
// shipping-method.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShippingMethodDocument = ShippingMethod & Document;

@Schema({ timestamps: true })
export class ShippingMethod {
  @Prop({ required: true })
  name: string;

  // Explicit number type
  @Prop({ type: Number, required: false })
  flatFee?: number;

  @Prop({ type: Number, required: false })
  minFreeShippingAmount?: number;

  @Prop({ type: [String], default: [] })
  regions?: string[];

  @Prop({ type: String, required: false })
  estimatedDays?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const ShippingMethodSchema =
  SchemaFactory.createForClass(ShippingMethod);