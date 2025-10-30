
// products.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import {
  ProductVariant,
  ProductVariantDocument,
} from './schemas/product-variant.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name)
    private variantModel: Model<ProductVariantDocument>,
  ) {}

  async create(
    payload: Partial<Product>,
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization - allow both admin and super-admin
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required to create products.',
      );
    }

    if (!payload.slug) {
      throw new BadRequestException('slug required');
    }

    // Prevent duplicate products by slug
    const existing = await this.productModel
      .findOne({ slug: payload.slug })
      .exec();
    if (existing) {
      throw new ConflictException('Product with this slug already exists');
    }

    // Convert/validate basePrice
    let basePriceVal: Types.Decimal128 | undefined = undefined;
    if (payload.basePrice !== undefined && payload.basePrice !== null) {
      try {
        basePriceVal = Types.Decimal128.fromString(
          payload.basePrice.toString(),
        );
      } catch (err) {
        throw new BadRequestException('invalid basePrice');
      }
    }

    // Convert/validate salePrice
    let salePriceVal: Types.Decimal128 | undefined = undefined;
    if (
      payload.salePrice !== undefined &&
      payload.salePrice !== null &&
      payload.salePrice.toString().trim() !== ''
    ) {
      try {
        salePriceVal = Types.Decimal128.fromString(
          payload.salePrice.toString(),
        );
      } catch (err) {
        throw new BadRequestException('invalid salePrice');
      }
    }

    const doc = new this.productModel({
      ...payload,
      basePrice: basePriceVal,
      salePrice: salePriceVal,
    });

    try {
      return await doc.save();
    } catch (err: any) {
      // Convert Mongo duplicate key errors into HTTP Conflict
      if (err && (err.code === 11000 || err.code === 11001)) {
        throw new ConflictException('Product already exists');
      }
      // Convert validation/cast errors into BadRequest instead of 500
      if (
        err?.name === 'ValidationError' ||
        err?.name === 'CastError' ||
        err?.errors
      ) {
        const msg = err?.message || 'Invalid product payload';
        throw new BadRequestException(msg);
      }
      // Let Nest handle other errors (will surface as 500)
      throw err;
    }
  }

  async findBySlug(slug: string) {
    return this.productModel.findOne({ slug }).populate('variants').exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.productModel
      .findById(id)
      .populate('variants')
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    payload: Partial<Product>,
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization - allow both admin and super-admin
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required to update products.',
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    // Check if product exists
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // If slug is being updated, check for duplicates
    if (payload.slug && payload.slug !== existingProduct.slug) {
      const duplicateSlug = await this.productModel
        .findOne({ slug: payload.slug, _id: { $ne: id } })
        .exec();
      if (duplicateSlug) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    // Build update payload with validated price fields
    const updateData: any = { ...payload };
    delete updateData.basePrice;
    delete updateData.salePrice;

    // Validate and convert basePrice if provided
    if (payload.basePrice !== undefined && payload.basePrice !== null) {
      try {
        const priceStr = payload.basePrice.toString().trim();
        if (priceStr !== '' && !priceStr.match(/^\d*\.?\d+$/)) {
          throw new BadRequestException('basePrice must be a valid number');
        }
        if (priceStr !== '') {
          updateData.basePrice = Types.Decimal128.fromString(priceStr);
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('invalid basePrice format');
      }
    }

    // Validate and convert salePrice if provided
    if (payload.salePrice !== undefined && payload.salePrice !== null) {
      try {
        const priceStr = payload.salePrice.toString().trim();
        if (priceStr !== '' && !priceStr.match(/^\d*\.?\d+$/)) {
          throw new BadRequestException('salePrice must be a valid number');
        }
        if (priceStr !== '') {
          updateData.salePrice = Types.Decimal128.fromString(priceStr);
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('invalid salePrice format');
      }
    }

    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
        .populate('variants')
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }

      return updatedProduct;
    } catch (err: any) {
      if (err && (err.code === 11000 || err.code === 11001)) {
        throw new ConflictException('Product with this data already exists');
      }
      if (err.name === 'CastError') {
        throw new BadRequestException(`Invalid value for field: ${err.path}`);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      throw err; // fallback
    }
  }

  async list(query: any = {}) {
    // Supports simple faceted query: colors, sizes, minPrice, maxPrice, category (id or slug)
    const filter: any = {};

    if (query.colors) {
      filter.availableColors = {
        $in: Array.isArray(query.colors) ? query.colors : [query.colors],
      };
    }

    if (query.sizes) {
      filter.availableSizes = {
        $in: Array.isArray(query.sizes) ? query.sizes : [query.sizes],
      };
    }

    if (query.isOnSale !== undefined) {
      filter.isOnSale = query.isOnSale === 'true' || query.isOnSale === true;
    }

    if (query.isNewArrival !== undefined) {
      filter.isNewArrival =
        query.isNewArrival === 'true' || query.isNewArrival === true;
    }

    if (query.isFeatured !== undefined) {
      filter.isFeatured =
        query.isFeatured === 'true' || query.isFeatured === true;
    }

    // price filters operate on basePrice
    if (query.minPrice || query.maxPrice) {
      filter.basePrice = {};
      if (query.minPrice) {
        filter.basePrice.$gte = Types.Decimal128.fromString(
          query.minPrice.toString(),
        );
      }
      if (query.maxPrice) {
        filter.basePrice.$lte = Types.Decimal128.fromString(
          query.maxPrice.toString(),
        );
      }
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const docs = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.productModel.countDocuments(filter);

    return { items: docs, total: count, page, limit };
  }

  async createVariant(
    payload: Partial<ProductVariant> & { productId?: string | Types.ObjectId },
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization - allow both admin and super-admin
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required to create product variants.',
      );
    }

    // productId is required
    if (!payload.productId) {
      throw new BadRequestException('productId required');
    }

    const productIdStr =
      typeof payload.productId === 'string'
        ? payload.productId
        : payload.productId.toString();

    // ensure product exists
    const product = await this.productModel.findById(productIdStr).exec();
    if (!product) {
      throw new NotFoundException('product not found');
    }

    // prevent duplicate SKUs
    if (payload.sku) {
      const existingVariant = await this.variantModel
        .findOne({ sku: payload.sku })
        .exec();
      if (existingVariant) {
        throw new ConflictException('Variant with this sku already exists');
      }
    }

    // validate price if provided
    if (payload.price !== undefined && payload.price !== null) {
      if (typeof payload.price !== 'number' || Number.isNaN(payload.price)) {
        throw new BadRequestException('invalid price');
      }
    }

    // allow callers to pass productId as string (from DTO). Convert to ObjectId for the variant document.
    const docPayload: any = {
      ...payload,
      productId: new Types.ObjectId(productIdStr),
    };

    const v = new this.variantModel(docPayload);
    let saved;
    try {
      saved = await v.save();
    } catch (err: any) {
      if (err && (err.code === 11000 || err.code === 11001)) {
        throw new ConflictException('Variant already exists');
      }
      throw err;
    }

    // update product.variants
    await this.productModel
      .findByIdAndUpdate(productIdStr, { $addToSet: { variants: saved._id } })
      .exec();

    return saved;
  }

  async getVariantById(id: string) {
    return this.variantModel.findById(id).exec();
  }

  async delete(
    id: string,
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization - allow both admin and super-admin
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required to delete products.',
      );
    }

    // Validate ID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    // Check if product exists
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete associated variants first
    if (product.variants && product.variants.length > 0) {
      await this.variantModel
        .deleteMany({ _id: { $in: product.variants } })
        .exec();
    }

    // Delete the product
    await this.productModel.findByIdAndDelete(id).exec();

    return { success: true, message: 'Product deleted successfully' };
  }

  async addImages(
    productId: string,
    images: { url: string; public_id: string; alt?: string; order?: number }[],
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required.',
      );
    }

    // Validate ID
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    // Check if product exists
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Transform the images to match the expected format
    const formattedImages = images.map((img) => ({
      url: img.url,
      alt: img.alt || 'Product image',
      order: img.order || 0,
    }));

    // Add images to the product
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $push: { images: { $each: formattedImages } } },
        { new: true },
      )
      .exec();

    return updatedProduct;
  }

  async removeImage(
    productId: string,
    imageUrl: string,
    user?: { _id: string; email: string; roles: string[] },
  ) {
    // Check user authorization
    if (
      !user ||
      !user.roles ||
      (!user.roles.includes('admin') && !user.roles.includes('super-admin'))
    ) {
      throw new ForbiddenException(
        'Access denied. Admin or super-admin privileges required.',
      );
    }

    // Validate ID
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    // Remove image from product
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $pull: { images: { url: imageUrl } } },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }
}