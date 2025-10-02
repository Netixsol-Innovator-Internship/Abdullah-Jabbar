import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  SymptomCheckerService,
  SymptomCheckerResponse,
} from './symptom-checker.service';
import { SymptomCheckDto } from '../shared/dtos/product.dto';

@Controller('symptom-checker')
@UseGuards(JwtAuthGuard)
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post('')
  async checkSymptom(
    @Body() symptomCheckDto: SymptomCheckDto,
  ): Promise<SymptomCheckerResponse> {
    return this.symptomCheckerService.detectSymptom(symptomCheckDto.symptom);
  }

  @Get('available-symptoms')
  getAvailableSymptoms() {
    return {
      symptoms: this.symptomCheckerService.getAvailableSymptoms(),
      total: this.symptomCheckerService.getAvailableSymptoms().length,
    };
  }

  @Post('add-mapping')
  async addSymptomMapping(
    @Body() body: { symptom: string; categories: string[] },
  ) {
    this.symptomCheckerService.addSymptomMapping(body.symptom, body.categories);
    return {
      success: true,
      message: `Added mapping for "${body.symptom}" to categories: ${body.categories.join(', ')}`,
    };
  }
}
