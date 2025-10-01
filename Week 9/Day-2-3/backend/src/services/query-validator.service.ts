import { Injectable, BadRequestException } from '@nestjs/common';

/**
 * Validate and sanitize the LLM-produced JSON query.
 * - Allowed collections: 'matches', 'testmatches', 'odimatches', 't20matches'
 * - Allowed fields whitelist
 * - Allowed operators: $gte, $lte, $eq, $in, $gt, $lt, $regex, $options, $exists, $ne
 * - Convert date strings to ISO strings (but keep as strings for later conversion)
 * - Apply limit ceiling <= 1000
 */

const ALLOWED_COLLECTIONS = new Set([
  'matches',
  'testmatches',
  'odimatches',
  't20matches',
]);
const ALLOWED_FIELDS = new Set([
  'format', // only for the legacy 'matches' collection
  'team',
  'opposition',
  'ground',
  'result',
  'inns',
  'rpo',
  'start_date',
  'runs',
  'lead', // only for test matches
]);

const ALLOWED_OPERATORS = new Set([
  '$gte',
  '$lte',
  '$eq',
  '$in',
  '$gt',
  '$lt',
  '$regex',
  '$options',
  '$exists',
  '$ne',
]);

@Injectable()
export class QueryValidatorService {
  validateAndSanitize(raw: any) {
    if (!raw || !ALLOWED_COLLECTIONS.has(raw.collection)) {
      throw new BadRequestException('Invalid collection');
    }

    // Determine collection and update format if needed
    let collection = raw.collection;
    let format: string | null = null;

    // Map collection names to format for the query
    if (collection === 'testmatches') {
      format = 'test';
      collection = 'matches'; // For backward compatibility with existing code
    } else if (collection === 'odimatches') {
      format = 'odi';
      collection = 'matches'; // For backward compatibility with existing code
    } else if (collection === 't20matches') {
      format = 't20';
      collection = 'matches'; // For backward compatibility with existing code
    }

    const sanitized: any = {
      collection,
      filter: {},
      projection: {},
      sort: {},
      limit: 100,
    };

    // limit
    if (raw.limit !== undefined) {
      const l = Number(raw.limit);
      if (Number.isNaN(l) || l < 1)
        throw new BadRequestException('Invalid limit');
      sanitized.limit = Math.min(1000, l); // ceiling
    }

    // projection
    if (raw.projection && typeof raw.projection === 'object') {
      sanitized.projection = raw.projection;
    }

    // sort
    if (raw.sort && typeof raw.sort === 'object') {
      sanitized.sort = raw.sort;
    }

    // filter
    if (raw.filter && typeof raw.filter === 'object') {
      sanitized.filter = this._sanitizeFilter(raw.filter);
    }

    // If we determined a format from the collection name, add it to the filter
    if (format) {
      sanitized.filter.format = format;
    }

    return sanitized;
  }

  private _sanitizeFilter(filter: any): any {
    const out: any = {};
    for (const key of Object.keys(filter)) {
      if (!ALLOWED_FIELDS.has(key)) {
        throw new BadRequestException(`Field ${key} not allowed in filters`);
      }
      const val = filter[key];
      // direct primitive
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        // operator object
        const opObj: any = {};
        for (const op of Object.keys(val)) {
          if (!ALLOWED_OPERATORS.has(op)) {
            throw new BadRequestException(`Operator ${op} not allowed`);
          }
          let v = val[op];
          // attempt to validate date-looking strings for start_date
          if (key === 'start_date') {
            // Accept ISO-like date strings; keep as strings (conversion happens in executor)
            if (typeof v === 'string') {
              // quick check
              const date = new Date(v);
              if (isNaN(date.getTime()))
                throw new BadRequestException(`Invalid date ${v}`);
              v = date.toISOString();
            } else if (v instanceof Date) {
              v = v.toISOString();
            } else {
              throw new BadRequestException(
                'Invalid date value for start_date',
              );
            }
          } else if (key === 'rpo' || key === 'inns' || key === 'runs') {
            if (typeof v === 'string') {
              const numValue = Number(v);
              if (!isNaN(numValue)) {
                v = numValue;
              } else {
                // Log the invalid value and skip this filter instead of throwing
                console.warn(
                  `Invalid numeric value for ${key}: ${v}, skipping this filter`,
                );
                continue; // Skip this operation instead of throwing
              }
            }
            if (typeof v !== 'number') {
              console.warn(
                `Non-numeric value for ${key}: ${v}, skipping this filter`,
              );
              continue; // Skip this operation instead of throwing
            }
          }
          opObj[op] = v;
        }

        // Only add the field if it has valid operations
        if (Object.keys(opObj).length > 0) {
          out[key] = opObj;
        }
      } else {
        // primitive
        let p = val;
        if (key === 'start_date') {
          const date = new Date(String(val));
          if (isNaN(date.getTime()))
            throw new BadRequestException('Invalid date');
          // convert to ISO range for equality: create $gte / $lte covering full day
          const iso = date.toISOString();
          out['start_date'] = {
            $gte: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
            $lte: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
          };
          continue;
        } else if (key === 'rpo' || key === 'inns' || key === 'runs') {
          if (typeof p === 'string' && !isNaN(Number(p))) p = Number(p);
          if (typeof p !== 'number')
            throw new BadRequestException(`${key} must be numeric`);
        }
        out[key] = p;
      }
    }
    return out;
  }
}
