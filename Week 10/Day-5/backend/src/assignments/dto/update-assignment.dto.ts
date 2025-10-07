import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsNumber()
  wordCount?: number;

  @IsOptional()
  @IsEnum(['strict', 'loose'])
  mode?: 'strict' | 'loose';
}
