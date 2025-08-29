import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }])],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
