import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateAuctionDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  car: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsEnum(['upcoming', 'live', 'ended', 'completed'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  currentPrice?: number;

  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  winningBid?: Types.ObjectId;
}
