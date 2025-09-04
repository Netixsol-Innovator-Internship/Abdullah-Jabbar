import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductVariantDocument = ProductVariant & Document;

@Schema({ timestamps: true })
export class ProductVariant {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ unique: true, sparse: true })
  sku?: string;

  @Prop()
  title?: string;

  @Prop({ type: Object, default: {} })
  attributes?: Record<string, any>;

  @Prop()
  price?: Types.Decimal128;

  @Prop()
  pointsPrice?: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 0 })
  reserved: number;

  @Prop({ default: 5 })
  lowStockThreshold: number;

  @Prop({ default: 'out_of_stock' })
  stockStatus?: string;

  @Prop()
  barcode?: string;

  @Prop()
  weight?: number;

  @Prop({ type: Object })
  dimensions?: Record<string, any>;

  @Prop({ type: [{ url: String, alt: String, order: Number }], default: [] })
  images?: any[];

  @Prop({ default: true })
  isActive?: boolean;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
ProductVariantSchema.index({ 'attributes.color': 1, 'attributes.size': 1 });