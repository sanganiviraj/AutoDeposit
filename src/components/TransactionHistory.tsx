import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Send,
  Calendar,
  DollarSign,
  Filter,
} from 'lucide-react';
import {
  TransactionHistoryRecord,
  clearTransactionHistory,
  exportHistoryToCSV,
} from '../utils/history';

interface TransactionHistoryProps {
  history: TransactionHistoryRecord[];
  onClearHistory: () => void;
  onNavigateSender: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  history,
  onClearHistory,
  onNavigateSender,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Network filter
      if (selectedNetwork === 'mainnet' && item.chainId !== 56) return false;
      if (selectedNetwork === 'testnet' && item.chainId !== 97) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchHash = item.txHash.toLowerCase().includes(q);
      const matchNetwork = item.networkName.toLowerCase().includes(q);
      const matchSymbol = item.tokenSymbol.toLowerCase().includes(q);
      const matchAmount = item.totalAmountStr.toLowerCase().includes(q);
      const matchDate = new Date(item.timestamp).toLocaleString().toLowerCase().includes(q);
      const matchRecipients = item.recipients.some(
        (r) => r.address.toLowerCase().includes(q) || r.amount.toLowerCase().includes(q)
      );

      return matchHash || matchNetwork || matchSymbol || matchAmount || matchDate || matchRecipients;
    });
  }, [history, searchQuery, selectedNetwork]);

  // Aggregate stats
  const totalBatchCount = history.length;
  const totalRecipientsCount = useMemo(() => {
    return history.reduce((sum, item) => sum + item.recipientCount, 0);
  }, [history]);
  const totalVolumeUSDT = useMemo(() => {
    return history
      .reduce((sum, item) => sum + (parseFloat(item.totalAmountStr) || 0), 0)
      .toFixed(2);
  }, [history]);

  const handleExportCSV = () => {
    if (filteredHistory.length === 0) return;
    const csvContent = exportHistoryToCSV(filteredHistory);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `multisender_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Overview Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
              <Clock className="w-6 h-6 text-emerald-400" />
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track and search all past batch USDT transfers executed on BNB Smart Chain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all transaction history records?')) {
                      clearTransactionHistory();
                      onClearHistory();
                    }
                  }}
                  className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Clear History</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Analytics Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 block">Total Batches Sent</span>
              <span className="text-xl font-bold text-slate-100">{totalBatchCount}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 block">Total Recipients Served</span>
              <span className="text-xl font-bold text-slate-100">{totalRecipientsCount}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 block">Total Volume Transferred</span>
              <span className="text-xl font-bold text-amber-400 font-mono">
                {totalVolumeUSDT} USDT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tx hash, recipient address, amount, date..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Network Filter Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Networks</option>
            <option value="mainnet">BNB Smart Chain Mainnet</option>
            <option value="testnet">BSC Testnet</option>
          </select>
        </div>
      </div>

      {/* History List Table / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            {history.length === 0 ? 'No Transaction History Yet' : 'No Matching Transactions Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {history.length === 0
              ? 'Execute batch USDT transfers on the sender page to automatically record transactions here.'
              : `No transactions matched your search query "${searchQuery}". Try clearing filters.`}
          </p>
          {history.length === 0 ? (
            <button
              onClick={onNavigateSender}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Create New Batch Transfer
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNetwork('all');
              }}
              className="px-5 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 px-2 flex justify-between items-center">
            <span>
              Showing {filteredHistory.length} of {history.length} transaction record(s)
            </span>
          </div>

          {filteredHistory.map((item) => {
            const isExpanded = expandedTxId === item.id;
            const dateFormatted = new Date(item.timestamp).toLocaleString();

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all"
              >
                {/* Main Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                      </span>

                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-semibold rounded-full">
                        {item.networkName}
                      </span>

                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateFormatted}
                      </span>
                    </div>

                    {/* Tx Hash */}
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-300">
                      <span className="text-slate-500">Tx Hash:</span>
                      <span>
                        {item.txHash.substring(0, 14)}...{item.txHash.substring(item.txHash.length - 10)}
                      </span>
                      <button
                        onClick={() => handleCopy(item.txHash)}
                        className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Copy Tx Hash"
                      >
                        {copiedHash === item.txHash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={`${item.explorerUrl}/tx/${item.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-emerald-400 hover:underline flex items-center gap-1"
                        title="View on BscScan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Summary Amounts & Expander Toggle */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Sent</span>
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        {item.totalAmountStr} {item.tokenSymbol}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        ({item.recipientCount} recipient{item.recipientCount > 1 ? 's' : ''})
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedTxId(isExpanded ? null : item.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Recipient Breakdown List */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Recipient Address Breakdown ({item.recipients.length})
                      </h4>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {item.totalAmountStr} {item.tokenSymbol}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                            <th className="py-2.5 px-4">#</th>
                            <th className="py-2.5 px-4">Recipient Address</th>
                            <th className="py-2.5 px-4 text-right">Amount ({item.tokenSymbol})</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {item.recipients.map((rec, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40 text-slate-200">
                              <td className="py-2.5 px-4 text-slate-500 font-sans">{idx + 1}</td>
                              <td className="py-2.5 px-4">{rec.address}</td>
                              <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                                {rec.amount}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <a
                                  href={`${item.explorerUrl}/address/${rec.address}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 font-sans text-[11px]"
                                >
                                  Explorer <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
