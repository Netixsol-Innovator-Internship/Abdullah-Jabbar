export function parseStudentFromFilename(filename: string): { name: string | null; rollNo: string | null } {
  const base = filename.replace(/\.pdf$/i, '');

  // Patterns:
  // 1) "12345_Jane-Doe"
  let m = base.match(/^(\d+)[\s_-]+(.+)$/);
  if (m) {
    return {
      rollNo: m[1],
      name: normalizeName(m[2]),
    };
  }

  // 2) "Jane Doe (12345)"
  m = base.match(/^(.+)\((\d+)\)$/);
  if (m) {
    return {
      rollNo: m[2],
      name: normalizeName(m[1]),
    };
  }

  // 3) "12345 Jane Doe"
  m = base.match(/^(\d+)\s+(.+)$/);
  if (m) {
    return {
      rollNo: m[1],
      name: normalizeName(m[2]),
    };
  }

  // 4) "Jane_Doe_12345"
  m = base.match(/^(.+)[\s_-]+(\d+)$/);
  if (m) {
    return {
      rollNo: m[2],
      name: normalizeName(m[1]),
    };
  }

  return { name: null, rollNo: null };
}

function normalizeName(raw: string): string {
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}