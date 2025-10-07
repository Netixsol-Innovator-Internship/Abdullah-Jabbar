import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  instructions: string; // Changed from 'topic' to match prompt requirements

  @Type(() => Number)
  @IsInt()
  @Min(0)
  wordCount: number;

  @IsIn(['strict', 'loose'])
  mode: 'strict' | 'loose'; // Changed from 'evaluationMode' to match prompt
}
