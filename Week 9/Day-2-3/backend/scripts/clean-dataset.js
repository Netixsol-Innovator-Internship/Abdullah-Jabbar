#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function csvStringify(rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
    if (s.includes(',') || s.includes('\n') || s.includes('\r'))
      return `"${s}"`;
    return s;
  };

  const headerLine = headers.map(escape).join(',');
  const lines = rows.map((r) =>
    headers.map((h) => escape(r[h] ?? '')).join(','),
  );
  return [headerLine, ...lines].join('\n');
}

function isUnnamed(col) {
  return /^Unnamed(?:[:\s].*)?$/i.test(col) || /^Unnamed:/i.test(col);
}

function processFile(filePath, opts) {
  const text = fs.readFileSync(filePath, 'utf8');
  const records = parse(text, { columns: true, skip_empty_lines: true });
  if (!records || records.length === 0) {
    console.log(`Skipping ${path.basename(filePath)} — no rows`);
    return;
  }

  const headers = Object.keys(records[0]);

  // Find Unnamed columns and count non-empty occurrences for safety
  const unnamedCols = headers.filter((h) => isUnnamed(h));
  const removedCols = [];

  unnamedCols.forEach((col) => {
    let nonEmptyCount = 0;
    for (const r of records) {
      const v = r[col];
      if (v !== undefined && String(v).trim() !== '') {
        nonEmptyCount += 1;
      }
    }
    if (nonEmptyCount === 0) {
      // remove this col from all rows
      records.forEach((r) => delete r[col]);
      removedCols.push(col);
    } else {
      console.log(
        `  Keeping ${col} — ${nonEmptyCount} non-empty value(s) found`,
      );
    }
  });

  // Handle opposition column: only strip leading 'v ' if ALL non-empty opposition values start with it
  const oppKey = headers.find((h) => h.toLowerCase() === 'opposition');
  let oppositionCleaned = false;
  if (oppKey) {
    let totalNonEmpty = 0;
    let countStartingWithV = 0;
    for (const r of records) {
      const val = (r[oppKey] ?? '').toString().trim();
      if (val !== '') {
        totalNonEmpty += 1;
        if (/^v\s+/i.test(val)) countStartingWithV += 1;
      }
    }
    if (totalNonEmpty > 0) {
      console.log(
        `  opposition: ${countStartingWithV}/${totalNonEmpty} non-empty values start with 'v '`,
      );
      if (countStartingWithV === totalNonEmpty) {
        records.forEach((r) => {
          if (r[oppKey])
            r[oppKey] = r[oppKey].toString().replace(/^v\s+/i, '').trim();
        });
        oppositionCleaned = true;
      } else {
        console.log(
          '  Not stripping opposition prefix — not present in all non-empty values',
        );
      }
    }
  }

  // Preserve original header order, excluding removed columns
  const finalHeaders = headers.filter((h) => !removedCols.includes(h));

  const outCsv = csvStringify(records, finalHeaders);
  const outPath = opts.inplace
    ? filePath
    : filePath.replace(/\.csv$/i, '.cleaned.csv');
  fs.writeFileSync(outPath, outCsv, 'utf8');

  console.log(
    `Processed ${path.basename(filePath)} -> ${path.basename(outPath)}`,
  );
  if (removedCols.length)
    console.log(`  Removed empty columns: ${removedCols.join(', ')}`);
  else console.log('  No empty Unnamed columns to remove');
  console.log(`  Opposition cleaned: ${oppositionCleaned}`);
}

function main() {
  const datasetDir = path.join(__dirname, '..', 'dataset');
  const args = process.argv.slice(2);
  const inplace = args.includes('--inplace') || args.includes('-i');
  const filesArg = args.filter((a) => !/^(-|--)/.test(a));

  let files = [];
  if (filesArg.length > 0) {
    files = filesArg.map((f) =>
      path.isAbsolute(f) ? f : path.join(process.cwd(), f),
    );
  } else {
    // default: all csv files in datasetDir
    files = fs
      .readdirSync(datasetDir)
      .filter((f) => f.toLowerCase().endsWith('.csv'))
      .map((f) => path.join(datasetDir, f));
  }

  if (files.length === 0) {
    console.error('No CSV files found to process');
    process.exit(1);
  }

  files.forEach((f) => {
    try {
      processFile(f, { inplace });
    } catch (err) {
      console.error(`Error processing ${f}:`, err.message || err);
    }
  });
}

main();
