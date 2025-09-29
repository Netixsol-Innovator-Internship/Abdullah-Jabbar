import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Model } from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { TestMatch } from '../models/test-match.schema';
import { OdiMatch } from '../models/odi-match.schema';
import { T20Match } from '../models/t20-match.schema';
import { INestApplicationContext } from '@nestjs/common';

/**
 * Optimized Streaming CSV Import
 * - Uses streaming CSV parser to reduce memory usage
 * - Processes records in batches with bulkWrite for maximum performance
 * - Minimal memory footprint for large files
 */

type ImportResult = {
  importedCount: number;
  upsertedCount: number;
  insertedCount: number;
  modifiedCount: number;
};

const BATCH_SIZE = 2000;

function parseDate(dateRaw: string): Date | null {
  const d = new Date(dateRaw);
  if (isNaN(d.getTime())) return null;
  return d;
}

function normalizeRecord(record: Record<string, any>) {
  const team = (
    record.team ||
    record.Team ||
    record.TEAM ||
    record['team']
  )?.trim();

  const opposition =
    record.opposition ||
    record.Opposition ||
    record['Opposition'] ||
    record['opposition'] ||
    null;

  // Handle normalized fields from the cleaned CSV
  const runs =
    record.runs || record.Runs ? Number(record.runs || record.Runs) : undefined;
  const wickets =
    record.wickets || record.Wickets
      ? Number(record.wickets || record.Wickets)
      : undefined;
  const overs =
    record.overs || record.Overs
      ? Number(record.overs || record.Overs)
      : undefined;
  const balls =
    record.balls || record.Balls
      ? Number(record.balls || record.Balls)
      : undefined;
  const balls_per_over =
    record.balls_per_over || record.BallsPerOver
      ? Number(record.balls_per_over || record.BallsPerOver)
      : undefined;

  const rpo =
    record.rpo || record.RPO ? Number(record.rpo || record.RPO) : undefined;
  const inns =
    record.inns || record.Inns ? Number(record.inns || record.Inns) : undefined;
  const lead =
    record.lead || record.Lead ? Number(record.lead || record.Lead) : undefined;
  const result = record.result || record.Result || null;
  const ground = record.ground || record.Ground || null;

  // Parse date fields
  const dateCandidates = [
    'start_date',
    'date',
    'Start Date',
    'Start_Date',
    'startDate',
  ];
  let start_date: Date | null = null;
  for (const c of dateCandidates) {
    if (record[c]) {
      const p = parseDate(String(record[c]));
      if (p) {
        start_date = p;
        break;
      }
    }
  }

  // Capture extra columns
  const extra: Record<string, any> = {};
  const recordKeys = Object.keys(record);
  for (const k of recordKeys) {
    if (
      /^Unnamed/.test(k) ||
      ![
        'team',
        'Team',
        'TEAM',
        'opposition',
        'Opposition',
        'runs',
        'Runs',
        'wickets',
        'Wickets',
        'balls',
        'Balls',
        'balls_per_over',
        'BallsPerOver',
        'rpo',
        'RPO',
        'inns',
        'Inns',
        'lead',
        'Lead',
        'result',
        'ground',
        'date',
        'start_date',
      ].includes(k)
    ) {
      extra[k] = record[k];
    }
  }

  const doc: any = {
    team,
    opposition,
    runs: isNaN(Number(runs)) ? undefined : Number(runs),
    wickets: isNaN(Number(wickets)) ? undefined : Number(wickets),
    overs: isNaN(Number(overs)) ? undefined : Number(overs),
    balls: isNaN(Number(balls)) ? undefined : Number(balls),
    balls_per_over: isNaN(Number(balls_per_over))
      ? undefined
      : Number(balls_per_over),
    rpo: isNaN(Number(rpo)) ? undefined : Number(rpo),
    inns: isNaN(Number(inns)) ? undefined : Number(inns),
    lead: isNaN(Number(lead)) ? undefined : Number(lead),
    result,
    ground,
    start_date: start_date ? start_date : undefined,
    extra_cols: extra,
  };

  // Create upsert key
  const key: any = { team };
  if (start_date) key.start_date = start_date;
  if (typeof inns === 'number') key.inns = inns;
  if (opposition) key.opposition = opposition;

  return { doc, key };
}

export async function csvStreamImport(
  buffer: Buffer,
  format: 'test' | 'odi' | 't20',
): Promise<ImportResult> {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(AppModule, { logger: false });

  let modelName: string;
  switch (format) {
    case 'test':
      modelName = TestMatch.name;
      break;
    case 'odi':
      modelName = OdiMatch.name;
      break;
    case 't20':
      modelName = T20Match.name;
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const matchModel = app.get<Model<any>>(getModelToken(modelName));

  return new Promise((resolve, reject) => {
    const results = {
      importedCount: 0,
      upsertedCount: 0,
      insertedCount: 0,
      modifiedCount: 0,
    };

    const batch: any[] = [];
    let isProcessing = false;

    // Create readable stream from buffer
    const stream = Readable.from(buffer.toString('utf8'));

    // Configure CSV parser for streaming
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const processBatch = async () => {
      if (batch.length === 0 || isProcessing) return;

      isProcessing = true;
      const currentBatch = batch.splice(0, BATCH_SIZE);

      try {
        const bulkOps = currentBatch.map(({ doc, key }) => ({
          updateOne: {
            filter: key,
            update: { $set: doc },
            upsert: true,
          },
        }));

        const result = await matchModel.bulkWrite(bulkOps, {
          ordered: false,
          writeConcern: { w: 1, j: false },
        });

        results.upsertedCount += result.upsertedCount || 0;
        results.insertedCount += result.insertedCount || 0;
        results.modifiedCount += result.modifiedCount || 0;
      } catch (error) {
        isProcessing = false;
        reject(error);
        return;
      }

      isProcessing = false;

      // Process next batch if available
      if (batch.length >= BATCH_SIZE) {
        setImmediate(processBatch);
      }
    };

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        results.importedCount++;
        const normalized = normalizeRecord(record);
        batch.push(normalized);

        // Process batch when it reaches the batch size
        if (batch.length >= BATCH_SIZE) {
          processBatch();
        }
      }
    });

    parser.on('error', (err) => {
      reject(err);
    });

    parser.on('end', async () => {
      try {
        // Process remaining records
        while (batch.length > 0 && !isProcessing) {
          await processBatch();
        }

        // Wait for any pending processing to complete
        while (isProcessing) {
          await new Promise((resolve) => setImmediate(resolve));
        }

        await app.close();
        resolve(results);
      } catch (error) {
        await app.close();
        reject(error);
      }
    });

    // Start the stream processing
    stream.pipe(parser);
  });
}
