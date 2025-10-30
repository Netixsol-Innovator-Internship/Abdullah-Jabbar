import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller(['api/documents', 'documents'])
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    const doc = await this.documentService.getDocument(id);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }
}
