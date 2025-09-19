// Small utility helpers: simple sanitizers/escapers used in the UI

export function escapeHtml(unsafe: string) {
  // basic escaping to prevent HTML injection when rendering strings in innerHTML or dangerouslySetInnerHTML
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function sanitizeFileName(name: string) {
  // remove suspicious characters, keep basic punctuation, limit length
  const sanitized = name.replace(/[^\w .\-_()]/g, '');
  return sanitized.slice(0, 200);
}