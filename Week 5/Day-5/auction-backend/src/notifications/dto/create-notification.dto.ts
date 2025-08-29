import { IsString, IsMongoId, IsBoolean, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNotificationDto {
  @IsString()
  type: string;

  @IsString()
  message: string;

  @IsMongoId()
  @IsOptional()
  userId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  auctionId?: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
