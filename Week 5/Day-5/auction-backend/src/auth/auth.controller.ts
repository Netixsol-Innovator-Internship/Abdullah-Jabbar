import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.authService.findUserByUsername(loginDto.username);
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(
        registerDto.username,
        registerDto.email,
        registerDto.password,
      );
      // After registration, get the full user document for login
      const fullUser = await this.authService.findUserByUsername(
        registerDto.username,
      );
      if (!fullUser) {
        throw new HttpException(
          'Registration failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return this.authService.login(fullUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Username or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
