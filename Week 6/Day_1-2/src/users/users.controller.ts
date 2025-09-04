import { Controller, Get, Body, Post, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async all() {
    return this.usersService.list();
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    // For admin creation flow - otherwise use auth/register
    // NOTE: hashing absent here on purpose; call UsersService.create with hashed pass elsewhere
    return { message: 'Use /auth/register to create account' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }
}