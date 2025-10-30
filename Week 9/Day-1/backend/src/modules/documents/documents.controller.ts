import { Controller, Post, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UploadDocDto } from '../../common/dto/upload-doc.dto';

@Controller('upload')
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Post()
  async upload(@Body() dto: UploadDocDto) {
    const doc = await this.docs.create(dto);
    return { ok: true, doc };
  }
}
