import { Controller, Post, Param, Get, Body } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private likes: LikesService) {}

  @Post('toggle/:reviewId')
  async toggle(
    @Param('reviewId') reviewId: string,
    @Body() body?: { userId?: string },
  ) {
    const userId = body?.userId || 'anonymous';
    const is = await this.likes.isLiked(userId, reviewId);
    if (is) {
      return this.likes.unlike(userId, reviewId);
    } else {
      return this.likes.like(userId, reviewId);
    }
  }

  @Get('is-liked/:reviewId')
  async isLiked(
    @Param('reviewId') reviewId: string,
    @Body() body?: { userId?: string },
  ) {
    const userId = body?.userId || 'anonymous';
    return { liked: await this.likes.isLiked(userId, reviewId) };
  }
}
