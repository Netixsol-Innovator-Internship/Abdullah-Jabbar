import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromotionsService {
  constructor(@InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>) {}

  async listActive() {
    const now = new Date();
    return this.promotionModel.find({ isActive: true, $or: [{ startsAt: { $lte: now } }, { startsAt: null }], $or2: [{ endsAt: { $gte: now } }, { endsAt: null }] } as any).exec();
  }
}