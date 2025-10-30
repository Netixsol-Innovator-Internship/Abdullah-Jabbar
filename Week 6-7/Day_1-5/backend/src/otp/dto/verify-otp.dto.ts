
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 8) // adjust if you change OTP_LENGTH
  otp: string;
}