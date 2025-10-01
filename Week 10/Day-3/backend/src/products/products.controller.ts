import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { SearchProductDto, AiSearchDto } from '../shared/dtos/product.dto';
import { AiService } from '../ai/ai.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  async search(@Query() searchDto: SearchProductDto) {
    return this.productsService.search(searchDto);
  }

  @Post('ai-search')
  async aiSearch(@Body() aiSearchDto: AiSearchDto) {
    return this.aiService.intentSearch(aiSearchDto.query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }
}
