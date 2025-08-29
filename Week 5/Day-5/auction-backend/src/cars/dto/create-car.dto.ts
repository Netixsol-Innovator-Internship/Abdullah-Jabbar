import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCarDto {
  @IsMongoId()
  sellerId: Types.ObjectId;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  year: number;

  @IsEnum(['sedan', 'sports', 'hatchback', 'convertible'])
  bodyType: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsNumber()
  startingPrice: number;

  @IsNumber()
  @IsOptional()
  currentPrice?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  bids?: Types.ObjectId[];

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
