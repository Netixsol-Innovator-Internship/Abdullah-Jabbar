import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  identifier: string; // This can be either username or email

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  mobileNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}
