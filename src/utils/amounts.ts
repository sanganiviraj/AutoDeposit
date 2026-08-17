import { parseUnits as viemParseUnits, formatUnits as viemFormatUnits } from 'viem';

/**
 * Safely parses a user-entered token string into BigInt units using the token's decimal precision.
 * @param amountStr User string input (e.g. "100.5")
 * @param decimals Token decimal precision (e.g. 18 or 6)
 * @returns BigInt representation or null if string is invalid/negative/zero
 */
export function safeParseUnits(amountStr: string, decimals: number): bigint | null {
  if (!amountStr || typeof amountStr !== 'string') return null;

  const trimmed = amountStr.trim();
  if (trimmed === '' || trimmed === '0') return null;

  // Reject negative values or invalid characters
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;

  // Split integer and decimal parts to check decimal length against token decimals
  const parts = trimmed.split('.');
  if (parts.length > 2) return null;

  if (parts[1] && parts[1].length > decimals) {
    // Fraction exceeds token decimal precision
    return null;
  }

  try {
    const parsed = viemParseUnits(trimmed, decimals);
    if (parsed <= 0n) return null;
    return parsed;
  } catch (err) {
    return null;
  }
}

/**
 * Formats a BigInt raw balance into human-readable string representation with max display decimals.
 */
export function safeFormatUnits(amount: bigint | undefined, decimals: number, displayDecimals = 4): string {
  if (amount === undefined || amount === null) return '0.00';

  try {
    const formatted = viemFormatUnits(amount, decimals);
    const parts = formatted.split('.');
    if (parts.length === 1) return parts[0];

    const integerPart = parts[0];
    const decimalPart = parts[1].slice(0, displayDecimals);
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  } catch (err) {
    return '0.00';
  }
}

/**
 * Calculates the total sum of an array of BigInt amounts safely.
 */
export function calculateTotalAmount(amounts: bigint[]): bigint {
  return amounts.reduce((acc, curr) => acc + curr, 0n);
}
