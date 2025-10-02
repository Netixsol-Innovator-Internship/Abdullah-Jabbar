import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { ChatMessageDto } from '../shared/dtos/product.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly symptomCheckerService: SymptomCheckerService,
  ) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatMessageDto) {
    // Check for symptom hints
    const symptomMapping = await this.symptomCheckerService.findMapping(
      chatDto.message,
    );

    // Convert symptom mapping to the format expected by AI service
    const symptomHint =
      symptomMapping.categories.length > 0
        ? {
            symptom: chatDto.message,
            category: symptomMapping.categories[0], // Use first category as primary hint
          }
        : undefined;

    // Use the new processUserQuery method with symptom hints
    return this.aiService.processUserQuery(
      chatDto.message,
      chatDto.productId,
      symptomHint,
    );
  }

  // Keep the legacy method for backwards compatibility
  @Post('chat-legacy')
  async chatLegacy(@Body() chatDto: ChatMessageDto) {
    return this.aiService.chatSupport(chatDto.message, chatDto.productId);
  }

  @Get('test-api-key')
  async testApiKey() {
    return this.aiService.testApiConnection();
  }
}
