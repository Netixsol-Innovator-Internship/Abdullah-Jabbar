// cv.controller.ts
import { Body, Controller, Post, Res, Query } from '@nestjs/common';
import { CvService } from './cv.service';
import type { Response } from 'express';

@Controller('api/cv')
export class CvController {
  constructor(private readonly svc: CvService) {}

  @Post('preview')
  preview(@Body() payload: any) {
    // returns rendered HTML for preview if needed
    return this.svc.renderHtml(payload);
  }

  @Post('generate')
  async generate(
    @Body() payload: any,
    @Res() res: Response,
    @Query('format') format: string,
    @Query('fmt') fmtAlias: string,
  ) {
    // Accept either ?format=docx or ?fmt=docx
    const fmt = (format || fmtAlias || 'pdf').toLowerCase();

    // sanitize filename to allow only safe chars
    const rawName = String(
      (payload as { fullName?: string })?.fullName || 'candidate',
    );
    const safeName = rawName.replace(/[^a-zA-Z0-9-_.]/g, '_');

    switch (fmt) {
      case 'pdf': {
        const pdfBuf = await this.svc.generatePdf(payload);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${safeName}_CV.pdf"`,
        );
        res.end(pdfBuf); // ✅ use end for binary
        break;
      }
      case 'docx': {
        const docxBuf = await this.svc.generateDocx(payload);
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${safeName}_CV.docx"`,
        );
        res.end(docxBuf); // ✅ use end for binary
        break;
      }
      default: {
        // fallback: PDF
        const pdfBuf = await this.svc.generatePdf(payload);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${safeName}_CV.pdf"`,
        );
        res.end(pdfBuf); // ✅ use end for binary
        break;
      }
    }
  }
}