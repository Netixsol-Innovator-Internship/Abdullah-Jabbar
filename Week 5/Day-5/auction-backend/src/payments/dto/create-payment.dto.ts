import {
  IsMongoId,
  IsNumber,
  IsEnum,
  IsDate,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePaymentDto {
  @IsMongoId()
  auctionId: Types.ObjectId;

  @IsMongoId()
  buyerId: Types.ObjectId;

  @IsNumber()
  amountPaid: number;

  @IsEnum(['pending', 'inTransit', 'delivered', 'completed'])
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  paymentDate?: Date;

  @IsArray()
  @IsOptional()
  deliveryUpdates?: { status: string; updatedAt: Date }[];

  @IsString()
  @IsOptional()
  transactionID?: string;
}
