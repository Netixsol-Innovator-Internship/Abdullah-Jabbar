import { IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWishlistDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  carIds: Types.ObjectId[];
}
