// wishlist.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  create(wishlist: Partial<Wishlist>) {
    const newWishlist = new this.wishlistModel(wishlist);
    return newWishlist.save();
  }

  findAll() {
    return this.wishlistModel
      .find()
      .populate('userId')
      .populate('auctionIds')
      .exec();
  }
}
