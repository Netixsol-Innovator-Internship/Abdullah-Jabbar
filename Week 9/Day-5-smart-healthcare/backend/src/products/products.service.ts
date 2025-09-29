import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { SearchProductDto } from '../shared/dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<{ products: Product[]; totalPages: number }> {
    const products = await this.productModel.find().exec();
    return {
      products,
      totalPages: 1, // Since we're returning all products at once
    };
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async search(
    searchDto: SearchProductDto,
  ): Promise<{ products: Product[]; total: number }> {
    const query: any = {};

    if (searchDto.query) {
      query.$or = [
        { name: { $regex: searchDto.query, $options: 'i' } },
        { description: { $regex: searchDto.query, $options: 'i' } },
        { category: { $regex: searchDto.query, $options: 'i' } },
      ];
    }

    if (searchDto.category) {
      query.category = { $regex: searchDto.category, $options: 'i' };
    }

    if (searchDto.minPrice || searchDto.maxPrice) {
      query.price = {};
      if (searchDto.minPrice) query.price.$gte = searchDto.minPrice;
      if (searchDto.maxPrice) query.price.$lte = searchDto.maxPrice;
    }

    const products = await this.productModel.find(query).exec();

    return {
      products,
      total: products.length,
    };
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({ category: { $regex: category, $options: 'i' } })
      .exec();
  }

  async findByIngredients(ingredients: string[]): Promise<Product[]> {
    return this.productModel
      .find({
        ingredients: { $in: ingredients.map((ing) => new RegExp(ing, 'i')) },
      })
      .exec();
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category').exec();
    return categories.sort();
  }

  async getBrands(): Promise<string[]> {
    const brands = await this.productModel.distinct('brand').exec();
    return brands.sort();
  }

  async clearAll(): Promise<void> {
    await this.productModel.deleteMany({}).exec();
  }
}
