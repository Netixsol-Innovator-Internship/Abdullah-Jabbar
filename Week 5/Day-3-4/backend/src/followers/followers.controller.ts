import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Inject } from '@nestjs/common';

@Controller('followers')
export class FollowersController {
  constructor(private followers: FollowersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:targetId')
  async toggleFollow(
    @CurrentUser() user: any,
    @Param('targetId') targetId: string,
  ) {
    const isFollowing = await this.followers.isFollowing(user.userId, targetId);
    if (isFollowing) {
      await this.followers.unfollow(user.userId, targetId);
      return { isFollowing: false };
    } else {
      await this.followers.follow(user.userId, targetId);
      return { isFollowing: true };
    }
  }

  @Get('followers/:userId')
  async followersList(
    @Param('userId') userId: string,
    @Query('page') page = '0',
  ) {
    return this.followers.listFollowers(userId, Number(page));
  }

  @Get('following/:userId')
  async followingList(
    @Param('userId') userId: string,
    @Query('page') page = '0',
  ) {
    return this.followers.listFollowing(userId, Number(page));
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-following/:targetId')
  async isFollowing(
    @CurrentUser() user: any,
    @Param('targetId') targetId: string,
  ) {
    return {
      isFollowing: await this.followers.isFollowing(user.userId, targetId),
    };
  }
}
