import { IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  icon?: string;
}
