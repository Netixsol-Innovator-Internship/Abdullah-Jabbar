
// checkout.dto.ts
import {
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  street1: string;

  @IsString()
  @IsOptional()
  street2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class CheckoutDto {
  @IsString()
  @IsOptional()
  cartId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  useCustomForm?: boolean;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
