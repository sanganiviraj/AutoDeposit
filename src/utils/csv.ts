import Papa from 'papaparse';
import { RecipientInput } from './validation';

export interface CSVParseResult {
  data: RecipientInput[];
  errors: string[];
}

/**
 * Parses a CSV string into recipient input rows.
 */
export function parseRecipientCSV(csvText: string): CSVParseResult {
  const errors: string[] = [];
  const items: RecipientInput[] = [];

  const parsed = Papa.parse<string[]>(csvText.trim(), {
    skipEmptyLines: true,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach((err) => {
      errors.push(`CSV Row ${err.row}: ${err.message}`);
    });
  }

  const rows = parsed.data;
  if (rows.length === 0) {
    return { data: [], errors: ['CSV file is empty.'] };
  }

  // Check if first row is a header (e.g. "address,amount")
  let startIndex = 0;
  if (
    rows[0] &&
    rows[0][0] &&
    (rows[0][0].toLowerCase().includes('address') || rows[0][0].toLowerCase().includes('recipient'))
  ) {
    startIndex = 1;
  }

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) {
      errors.push(`Row #${i + 1} does not have address and amount columns.`);
      continue;
    }

    const rawAddr = row[0] ? row[0].trim() : '';
    const rawAmt = row[1] ? row[1].trim() : '';

    items.push({
      id: `csv-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      address: rawAddr,
      amount: rawAmt,
    });
  }

  if (items.length > 100) {
    errors.push(`CSV contains ${items.length} rows. Maximum allowed per batch is 100 rows.`);
  }

  return { data: items, errors };
}

/**
 * Generates a sample CSV string template.
 */
export function generateSampleCSV(): string {
  return `address,amount
0x1111111111111111111111111111111111111111,100
0x2222222222222222222222222222222222222222,50.5
0x3333333333333333333333333333333333333333,250`;
}

/**
 * Converts current recipient list into downloadable CSV format.
 */
export function exportToCSV(recipients: RecipientInput[]): string {
  const csvRows = recipients.map((r) => [r.address, r.amount]);
  return Papa.unparse({
    fields: ['address', 'amount'],
    data: csvRows,
  });
}
