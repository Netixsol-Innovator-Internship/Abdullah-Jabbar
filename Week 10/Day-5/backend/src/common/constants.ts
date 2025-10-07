// Application-wide constants can be defined here.
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];
export const OUTPUT_DIR = process.env.OUTPUT_DIR || './output';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
export const MAX_WORD_COUNT = parseInt(
  process.env.MAX_WORD_COUNT || '5000',
  10,
);
