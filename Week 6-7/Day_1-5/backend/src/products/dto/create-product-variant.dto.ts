
// create-product-variant.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  reserved?: number;

  @IsOptional()
  attributes?: Record<string, any>;
}
