/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private users: UserService,
  ) {}

  @Post('register') 
  async register(@Body() dto: RegisterDto) {
    // hash password
    console.log('register route hit');
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      return { error: 'Email already used' };
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      username: dto.username,
      email: dto.email,
      bio: dto.bio || '',
      passwordHash,
    });
    console.log('user', user);
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }
}
