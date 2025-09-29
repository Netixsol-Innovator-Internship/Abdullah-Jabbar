import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('format') format: string,
  ) {
    this.logger.log(
      `Upload request received - file=${file?.originalname ?? 'none'} size=${file?.size ?? 0} format=${format}`,
    );

    if (!file) {
      this.logger.warn('Upload failed: file required');
      throw new BadRequestException('file required');
    }
    if (!format || !['test', 'odi', 't20'].includes(format)) {
      this.logger.warn(`Upload failed: invalid format='${format}'`);
      throw new BadRequestException('format must be one of test|odi|t20');
    }

    const result = await this.uploadService.importCsv(
      file.buffer,
      format as 'test' | 'odi' | 't20',
    );

    this.logger.log(
      `Upload processed - imported=${result.importedCount} ` +
        `upserted=${result.upsertedCount} inserted=${result.insertedCount} ` +
        `modified=${result.modifiedCount}`,
    );

    return {
      imported: result.importedCount,
      upserted: result.upsertedCount,
      inserted: result.insertedCount,
      modified: result.modifiedCount,
    };
  }
}
