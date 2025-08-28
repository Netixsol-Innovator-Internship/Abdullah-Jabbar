import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private comments: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createParent(
    @CurrentUser() user: any,
    @Body() body: { postId: string; text: string },
  ) {
    return this.comments.createParent(user.userId, body.postId, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reply')
  async createReply(
    @CurrentUser() user: any,
    @Body() body: { postId: string; parentCommentId: string; text: string },
  ) {
    return this.comments.createReply(
      user.userId,
      body.postId,
      body.parentCommentId,
      body.text,
    );
  }

  @Get('post/:postId')
  async listForPost(
    @Param('postId') postId: string,
    @Query('page') page = '0',
  ) {
    return this.comments.listCommentsForPost(postId, Number(page));
  }

  @Get('replies/:parentId')
  async replies(
    @Param('parentId') parentId: string,
    @Query('page') page = '0',
  ) {
    return this.comments.fetchReplies(parentId, Number(page));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.comments.getById(id);
  }
}
