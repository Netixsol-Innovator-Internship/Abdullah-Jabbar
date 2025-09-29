import { Injectable } from '@nestjs/common';

/**
 * Format results:
 * - Single row or single scalar -> short text
 * - Multiple rows -> { type: "table", columns: [...], rows: [...] }
 * Include minimal provenance.
 */

@Injectable()
export class FormatterService {
  format(rows: Record<string, any>[], sanitizedQuery: any) {
    if (!rows || rows.length === 0) {
      return { type: 'text', data: 'No results found.' };
    }

    // Check if this is an aggregation result
    if (sanitizedQuery.isAggregation) {
      return this._formatAggregationResult(rows, sanitizedQuery);
    }

    // Check if this is a complete match (both innings from same game)
    if (rows.length === 2 && this._isSameMatch(rows[0], rows[1])) {
      return this._formatCompleteMatchTable(rows);
    }

    // For consistency, always return tables for cricket data
    // This ensures a consistent horizontal table format
    return this._formatAsCleanTable(rows);
  }

  private _singleRowText(row: Record<string, any>) {
    // Check if this looks like a detailed cricket stats query
    const hasDetailedStats =
      row.wickets !== undefined ||
      row.overs !== undefined ||
      row.rpo !== undefined ||
      row.balls !== undefined;

    if (hasDetailedStats) {
      // Return detailed cricket statistics
      return this._detailedCricketStats(row);
    }

    // build a concise summary: team, opposition, runs, result, date
    const date = row.start_date
      ? new Date(row.start_date).toISOString().split('T')[0]
      : null;
    const pieces: string[] = [];
    if (row.team) pieces.push(String(row.team));
    if (row.runs) pieces.push(`runs ${String(row.runs)}`);
    if (row.opposition) pieces.push(`v ${String(row.opposition)}`);
    if (row.ground) pieces.push(`at ${String(row.ground)}`);
    if (date) pieces.push(`on ${date}`);
    if (row.result) pieces.push(`— ${String(row.result)}`);
    const joined = pieces.join(' ');
    return joined || JSON.stringify(row);
  }

  private _detailedCricketStats(row: Record<string, any>) {
    const date = row.start_date
      ? new Date(row.start_date).toISOString().split('T')[0]
      : null;

    let stats = `${row.team || 'Team'} vs ${row.opposition || 'Opposition'}`;
    if (row.ground) stats += ` at ${row.ground}`;
    if (date) stats += ` on ${date}`;
    stats += '\n\n';

    stats += `**${row.team || 'Team'} Innings:**\n`;
    if (row.runs !== undefined) stats += `Runs: ${row.runs}`;
    if (row.wickets !== undefined) stats += `/${row.wickets}`;
    if (row.overs !== undefined) stats += ` (${row.overs}`;
    if (row.balls !== undefined && row.balls > 0) stats += `.${row.balls}`;
    if (row.overs !== undefined) stats += ' overs)';
    stats += '\n';

    if (row.rpo !== undefined) stats += `Run Rate: ${row.rpo} RPO\n`;
    if (row.inns !== undefined) stats += `Innings: ${row.inns}\n`;
    if (row.balls_per_over !== undefined)
      stats += `Balls per Over: ${row.balls_per_over}\n`;
    if (row.lead !== undefined) stats += `Lead: ${row.lead}\n`;

    stats += `\n**Result:** ${row.result || 'Unknown'}`;

    return stats;
  }

  private _isSameMatch(
    row1: Record<string, any>,
    row2: Record<string, any>,
  ): boolean {
    // Check if two rows are from the same match (same date, ground, teams involved)
    const sameDate =
      row1.start_date &&
      row2.start_date &&
      new Date(row1.start_date).getTime() ===
        new Date(row2.start_date).getTime();
    const sameGround = row1.ground === row2.ground;
    const sameTeams =
      (row1.team === row2.opposition && row1.opposition === row2.team) ||
      (row1.team === row2.team && row1.opposition === row2.opposition);

    return sameDate && sameGround && sameTeams;
  }

  private _completeMatchStats(rows: Record<string, any>[]): string {
    // Sort by innings number to get proper order
    const sortedRows = rows.sort((a, b) => (a.inns || 0) - (b.inns || 0));

    const match = sortedRows[0];
    const date = match.start_date
      ? new Date(match.start_date).toISOString().split('T')[0]
      : null;

    let stats = `**Cricket Match Statistics**\n`;
    if (match.ground) stats += `Venue: ${match.ground}\n`;
    if (date) stats += `Date: ${date}\n\n`;

    sortedRows.forEach((row, index) => {
      stats += `**${row.team} Innings ${row.inns || index + 1}:**\n`;
      if (row.runs !== undefined) stats += `Score: ${row.runs}`;
      if (row.wickets !== undefined) stats += `/${row.wickets}`;
      if (row.overs !== undefined) stats += ` (${row.overs}`;
      if (row.balls !== undefined && row.balls > 0) stats += `.${row.balls}`;
      if (row.overs !== undefined) stats += ' overs)';
      stats += '\n';

      if (row.rpo !== undefined) stats += `Run Rate: ${row.rpo} RPO\n`;
      if (row.balls_per_over !== undefined)
        stats += `Balls per Over: ${row.balls_per_over}\n`;
      stats += `Result: ${row.result || 'Unknown'}\n\n`;
    });

    return stats.trim();
  }

  private _formatSingleMatchTable(row: Record<string, any>) {
    const date = row.start_date
      ? new Date(row.start_date).toISOString().split('T')[0]
      : 'N/A';

    const columns = [
      'Team',
      'Opposition',
      'Venue',
      'Date',
      'Runs',
      'Wickets',
      'Overs',
      'Balls',
      'Run Rate (RPO)',
      'Balls per Over',
      'Innings',
      'Result',
    ];

    const tableRows = [
      [
        row.team || 'N/A',
        row.opposition || 'N/A',
        row.ground || 'N/A',
        date,
        row.runs || 'N/A',
        row.wickets || 'N/A',
        row.overs || 'N/A',
        row.balls || 'N/A',
        row.rpo || 'N/A',
        row.balls_per_over || 'N/A',
        row.inns || 'N/A',
        row.result || 'N/A',
      ],
    ];

    // Add conclusion statement
    const conclusion = this._generateConclusion(row);

    return {
      type: 'table',
      data: { columns, rows: tableRows },
      conclusion,
    };
  }

  private _formatCompleteMatchTable(rows: Record<string, any>[]) {
    const sortedRows = rows.sort((a, b) => (a.inns || 0) - (b.inns || 0));
    const match = sortedRows[0];
    const date = match.start_date
      ? new Date(match.start_date).toISOString().split('T')[0]
      : 'N/A';

    const columns = [
      'Team',
      'Opposition',
      'Runs',
      'Wickets',
      'Overs',
      'Balls',
      'Run Rate',
      'Innings',
      'Result',
    ];
    const tableRows = sortedRows.map((row) => [
      row.team || 'N/A',
      row.opposition || 'N/A',
      row.runs || 'N/A',
      row.wickets || 'N/A',
      row.overs || 'N/A',
      row.balls || 'N/A',
      row.rpo || 'N/A',
      row.inns || 'N/A',
      row.result || 'N/A',
    ]);

    // Add match header info
    const matchInfo = `Match: ${match.ground || 'Unknown Venue'} on ${date}`;

    // Generate conclusion for complete match
    const winner = sortedRows.find((row) =>
      row.result?.toLowerCase().includes('won'),
    );
    const loser = sortedRows.find((row) =>
      row.result?.toLowerCase().includes('lost'),
    );

    let conclusion = '';
    if (winner && loser) {
      const margin = winner.runs - loser.runs;
      conclusion = `${winner.team} won by ${margin} runs against ${loser.team}.`;
    }

    return {
      type: 'table',
      data: { columns, rows: tableRows },
      matchInfo,
      conclusion,
    };
  }

  private _generateConclusion(row: Record<string, any>): string {
    const team = row.team || 'Team';
    const opposition = row.opposition || 'Opposition';
    const runs = row.runs || 'unknown';
    const wickets = row.wickets !== undefined ? `/${row.wickets}` : '';
    const result = row.result || 'unknown result';

    return `${team} scored ${runs}${wickets} and ${result} against ${opposition}.`;
  }

  private _formatAsCleanTable(rows: Record<string, any>[]) {
    // Clean and normalize the data
    const cleanedRows = rows.map((row) => this._cleanRowData(row));

    // Define fields to exclude from columns
    const excludeFields = [
      '_id',
      '__v',
      'extra_cols',
      'updatedAt',
      'createdAt',
      'overs_raw',
      'score_raw',
    ];

    // Get columns, excluding unwanted fields
    const columns = new Set<string>();
    cleanedRows.forEach((r) =>
      Object.keys(r).forEach((k) => {
        if (
          !excludeFields.includes(k) &&
          !k.includes('raw') &&
          !k.toLowerCase().includes('raw')
        ) {
          columns.add(k);
        }
      }),
    );

    // Order columns in a logical way
    const orderedCols = this._orderColumns(Array.from(columns));

    // Convert column names to display-friendly names
    const displayColumns = orderedCols.map((col) =>
      this._getDisplayColumnName(col),
    );

    const tableRows = cleanedRows.map((r) =>
      orderedCols.map((c) => (r[c] === undefined ? null : r[c])),
    );

    return {
      type: 'table',
      data: { columns: displayColumns, rows: tableRows },
    };
  }

  private _cleanRowData(row: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      // Skip internal MongoDB fields and excluded fields
      if (
        key === '_id' ||
        key === '__v' ||
        key === 'extra_cols' ||
        key === 'updatedAt' ||
        key === 'createdAt' ||
        key.includes('_raw') ||
        key.includes('raw_') ||
        key === 'overs_raw' ||
        key === 'score_raw' ||
        key.toLowerCase().includes('raw')
      ) {
        continue;
      }

      // Format dates to readable format
      if (key === 'start_date' && value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          cleaned[key] = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } else {
          cleaned[key] = value;
        }
      } else {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }

  private _orderColumns(columns: string[]): string[] {
    // Define preferred order for cricket data with clean column names
    const preferredOrder = [
      'team',
      'opposition',
      'runs',
      'wickets',
      'overs',
      'balls',
      'rpo',
      'ground',
      'start_date',
      'result',
      'inns',
      'lead',
      'balls_per_over',
    ];

    const ordered: string[] = [];
    const remaining: string[] = [];

    // Add columns in preferred order if they exist
    preferredOrder.forEach((col) => {
      if (columns.includes(col)) {
        ordered.push(col);
      }
    });

    // Add any remaining columns that aren't in preferred order
    columns.forEach((col) => {
      if (!preferredOrder.includes(col)) {
        remaining.push(col);
      }
    });

    return [...ordered, ...remaining];
  }

  private _getDisplayColumnName(column: string): string {
    const displayNameMap: Record<string, string> = {
      team: 'Team',
      opposition: 'Opposition',
      runs: 'Runs',
      wickets: 'Wickets',
      overs: 'Overs',
      balls: 'Balls',
      rpo: 'Run Rate',
      ground: 'Venue',
      start_date: 'Date',
      result: 'Result',
      inns: 'Innings',
      lead: 'Lead',
      balls_per_over: 'Balls/Over',
    };

    return displayNameMap[column] || column;
  }

  private _formatAggregationResult(
    rows: Record<string, any>[],
    sanitizedQuery: any,
  ) {
    if (rows.length === 0) {
      return { type: 'text', data: 'No aggregation results found.' };
    }

    // For single row aggregation results (like overall average), format as text
    if (rows.length === 1 && rows[0]._id === null) {
      return this._formatSingleAggregation(rows[0], sanitizedQuery);
    }

    // For grouped results (like team averages), format as table
    return this._formatAggregationTable(rows, sanitizedQuery);
  }

  private _formatSingleAggregation(
    row: Record<string, any>,
    sanitizedQuery: any,
  ) {
    let result = '';

    // Extract format from sanitizedQuery (should be in the pipeline[0].$match.format)
    let format = 'matches';
    if (
      sanitizedQuery.pipeline &&
      sanitizedQuery.pipeline[0] &&
      sanitizedQuery.pipeline[0].$match
    ) {
      format = sanitizedQuery.pipeline[0].$match.format || 'matches';
    }

    // Get team if it exists in the match conditions
    let team = '';
    if (
      sanitizedQuery.pipeline &&
      sanitizedQuery.pipeline[0] &&
      sanitizedQuery.pipeline[0].$match &&
      sanitizedQuery.pipeline[0].$match.team
    ) {
      team = sanitizedQuery.pipeline[0].$match.team;
    }

    // Format the results based on what metrics are present
    if (row.averageRuns !== undefined) {
      result += `Average runs${team ? ' for ' + team : ''}${format !== 'matches' ? ' in ' + format + ' matches' : ''}: ${row.averageRuns.toFixed(2)}`;
    }

    if (row.highestScore !== undefined) {
      result += `\nHighest score: ${row.highestScore}`;
    }

    if (row.lowestScore !== undefined) {
      result += `\nLowest score: ${row.lowestScore}`;
    }

    if (row.matchesCount !== undefined || row.totalMatches !== undefined) {
      const count =
        row.matchesCount !== undefined ? row.matchesCount : row.totalMatches;
      result += `\nTotal matches: ${count}`;
    }

    if (row.totalRuns !== undefined) {
      result += `\nTotal runs: ${row.totalRuns}`;
    }

    return { type: 'text', data: result };
  }

  private _formatAggregationTable(
    rows: Record<string, any>[],
    sanitizedQuery: any,
  ) {
    // Clean up the aggregation results for display
    const cleanedRows = rows.map((row) => {
      const clean: Record<string, any> = {};

      // Handle the _id field which is the grouping key
      if (row._id !== undefined) {
        // The _id could be a field value like team name, ground name, etc.
        clean['Group'] = row._id || 'Overall';
      }

      // Add all the aggregation metrics
      if (row.averageRuns !== undefined)
        clean['Average Runs'] = row.averageRuns.toFixed(2);
      if (row.highestScore !== undefined)
        clean['Highest Score'] = row.highestScore;
      if (row.lowestScore !== undefined)
        clean['Lowest Score'] = row.lowestScore;
      if (row.totalRuns !== undefined) clean['Total Runs'] = row.totalRuns;
      if (row.matchesCount !== undefined) clean['Matches'] = row.matchesCount;
      if (row.totalMatches !== undefined) clean['Matches'] = row.totalMatches;

      // Add any other fields that might be in the result
      Object.entries(row).forEach(([key, value]) => {
        if (
          key !== '_id' &&
          key !== 'averageRuns' &&
          key !== 'highestScore' &&
          key !== 'lowestScore' &&
          key !== 'totalRuns' &&
          key !== 'matchesCount' &&
          key !== 'totalMatches'
        ) {
          clean[key] = value;
        }
      });

      return clean;
    });

    // Extract columns from the cleaned rows
    const columns = new Set<string>();
    cleanedRows.forEach((r) => {
      Object.keys(r).forEach((k) => columns.add(k));
    });

    // Ensure "Group" is the first column if it exists
    const orderedColumns = Array.from(columns);
    if (orderedColumns.includes('Group')) {
      const groupIndex = orderedColumns.indexOf('Group');
      orderedColumns.splice(groupIndex, 1);
      orderedColumns.unshift('Group');
    }

    const tableRows = cleanedRows.map((r) =>
      orderedColumns.map((col) => (r[col] === undefined ? null : r[col])),
    );

    return {
      type: 'table',
      data: { columns: orderedColumns, rows: tableRows },
      isAggregation: true,
    };
  }
}
