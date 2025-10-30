
// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Logger,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PreRegisterDto } from './dto/pre-register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('pre-register')
  async preRegister(@Body() body: PreRegisterDto) {
    return await this.authService.preRegister(body.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { email: string; otp: string }) {
    return await this.authService.verifyEmail(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  me(@Request() req: { user?: unknown }) {
    return req.user ?? {};
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: { user?: any }) {
    if (!req.user) {
      throw new BadRequestException('User not authenticated');
    }
    return this.authService.refreshToken(req.user);
  }

  // Google OAuth routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: any, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user);
    // Redirect to frontend callback page with token
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${access_token}`,
    );
  }

  // GitHub OAuth routes
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Guard redirects to GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req: any, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user);
    // Redirect to frontend callback page with token
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${access_token}`,
    );
  }

  // Discord OAuth routes
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Guard redirects to Discord
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  discordCallback(@Req() req: any, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user);
    // Redirect to frontend callback page with token
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${access_token}`,
    );
  }
}