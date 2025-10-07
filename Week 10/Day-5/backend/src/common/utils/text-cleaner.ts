import { MAX_WORD_COUNT } from '../constants';

export function cleanText(text: string): string {
  // Remove excessive whitespace
  let cleaned = text.trim().replace(/\s+/g, ' ');

  // Remove common PDF artifacts
  cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Remove page numbers and common headers/footers patterns
  cleaned = cleaned.replace(/Page \d+ of \d+/gi, '');
  cleaned = cleaned.replace(/^\d+\s*$/gm, ''); // standalone page numbers

  // Normalize quotes and dashes
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");
  cleaned = cleaned.replace(/—/g, '-');

  // Truncate if too long (based on word count)
  const words = cleaned.split(/\s+/);
  if (words.length > MAX_WORD_COUNT) {
    cleaned = words.slice(0, MAX_WORD_COUNT).join(' ') + '...';
  }

  return cleaned;
}

export function extractStudentMetadata(text: string): {
  studentName: string;
  rollNumber: string;
} {
  // Try to extract student name and roll number from the first few lines
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  let studentName = 'Unknown';
  let rollNumber = 'Unknown';

  // Look for patterns like "Name: John Doe" or "Student Name: John Doe"
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();

    // Match name patterns
    const nameMatch = line.match(
      /(?:Student\s*)?Name\s*:\s*(.+?)(?:\s*Roll|$)/i,
    );
    if (nameMatch && studentName === 'Unknown') {
      studentName = nameMatch[1].trim();
    }

    // Match roll number patterns
    const rollMatch = line.match(
      /(?:Roll\s*(?:Number|No\.?|#)\s*:\s*|Roll\s*:\s*)(\w+)/i,
    );
    if (rollMatch && rollNumber === 'Unknown') {
      rollNumber = rollMatch[1].trim();
    }

    // Alternative pattern: "John Doe - 12345" or "John Doe (12345)"
    if (studentName === 'Unknown' || rollNumber === 'Unknown') {
      const combinedMatch = line.match(/^(.+?)\s*[-–—(]\s*(\w+)\s*[)]?$/);
      if (combinedMatch) {
        if (studentName === 'Unknown') studentName = combinedMatch[1].trim();
        if (rollNumber === 'Unknown') rollNumber = combinedMatch[2].trim();
      }
    }
  }

  return { studentName, rollNumber };
}
