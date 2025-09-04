import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductVariant, ProductVariantDocument } from './schemas/product-variant.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name) private variantModel: Model<ProductVariantDocument>,
  ) {}

  async create(payload: Partial<Product>) {
    if (!payload.slug) {
      throw new BadRequestException('slug required');
    }
    const doc = new this.productModel(payload);
    return doc.save();
  }

  async findBySlug(slug: string) {
    return this.productModel.findOne({ slug }).populate('variants').exec();
  }

  async list(query: any = {}) {
    // Supports simple faceted query: colors, sizes, minPrice, maxPrice, category (id or slug)
    const filter: any = {};
    if (query.colors) {
      filter.availableColors = { $in: Array.isArray(query.colors) ? query.colors : [query.colors] };
    }
    if (query.sizes) {
      filter.availableSizes = { $in: Array.isArray(query.sizes) ? query.sizes : [query.sizes] };
    }
    if (query.isOnSale !== undefined) {
      filter.isOnSale = query.isOnSale === 'true' || query.isOnSale === true;
    }
    // price filters operate on basePrice; one could join against variants for variant-level prices
    if (query.minPrice || query.maxPrice) {
      filter.basePrice = {};
      if (query.minPrice) filter.basePrice.$gte = query.minPrice;
      if (query.maxPrice) filter.basePrice.$lte = query.maxPrice;
    }
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const docs = await this.productModel.find(filter).skip(skip).limit(limit).exec();
    const count = await this.productModel.countDocuments(filter);
    return { items: docs, total: count, page, limit };
  }

  async createVariant(payload: Partial<ProductVariant>) {
    const v = new this.variantModel(payload);
    const saved = await v.save();
    // update product.variants
    if (payload.productId) {
      await this.productModel.findByIdAndUpdate(payload.productId, { $addToSet: { variants: saved._id } }).exec();
    }
    return saved;
  }

  async getVariantById(id: string) {
    return this.variantModel.findById(id).exec();
  }
}