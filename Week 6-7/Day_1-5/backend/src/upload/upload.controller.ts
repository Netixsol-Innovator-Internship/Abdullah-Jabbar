
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('single')
  @UseInterceptors(
    FileInterceptor('image', {
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
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, 'products');
      return {
        success: true,
        url: result.url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }

  @Post('multiple')
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
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(
        files,
        'products',
      );
      return {
        success: true,
        images: results,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload images: ' + error.message,
      );
    }
  }

  @Post('delete')
  async deleteImage(@Body('public_id') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    try {
      await this.cloudinaryService.deleteImage(publicId);
      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete image: ' + error.message);
    }
  }
}
