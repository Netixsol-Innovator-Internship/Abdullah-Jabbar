// pagination.dto.ts
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}