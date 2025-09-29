import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestMatch } from '../../models/test-match.schema';
import { OdiMatch } from '../../models/odi-match.schema';
import { T20Match } from '../../models/t20-match.schema';
import { csvStreamImport } from '../../utils/csv-importer';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectModel(TestMatch.name) private testMatchModel: Model<TestMatch>,
    @InjectModel(OdiMatch.name) private odiMatchModel: Model<OdiMatch>,
    @InjectModel(T20Match.name) private t20MatchModel: Model<T20Match>,
  ) {}

  /**
   * Optimized streaming CSV import with minimal memory usage
   */
  async importCsv(buffer: Buffer, format: 'test' | 'odi' | 't20') {
    const startTime = Date.now();
    this.logger.log(
      `Starting streaming import, format: ${format}, size: ${buffer.length} bytes`,
    );

    try {
      const result = await csvStreamImport(buffer, format);
      const duration = Date.now() - startTime;

      this.logger.log(
        `Streaming import completed in ${duration}ms - ` +
          `imported: ${result.importedCount}, ` +
          `upserted: ${result.upsertedCount}, ` +
          `inserted: ${result.insertedCount}, ` +
          `modified: ${result.modifiedCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Streaming import failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
