import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get()
  async list(@Query() q: any) {
    return this.svc.list(q);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: CreateProductDto) {
    // convert numeric basePrice if provided
    if (body.basePrice !== undefined) {
      // allow numbers or strings; in mongoose we'll store Decimal128 via service conversion
    }
    return this.svc.create(body as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('variants')
  async createVariant(@Body() body: any) {
    return this.svc.createVariant(body);
  }
}