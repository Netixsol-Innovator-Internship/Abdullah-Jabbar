import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('likes')
export class LikesController {
  constructor(private likes: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:commentId')
  async toggle(
    @CurrentUser() user: any,
    @Param('commentId') commentId: string,
  ) {
    const is = await this.likes.isLiked(user.userId, commentId);
    if (is) {
      return this.likes.unlike(user.userId, commentId);
    } else {
      return this.likes.like(user.userId, commentId);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-liked/:commentId')
  async isLiked(
    @CurrentUser() user: any,
    @Param('commentId') commentId: string,
  ) {
    return { liked: await this.likes.isLiked(user.userId, commentId) };
  }
}
