import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SearchProductDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class AiSearchDto {
  @IsString()
  query: string;
}

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  productId?: string;
}

export class SymptomCheckDto {
  @IsString()
  symptom: string;
}
