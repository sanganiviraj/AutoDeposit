import { isAddress, getAddress } from 'viem';
import { safeParseUnits } from './amounts';

export interface RecipientInput {
  id: string;
  address: string;
  amount: string;
}

export interface RecipientValidationError {
  row: number;
  field: 'address' | 'amount' | 'general';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: RecipientValidationError[];
  validRecipients: { address: `0x${string}`; amount: bigint; rawAmountStr: string }[];
  duplicateAddresses: string[];
  totalAmountBigInt: bigint;
}

export function validateRecipientList(
  items: RecipientInput[],
  decimals: number,
  allowDuplicates = false
): ValidationResult {
  const errors: RecipientValidationError[] = [];
  const validRecipients: { address: `0x${string}`; amount: bigint; rawAmountStr: string }[] = [];
  const addressCounts: Map<string, number[]> = new Map();
  let totalAmountBigInt = 0n;

  if (items.length === 0) {
    errors.push({ row: 0, field: 'general', message: 'At least 1 recipient is required.' });
    return {
      isValid: false,
      errors,
      validRecipients: [],
      duplicateAddresses: [],
      totalAmountBigInt: 0n,
    };
  }

  if (items.length > 100) {
    errors.push({
      row: 0,
      field: 'general',
      message: `Maximum allowed recipients per transaction is 100. Current: ${items.length}`,
    });
  }

  items.forEach((item, index) => {
    const rowNum = index + 1;
    let isRowValid = true;
    let checksummedAddr: `0x${string}` | null = null;

    // Address validation
    const trimmedAddr = item.address ? item.address.trim() : '';
    if (!trimmedAddr) {
      errors.push({ row: rowNum, field: 'address', message: 'Address cannot be empty.' });
      isRowValid = false;
    } else if (!isAddress(trimmedAddr)) {
      errors.push({ row: rowNum, field: 'address', message: 'Invalid BSC EVM address format.' });
      isRowValid = false;
    } else if (trimmedAddr.toLowerCase() === '0x0000000000000000000000000000000000000000') {
      errors.push({ row: rowNum, field: 'address', message: 'Zero address (0x0) is not allowed.' });
      isRowValid = false;
    } else {
      checksummedAddr = getAddress(trimmedAddr);
      const normalized = checksummedAddr.toLowerCase();

      const existingRows = addressCounts.get(normalized) || [];
      existingRows.push(rowNum);
      addressCounts.set(normalized, existingRows);
    }

    // Amount validation
    const trimmedAmount = item.amount ? item.amount.trim() : '';
    const parsedAmount = safeParseUnits(trimmedAmount, decimals);

    if (!trimmedAmount) {
      errors.push({ row: rowNum, field: 'amount', message: 'Amount cannot be empty.' });
      isRowValid = false;
    } else if (parsedAmount === null) {
      errors.push({
        row: rowNum,
        field: 'amount',
        message: `Invalid amount format or exceeds max decimals (${decimals}).`,
      });
      isRowValid = false;
    }

    if (isRowValid && checksummedAddr && parsedAmount !== null) {
      validRecipients.push({
        address: checksummedAddr,
        amount: parsedAmount,
        rawAmountStr: trimmedAmount,
      });
      totalAmountBigInt += parsedAmount;
    }
  });

  // Check duplicates
  const duplicateAddresses: string[] = [];
  addressCounts.forEach((rows, normalizedAddr) => {
    if (rows.length > 1) {
      duplicateAddresses.push(normalizedAddr);
      if (!allowDuplicates) {
        rows.slice(1).forEach((duplicateRow) => {
          errors.push({
            row: duplicateRow,
            field: 'address',
            message: `Duplicate recipient address detected at row #${duplicateRow}.`,
          });
        });
      }
    }
  });

  const isValid = errors.length === 0 && validRecipients.length === items.length;

  return {
    isValid,
    errors,
    validRecipients,
    duplicateAddresses,
    totalAmountBigInt,
  };
}
