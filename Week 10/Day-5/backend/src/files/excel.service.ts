import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Submission } from '../assignments/entities/submission.entity';
import * as path from 'path';
import * as fs from 'fs';
import { OUTPUT_DIR } from '../common/constants';

@Injectable()
export class ExcelService {
  async generateMarksSheet(
    submissions: Submission[],
    assignmentTopic: string,
  ): Promise<string> {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Marks Sheet');

    // Define columns
    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Remarks', key: 'remarks', width: 50 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Add data rows
    submissions.forEach((submission) => {
      worksheet.addRow({
        studentName: submission.studentName,
        rollNumber: submission.rollNumber,
        score: submission.score ?? 'N/A',
        remarks: submission.remarks ?? 'Not evaluated',
        status: submission.status,
      });
    });

    // Auto-fit columns (alternative approach)
    worksheet.columns.forEach((column) => {
      if (column.header) {
        column.width = Math.max(
          column.width || 10,
          column.header.toString().length + 2,
        );
      }
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Sanitize topic: replace any non-alphanumeric sequences with underscore,
    // collapse multiple underscores and trim leading/trailing underscores
    let sanitizedTopic = (assignmentTopic || '')
      .toString()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!sanitizedTopic) sanitizedTopic = 'assignment';
    const filename = `${sanitizedTopic}_marks_sheet_${timestamp}.xlsx`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Write to file
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  async generateCSV(
    submissions: Submission[],
    assignmentTopic: string,
  ): Promise<string> {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Create CSV content
    const headers = [
      'Student Name',
      'Roll Number',
      'Score',
      'Remarks',
      'Status',
    ];
    const rows = submissions.map((submission) => [
      submission.studentName,
      submission.rollNumber,
      submission.score ?? 'N/A',
      submission.remarks ?? 'Not evaluated',
      submission.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Sanitize topic similar to XLSX generator
    let sanitizedTopic = (assignmentTopic || '')
      .toString()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!sanitizedTopic) sanitizedTopic = 'assignment';
    const filename = `${sanitizedTopic}_marks_sheet_${timestamp}.csv`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Write to file
    fs.writeFileSync(filePath, csvContent, 'utf-8');

    return filePath;
  }
}
