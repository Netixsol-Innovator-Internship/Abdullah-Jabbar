import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ExcelService } from './excel.service';

@Module({
  providers: [PdfService, ExcelService],
  exports: [PdfService, ExcelService],
})
export class FilesModule {}
