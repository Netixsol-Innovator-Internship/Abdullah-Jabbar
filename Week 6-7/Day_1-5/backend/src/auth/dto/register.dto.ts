
// register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';
import { UserRole } from '../../users/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  roles?: UserRole[];

  @IsString()
  @MinLength(4)
  otp: string;
}