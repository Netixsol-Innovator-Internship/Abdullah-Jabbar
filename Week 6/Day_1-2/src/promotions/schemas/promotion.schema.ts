import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping';

  @Prop({ required: true })
  value: number;

  @Prop({ type: Object, default: { scope: 'all', ids: [] } })
  appliesTo?: { scope: string; ids?: Types.ObjectId[] };

  @Prop()
  startsAt?: Date;

  @Prop()
  endsAt?: Date;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: false })
  isStackable?: boolean;

  @Prop()
  minPurchaseAmount?: Types.Decimal128;

  @Prop()
  createdBy?: Types.ObjectId;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);