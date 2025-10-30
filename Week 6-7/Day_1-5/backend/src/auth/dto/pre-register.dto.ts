
import { IsEmail } from 'class-validator';

export class PreRegisterDto {
  @IsEmail()
  email: string;
}
