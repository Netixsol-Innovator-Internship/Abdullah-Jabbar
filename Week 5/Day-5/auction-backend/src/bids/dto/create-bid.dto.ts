import { IsDate, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBidDto {
  @IsMongoId()
  auctionId: Types.ObjectId;

  @IsMongoId()
  bidderId: Types.ObjectId;

  @IsNumber()
  amount: number;

  @IsDate()
  @IsOptional()
  placedAt?: Date;
}
