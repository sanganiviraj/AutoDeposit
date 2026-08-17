import { getAddress, isAddress } from 'viem';

export interface SecurityCheckResult {
  isSafe: boolean;
  warnings: string[];
  phishingRiskCount: number;
  contractAddressCount: number;
  selfTransferCount: number;
  largeAmountCount: number;
}

const BURN_ADDRESSES = new Set([
  '0x0000000000000000000000000000000000000000',
  '0x000000000000000000000000000000000000dead',
  '0x0000000000000000000000000000000000000001',
]);

/**
 * Perform comprehensive anti-fraud & security validation on recipient list
 */
export function runSecurityAudit(
  recipients: { address: string; amount: string }[],
  userAddress?: string,
  multisenderAddress?: string,
  tokenAddress?: string
): SecurityCheckResult {
  const warnings: string[] = [];
  let phishingRiskCount = 0;
  let contractAddressCount = 0;
  let selfTransferCount = 0;
  let largeAmountCount = 0;

  recipients.forEach((r, idx) => {
    const cleanAddr = r.address.trim().toLowerCase();
    const numAmount = parseFloat(r.amount) || 0;

    // 1. Check Burn / Null addresses
    if (BURN_ADDRESSES.has(cleanAddr)) {
      phishingRiskCount++;
      warnings.push(`Recipient #${idx + 1} (${r.address.substring(0, 8)}...) is a known zero/burn address. Tokens sent here will be permanently lost!`);
    }

    // 2. Check transfer to token contract or multisender contract
    if (tokenAddress && cleanAddr === tokenAddress.toLowerCase()) {
      contractAddressCount++;
      warnings.push(`Recipient #${idx + 1} is the USDT token contract address! Tokens sent here cannot be recovered.`);
    }

    if (multisenderAddress && cleanAddr === multisenderAddress.toLowerCase()) {
      contractAddressCount++;
      warnings.push(`Recipient #${idx + 1} is the Multisender contract address itself! Use recipient wallet addresses instead.`);
    }

    // 3. Check self-transfer
    if (userAddress && cleanAddr === userAddress.toLowerCase()) {
      selfTransferCount++;
      warnings.push(`Recipient #${idx + 1} is your own connected wallet address.`);
    }

    // 4. Large amount alert (> $500 USDT)
    if (numAmount >= 500) {
      largeAmountCount++;
      warnings.push(`Recipient #${idx + 1} has a high transfer amount (${r.amount} USDT). Please double-check for accidental extra zeros.`);
    }
  });

  const isSafe = phishingRiskCount === 0 && contractAddressCount === 0;

  return {
    isSafe,
    warnings,
    phishingRiskCount,
    contractAddressCount,
    selfTransferCount,
    largeAmountCount,
  };
}
