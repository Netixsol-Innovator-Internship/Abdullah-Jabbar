
// users.controller.ts
import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() req: any) {
    return { message: 'Test endpoint working', userId: req.user._id };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/address')
  async updateAddress(
    @Request() req: any,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    // update address

    try {
      const result = await this.usersService.updateUserAddress(
        req.user._id,
        updateAddressDto,
      );
      return result;
    } catch (error) {
      console.error('Address update failed:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/address/:addressIndex')
  async deleteAddress(
    @Request() req: any,
    @Param('addressIndex') addressIndex: string,
  ) {
    try {
      const result = await this.usersService.deleteUserAddress(
        req.user._id,
        parseInt(addressIndex),
      );
      // address delete successful
      return result;
    } catch (error) {
      console.error('Address delete failed:', error);
      throw error;
    }
  }
}