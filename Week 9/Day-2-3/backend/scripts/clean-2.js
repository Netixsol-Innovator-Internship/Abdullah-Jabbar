const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

/**
 * Normalize the Score column into Runs and Wickets.
 * If Score has no '/', assume all wickets lost (10).
 * Example:
 *   "191/5" → Runs=191, Wickets=5
 *   "190"   → Runs=190, Wickets=10
 */
function normalizeScore(scoreVal) {
  if (!scoreVal) return { Runs: null, Wickets: null };

  const scoreStr = String(scoreVal).trim();
  if (scoreStr.includes('/')) {
    const [runs, wickets] = scoreStr.split('/');
    return {
      Runs: parseInt(runs, 10),
      Wickets: parseInt(wickets, 10),
    };
  } else {
    return {
      Runs: parseInt(scoreStr, 10),
      Wickets: 10, // all out
    };
  }
}

/**
 * Normalize Overs column into Overs, Balls, BallsPerOver.
 * Example:
 *   "39.4x8"   → Overs=39, Balls=4, BallsPerOver=8
 *   "169.3x4"  → Overs=169, Balls=3, BallsPerOver=4
 *   "20"       → Overs=20, Balls=0, BallsPerOver=6 (default modern format)
 *   "14.3"     → Overs=14, Balls=3, BallsPerOver=6
 */
function normalizeOvers(oversVal) {
  if (!oversVal) return { Overs: null, Balls: null, BallsPerOver: null };

  let oversStr = String(oversVal).trim();
  let ballsPerOver = 6; // default modern format

  if (oversStr.includes('x')) {
    const [main, format] = oversStr.split('x');
    oversStr = main;
    ballsPerOver = parseInt(format, 10);
  }

  let overs = 0;
  let balls = 0;

  if (oversStr.includes('.')) {
    const [o, b] = oversStr.split('.');
    overs = parseInt(o, 10);
    balls = parseInt(b, 10);
  } else {
    overs = parseInt(oversStr, 10);
  }

  return { Overs: overs, Balls: balls, BallsPerOver: ballsPerOver };
}

/**
 * Process CSV content: normalize Score + Overs, drop originals
 */
function processCsv(inputCsv) {
  const parsed = Papa.parse(inputCsv, { header: true });
  const rows = parsed.data.map((row) => {
    const { Runs, Wickets } = normalizeScore(row.Score);
    const { Overs, Balls, BallsPerOver } = normalizeOvers(row.Overs);

    // Drop old columns
    delete row.Score;
    delete row.Overs;

    return {
      ...row,
      Runs,
      Wickets,
      Overs,
      Balls,
      BallsPerOver,
    };
  });

  return Papa.unparse(rows);
}

/**
 * Batch process multiple CSV files
 */
function normalizeFiles(files) {
  files.forEach((file) => {
    const inputCsv = fs.readFileSync(file, 'utf8');
    const outputCsv = processCsv(inputCsv);
    const outFile = file.replace('.csv', '_normalized.csv');
    fs.writeFileSync(outFile, outputCsv);
    console.log(`Normalized file written: ${outFile}`);
  });
}

// Process files from the cleaned dataset folder
const cleanedDatasetPath = path.join(__dirname, '..', 'dataset', 'cleaned');
const inputFiles = [
  path.join(cleanedDatasetPath, 'ODI_match_results.cleaned.csv'),
  path.join(cleanedDatasetPath, 'T20I_match_results.cleaned.csv'),
  path.join(cleanedDatasetPath, 'Test_match_results.cleaned.csv'),
];

normalizeFiles(inputFiles);
