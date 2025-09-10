import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private reviews: ReviewService) {}

  @Post('create')
  async createParent(
    @Body()
    body: {
      postId: string;
      text: string;
      authorId?: string;
      authorName?: string;
      rating?: number;
    },
  ) {
    // Use provided author info or default to anonymous
    const authorId = body.authorId || 'anonymous';
    const authorName = body.authorName || 'Anonymous User';
    const rating = body.rating || 5; // Default to 5 stars if not provided
    return this.reviews.createParent(
      authorId,
      body.postId,
      body.text,
      authorName,
      rating,
    );
  }

  @Post('reply')
  async createReply(
    @Body()
    body: {
      postId: string;
      parentReviewId: string;
      text: string;
      authorId?: string;
      authorName?: string;
    },
  ) {
    const authorId = body.authorId || 'anonymous';
    const authorName = body.authorName || 'Anonymous User';
    const reply = await this.reviews.createReply(
      authorId,
      body.postId,
      body.parentReviewId,
      body.text,
      authorName,
    );
    return { reply }; // Wrap in object to match frontend expectation
  }

  @Get('post/:postId')
  async listForPost(
    @Param('postId') postId: string,
    @Query('page') page = '0',
  ) {
    return this.reviews.listReviewsForPost(postId, Number(page));
  }

  @Get('replies/:parentId')
  async replies(
    @Param('parentId') parentId: string,
    @Query('page') page = '0',
  ) {
    return this.reviews.fetchReplies(parentId, Number(page));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.reviews.getById(id);
  }
}
