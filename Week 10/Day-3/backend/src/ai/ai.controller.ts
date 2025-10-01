import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { ChatMessageDto } from '../shared/dtos/product.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatMessageDto) {
    return this.aiService.chatSupport(chatDto.message, chatDto.productId);
  }

  @Get('test-api-key')
  async testApiKey() {
    return this.aiService.testApiConnection();
  }
}
