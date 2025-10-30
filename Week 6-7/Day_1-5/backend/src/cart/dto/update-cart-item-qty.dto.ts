
// update-cart-item-qty.dto.ts
import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemQtyDto {
  @IsNumber()
  @Min(0)
  qty: number;
}
