export interface HistoricalRecipient {
  address: string;
  amount: string;
}

export interface TransactionHistoryRecord {
  id: string;
  txHash: `0x${string}`;
  timestamp: number;
  networkName: string;
  chainId: number;
  tokenSymbol: string;
  tokenAddress: string;
  totalAmountStr: string;
  recipientCount: number;
  recipients: HistoricalRecipient[];
  explorerUrl: string;
}

const HISTORY_STORAGE_KEY = 'bsc_usdt_multisender_history_v1';

export function getTransactionHistory(): TransactionHistoryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TransactionHistoryRecord[];
  } catch (err) {
    console.error('Failed to load transaction history:', err);
    return [];
  }
}

export function saveTransactionRecord(record: Omit<TransactionHistoryRecord, 'id'>): TransactionHistoryRecord {
  const history = getTransactionHistory();
  const newRecord: TransactionHistoryRecord = {
    ...record,
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };

  const updated = [newRecord, ...history];
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save transaction record:', err);
  }
  return newRecord;
}

export function clearTransactionHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear transaction history:', err);
  }
}

export function exportHistoryToCSV(history: TransactionHistoryRecord[]): string {
  const headers = ['Tx Hash', 'Date & Time', 'Network', 'Total Amount', 'Token', 'Recipients Count', 'Recipient Addresses', 'BscScan Link'];
  
  const rows = history.map((h) => {
    const dateStr = new Date(h.timestamp).toLocaleString();
    const addrs = h.recipients.map((r) => `${r.address} (${r.amount} ${h.tokenSymbol})`).join(' | ');
    const link = `${h.explorerUrl}/tx/${h.txHash}`;
    return [h.txHash, `"${dateStr}"`, `"${h.networkName}"`, h.totalAmountStr, h.tokenSymbol, h.recipientCount, `"${addrs}"`, link];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
