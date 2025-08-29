// categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(category: Partial<Category>) {
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  findAll() {
    return this.categoryModel.find().exec();
  }
}
