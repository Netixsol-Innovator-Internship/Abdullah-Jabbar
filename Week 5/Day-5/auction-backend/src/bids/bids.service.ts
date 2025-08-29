import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';

@Injectable()
export class BidsService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<BidDocument>) {}

  create(bid: Partial<Bid>) {
    const newBid = new this.bidModel(bid);
    return newBid.save();
  }

  findAll() {
    return this.bidModel
      .find()
      .populate('auctionId')
      .populate('bidderId')
      .exec();
  }
}
