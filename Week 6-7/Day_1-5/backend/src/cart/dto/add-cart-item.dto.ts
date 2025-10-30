
// add-cart-item.dto.ts
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsObject()
  selectedOptions?: Record<string, any>;

  // Legacy fields for backward compatibility
  @IsOptional()
  @IsString()
  variantId?: string;

  @IsOptional()
  @IsNumber()
  qty?: number;
}
