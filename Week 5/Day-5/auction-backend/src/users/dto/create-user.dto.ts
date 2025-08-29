import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

// A DTO (Data Transfer Object) is a class that defines the shape of the data
// that is being transferred between the client and the server.
// Here, it validates the incoming request body for the user creation endpoint.
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // MinLength ensures the password is at least 8 characters long for security.
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  passwordHash: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile picture must be a valid URL.' })
  profilePicture?: string;
}
