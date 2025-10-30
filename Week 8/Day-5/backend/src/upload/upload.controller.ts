// File: src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { UploadService } from './upload.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('api')
@UseGuards(ApiKeyGuard)
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 28 * 1024 * 1024, // Adjust to slightly below 30MB for Vercel's limits
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const requestId = uuidv4();
    const filename = `${uuidv4()}${extname(file.originalname)}`;

    this.logger.log(`Upload received: ${filename} - Request ID: ${requestId}`);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Check PDF page count before processing (this is done by the processing service)
      // We'll let the error handling in processDocumentFromBuffer detect large PDFs
      const result = await this.uploadService.processDocumentFromBuffer(
        file.buffer,
        file.originalname,
        filename,
        requestId,
      );

      this.logger.log(
        `Upload complete: ${result.docId} - Request ID: ${requestId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Upload failed: ${error.message} - Request ID: ${requestId}`,
      );

      // Check for specific error types
      if (error.message && error.message.includes('too many pages')) {
        throw new BadRequestException({
          error: 'Document too large',
          errorId: requestId,
          message:
            'This PDF has too many pages. Maximum allowed is 100 pages. Please upload a document with fewer pages.',
        });
      } else if (error.message && error.message.includes('timeout')) {
        throw new BadRequestException({
          error: 'Processing timeout',
          errorId: requestId,
          message:
            'The document took too long to process. Please try a smaller document.',
        });
      } else {
        throw new BadRequestException({
          error: 'Failed to process document',
          errorId: requestId,
          message:
            error.message ||
            'An unknown error occurred while processing the document',
        });
      }
    }
  }
}
