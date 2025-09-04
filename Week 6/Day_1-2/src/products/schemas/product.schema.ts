import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export class ProductImage {
  url: string;
  alt?: string;
  order?: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  shortDescription?: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
  categories: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [{ url: String, alt: String, order: Number }], default: [] })
  images: ProductImage[];

  @Prop({ type: Types.ObjectId, ref: 'ProductVariant' })
  defaultVariantId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'ProductVariant', default: [] })
  variants: Types.ObjectId[];

  @Prop({ required: true })
  basePrice: Types.Decimal128;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  salePrice?: Types.Decimal128;

  @Prop({ default: 0 })
  discountPercent?: number;

  @Prop({ default: false })
  isOnSale?: boolean;

  @Prop()
  saleStartsAt?: Date;

  @Prop()
  saleEndsAt?: Date;

  @Prop({ type: [String], default: [] })
  availableColors?: string[];

  @Prop({ type: [String], default: [] })
  availableSizes?: string[];

  @Prop({ default: 0 })
  ratingAverage?: number;

  @Prop({ default: 0 })
  reviewCount?: number;

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({ default: false })
  isNewArrival?: boolean;

  @Prop({ default: 'out_of_stock' })
  stockStatus?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ ratingAverage: -1 });