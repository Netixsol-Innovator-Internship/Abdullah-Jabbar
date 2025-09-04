import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
  order?: number;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categories: Types.ObjectId[];
  tags: string[];
  images: IProductImage[];
  defaultVariantId?: Types.ObjectId;
  variants?: Types.ObjectId[]; // references
  basePrice: mongoose.Types.Decimal128;
  currency?: string;
  salePrice?: mongoose.Types.Decimal128;
  discountPercent?: number;
  isOnSale?: boolean;
  saleStartsAt?: Date;
  saleEndsAt?: Date;
  isLoyaltyOnly?: boolean;
  isHybrid?: boolean;
  pointsPrice?: number;
  pointsEarnRate?: number;
  availableColors?: string[];
  availableSizes?: string[];
  ratingAverage?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'preorder';
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: String,
    description: String,
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    tags: [{ type: String, index: true }],
    images: [{ url: String, alt: String, order: Number }],
    defaultVariantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
    variants: [{ type: Schema.Types.ObjectId, ref: 'ProductVariant' }],
    basePrice: { type: Schema.Types.Decimal128, required: true },
    currency: { type: String, default: 'USD' },
    salePrice: { type: Schema.Types.Decimal128 },
    discountPercent: { type: Number, default: 0 },
    isOnSale: { type: Boolean, default: false },
    saleStartsAt: Date,
    saleEndsAt: Date,
    isLoyaltyOnly: { type: Boolean, default: false },
    isHybrid: { type: Boolean, default: false },
    pointsPrice: Number,
    pointsEarnRate: Number,
    availableColors: { type: [String], default: [] },
    availableSizes: { type: [String], default: [] },
    ratingAverage: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    stockStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'preorder'], default: 'out_of_stock' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ ratingAverage: -1 });

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);