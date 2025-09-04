import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShippingMethodDocument = ShippingMethod & Document;

@Schema({ timestamps: true })
export class ShippingMethod {
  @Prop({ required: true })
  name: string;

  @Prop()
  flatFee?: any;

  @Prop()
  minFreeShippingAmount?: any;

  @Prop({ type: [String], default: [] })
  regions?: string[];

  @Prop()
  estimatedDays?: string;

  @Prop({ default: true })
  isActive?: boolean;
}

export const ShippingMethodSchema = SchemaFactory.createForClass(ShippingMethod);