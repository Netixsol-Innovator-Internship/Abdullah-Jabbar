/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestMatch } from '../models/test-match.schema';
import { OdiMatch } from '../models/odi-match.schema';
import { T20Match } from '../models/t20-match.schema';

/**
 * Execute the validated query (from QueryValidator).
 * Translate sanitized JSON to Mongoose filters (dates -> Date objects).
 */

@Injectable()
export class MongoQueryService {
  constructor(
    @InjectModel(TestMatch.name) private testMatchModel: Model<TestMatch>,
    @InjectModel(OdiMatch.name) private odiMatchModel: Model<OdiMatch>,
    @InjectModel(T20Match.name) private t20MatchModel: Model<T20Match>,
  ) {}

  private _transformFilter(filter: any) {
    const out: any = {};
    for (const k of Object.keys(filter)) {
      const v = filter[k];
      if (k === 'start_date') {
        // v likely has $gte/$lte as ISO strings
        out['start_date'] = {};
        for (const op of Object.keys(v)) {
          out['start_date'][op] = new Date(v[op]);
        }
      } else if (k === 'runs') {
        // translate to runs field
        out['runs'] = v;
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  async execute(sanitized: any) {
    const sanitizedAny: Record<string, any> = sanitized;
    const forceScoreProjection = Boolean(
      sanitizedAny.__forceScoreProjection ?? false,
    );
    if (forceScoreProjection) {
      delete sanitizedAny.__forceScoreProjection;
    }

    // Handle aggregation queries
    if (sanitized.isAggregation && sanitized.pipeline) {
      return this._executeAggregationQuery(sanitized, forceScoreProjection);
    }

    // Regular query execution (existing functionality)
    const filter = this._transformFilter(sanitized.filter || {});
    const projection =
      sanitized.projection && Object.keys(sanitized.projection).length
        ? sanitized.projection
        : null;
    const sort = sanitized.sort || {};
    const limit = Math.min(1000, Number(sanitized.limit || 100));

    // Determine which model to use based on the format in the filter
    let model: Model<any>;

    if (filter.format) {
      // Extract format and remove it from the filter as it's now determined by collection
      const format = filter.format;
      delete filter.format;

      switch (format) {
        case 'test':
          model = this.testMatchModel;
          break;
        case 'odi':
          model = this.odiMatchModel;
          break;
        case 't20':
          model = this.t20MatchModel;
          break;
        default:
          throw new Error(
            `Unsupported format: ${format}. Must be one of: test, odi, t20`,
          );
      }
    } else {
      // Format must be specified
      throw new Error('Format is required. Must be one of: test, odi, t20');
    }

    // Add explicit exclusions for the fields that shouldn't be in the response
    const excludeProjection: Record<string, number> = {
      extra_cols: 0,
      updatedAt: 0,
      createdAt: 0,
      overs_raw: 0,
      score_raw: 0,
      __v: 0,
    };

    // Exclude any field that contains 'raw' in the name
    const schema = model.schema.paths;
    Object.keys(schema).forEach((key) => {
      if (key.toLowerCase().includes('raw')) {
        excludeProjection[key] = 0;
      }
    });

    // Merge with any existing projection while ensuring run totals are available
    let finalProjection: Record<string, number>;

    if (projection && Object.keys(projection).length > 0) {
      const projectionValues = Object.values(projection);
      const hasInclusions = projectionValues.some((value) => value === 1);
      const hasExclusions = projectionValues.some((value) => value === 0);

      if (hasInclusions && !hasExclusions) {
        // Build an inclusion projection that always contains core match context + runs
        const baseProjection: Record<string, number> = {
          _id: 0,
          team: 1,
          opposition: 1,
          ground: 1,
          start_date: 1,
          runs: 1,
          result: 1,
        };

        finalProjection = { ...baseProjection, ...projection };
      } else if (!hasInclusions && hasExclusions) {
        // Pure exclusion projection – make sure runs are not filtered out
        finalProjection = { ...projection, ...excludeProjection };
        if (finalProjection.runs === 0) {
          delete finalProjection.runs;
        }
      } else {
        // Mixed projection – fall back to ensuring the essentials are present
        const baseProjection: Record<string, number> = {
          _id: 0,
          team: 1,
          opposition: 1,
          ground: 1,
          start_date: 1,
          runs: 1,
          result: 1,
        };

        finalProjection = { ...baseProjection, ...projection };
      }
    } else {
      finalProjection = excludeProjection;
    }

    if (forceScoreProjection) {
      const scoreboardProjection = this.getScoreboardProjection();

      if (projection && Object.keys(projection).length > 0) {
        Object.entries(projection).forEach(([key, value]) => {
          if (value === 0 && scoreboardProjection[key] === 1) {
            // Preserve essential scoreboard fields even if projection tries to drop them
            return;
          }
          scoreboardProjection[key] = value as number;
        });
      }

      finalProjection = scoreboardProjection;
    }

    const query = model.find(filter, finalProjection).sort(sort).limit(limit);
    const rows = await query.lean().exec();
    return rows;
  }

  private async _executeAggregationQuery(
    sanitized: {
      pipeline: any[];
      collection?: string;
    },
    forceScoreProjection = false,
  ) {
    // Find the format from the $match stage in the pipeline
    const matchStage = sanitized.pipeline.find(
      (stage) => stage.$match && stage.$match.format,
    );

    if (!matchStage || !matchStage.$match || !matchStage.$match.format) {
      throw new Error(
        'Aggregation pipeline must include a $match stage with a format field',
      );
    }

    // Determine which model to use based on the format in the match stage
    let model: Model<any>;
    const format = matchStage.$match.format;

    // Remove format from match criteria since we'll be using the specific model
    delete matchStage.$match.format;

    switch (format) {
      case 'test':
        model = this.testMatchModel;
        break;
      case 'odi':
        model = this.odiMatchModel;
        break;
      case 't20':
        model = this.t20MatchModel;
        break;
      default:
        throw new Error(
          `Unsupported format: ${format}. Must be one of: test, odi, t20`,
        );
    }

    // Execute the aggregation pipeline
    if (forceScoreProjection) {
      const scoreboardProjection = this.getScoreboardProjection();
      const projectStage = sanitized.pipeline.find((stage) => stage.$project);
      if (projectStage && projectStage.$project) {
        Object.keys(scoreboardProjection).forEach((key) => {
          if (
            projectStage.$project[key] === 0 &&
            scoreboardProjection[key] === 1
          ) {
            return;
          }
          projectStage.$project[key] = scoreboardProjection[key];
        });
      } else {
        sanitized.pipeline.push({ $project: scoreboardProjection });
      }
    }

    const result = await model.aggregate(sanitized.pipeline).exec();
    return result;
  }

  private getScoreboardProjection(): Record<string, number> {
    return {
      _id: 0,
      team: 1,
      opposition: 1,
      runs: 1,
      wickets: 1,
      overs: 1,
      balls: 1,
      rpo: 1,
      ground: 1,
      start_date: 1,
      result: 1,
      inns: 1,
      lead: 1,
    };
  }
}
