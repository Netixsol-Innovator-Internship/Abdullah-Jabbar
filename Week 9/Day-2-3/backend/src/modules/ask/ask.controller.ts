import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AskService } from './ask.service';
import { MemoryService } from '../../services/memory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ask')
export class AskController {
  constructor(
    private readonly askService: AskService,
    private readonly memoryService: MemoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async ask(
    @Body() body: { question?: string; userId?: string },
    @Request() req,
  ) {
    try {
      if (!body?.question) throw new BadRequestException('question required');
      const userId = req.user._id;
      return this.askService.handleQuestion(body.question, userId);
    } catch (error) {
      console.error('Error in ask endpoint:', error);
      throw error;
    }
  }

  // Temporary endpoint for testing without auth
  @Post('test')
  async askTest(@Body() body: { question?: string; userId?: string }) {
    try {
      if (!body?.question) throw new BadRequestException('question required');
      const userId = body.userId || 'test-user';
      return this.askService.handleQuestion(body.question, userId);
    } catch (error) {
      console.error('Error in ask test endpoint:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string, @Request() req) {
    console.log('getHistory called with userId:', userId);
    console.log('req.user._id:', req.user._id.toString());

    // Ensure users can only access their own history
    if (userId !== req.user._id.toString()) {
      console.log(
        'Access denied for userId:',
        userId,
        'vs req.user._id:',
        req.user._id.toString(),
      );
      throw new BadRequestException('Access denied');
    }
    return this.memoryService.getConversationHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string, @Request() req) {
    console.log('getSummary called with userId:', userId);
    console.log('req.user._id:', req.user._id.toString());
    console.log('Match:', userId === req.user._id.toString());

    // Ensure users can only access their own summary
    if (userId !== req.user._id.toString()) {
      console.log(
        'Access denied for userId:',
        userId,
        'vs req.user._id:',
        req.user._id.toString(),
      );
      throw new BadRequestException('Access denied');
    }
    return this.memoryService.getSummary(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history/:userId')
  async clearHistory(@Param('userId') userId: string, @Request() req) {
    if (userId !== req.user._id.toString()) {
      throw new BadRequestException('Access denied');
    }

    await this.memoryService.clearConversationHistory(userId);
    return { success: true };
  }
}
