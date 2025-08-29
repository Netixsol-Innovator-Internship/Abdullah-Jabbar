import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  create(createAuctionDto: CreateAuctionDto) {
    const newAuction = new this.auctionModel(createAuctionDto);
    return newAuction.save();
  }

  findAll() {
    return this.auctionModel.find().populate('car').exec();
  }

  findOne(id: string) {
    return this.auctionModel.findById(id).populate('car').exec();
  }
}
