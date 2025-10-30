
// products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { Product } from './schemas/product.schema';
import { ProductVariant } from './schemas/product-variant.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { memoryStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(
    private svc: ProductsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async list(@Query() q: any) {
    return this.svc.list(q);
  }

  @Get('id/:id')
  async getById(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super-admin')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() body: CreateProductDto,
    @Request() req: { user?: { _id: string; email: string; roles: string[] } },
  ) {
    return await this.svc.create(body as any, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super-admin')
  @Put('id/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Product>,
    @Request() req: { user?: { _id: string; email: string; roles: string[] } },
  ) {
    return await this.svc.update(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super-admin')
  @Post('variants')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createVariant(
    @Body() body: CreateProductVariantDto,
    @Request() req: { user?: { _id: string; email: string; roles: string[] } },
  ) {
    const saved = await this.svc.createVariant(
      body as Partial<ProductVariant> & { productId?: string },
      req.user,
    );
    return { status: 'success', message: 'variant created', data: saved };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super-admin')
  @Delete('id/:id')
  async delete(
    @Param('id') id: string,
    @Request() req: { user?: { _id: string; email: string; roles: string[] } },
  ) {
    await this.svc.delete(id, req.user);
    return { success: true, message: 'Product deleted successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super-admin')
  @Post('upload-images/:id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
      },
    }),
  )
  async uploadProductImages(
    @Param('id') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: { user?: { _id: string; email: string; roles: string[] } },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    try {
      const uploadedImages = await this.cloudinaryService.uploadMultipleImages(
        files,
        'products',
      );

      // Update the product with new images
      const updatedProduct = await this.svc.addImages(
        productId,
        uploadedImages,
        req.user,
      );

      return {
        success: true,
        message: 'Images uploaded successfully',
        images: uploadedImages,
        product: updatedProduct,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload images: ' + error.message,
      );
    }
  }
}