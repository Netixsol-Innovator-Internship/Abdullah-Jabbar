import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVariantAttribute {
  color?: string;
  size?: string;
  [key: string]: any;
}

export interface IProductVariant extends Document {
  productId: Types.ObjectId;
  sku?: string;
  title?: string;
  attributes?: IVariantAttribute;
  price?: mongoose.Types.Decimal128;
  pointsPrice?: number;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';
  barcode?: string;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  images?: { url: string; alt?: string; order?: number }[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sku: { type: String, unique: true, sparse: true },
    title: String,
    attributes: { type: Schema.Types.Mixed, default: {} },
    price: { type: Schema.Types.Decimal128 },
    pointsPrice: Number,
    stock: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    stockStatus: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock', 'preorder'], default: 'out_of_stock' },
    barcode: String,
    weight: Number,
    dimensions: { length: Number, width: Number, height: Number },
    images: [{ url: String, alt: String, order: Number }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductVariantSchema.index({ 'attributes.color': 1, 'attributes.size': 1 });

export const ProductVariantModel = mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);