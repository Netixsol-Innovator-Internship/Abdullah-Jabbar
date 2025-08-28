import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UserController {
  constructor(private users: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    return this.users.findPublicById(user.userId);
  }

  @Get('by-id/:id')
  async byId(@Param('id') id: string) {
    return this.users.findPublicById(id);
  }

  @Get('by-username/:username')
  async byUsername(@Param('username') username: string) {
    return this.users.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@CurrentUser() user: any, @Body() body: any) {
    return this.users.updateProfile(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const id = uuidv4();
          const ext = file.originalname.split('.').pop();
          cb(null, `${id}.${ext}`);
        },
      }),
    }),
  )
  async uploadProfile(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = file.filename; // ideally serve static folder or S3
    return this.users.updateProfile(user.userId, { profilePicture: url });
  }
}
