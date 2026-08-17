import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Header } from './components/Header';
import { NetworkWarning } from './components/NetworkWarning';
import { SecurityWarnings } from './components/SecurityWarnings';
import { CsvHandler } from './components/CsvHandler';
import { RecipientTable } from './components/RecipientTable';
import { PreviewModal } from './components/PreviewModal';
import { TransactionStatus } from './components/TransactionStatus';
import { useTokenBalance } from './hooks/useTokenBalance';
import { useTokenAllowance } from './hooks/useTokenAllowance';
import { useMultisend } from './hooks/useMultisend';
import { validateRecipientList, RecipientInput } from './utils/validation';
import { safeFormatUnits, calculateTotalAmount } from './utils/amounts';
import { getDefaultTokenForChain, getMultisenderAddressForChain } from './config/tokens';
import { bscMainnet, bscTestnet } from './config/chains';
import { Wallet, AlertTriangle, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Selected or custom token address state
  const defaultToken = useMemo(() => getDefaultTokenForChain(chainId), [chainId]);
  const [customTokenAddr, setCustomTokenAddr] = useState<string>('');
  
  const tokenAddress = useMemo<`0x${string}`>(() => {
    if (customTokenAddr && customTokenAddr.startsWith('0x') && customTokenAddr.length === 42) {
      return customTokenAddr as `0x${string}`;
    }
    return defaultToken.address;
  }, [customTokenAddr, defaultToken]);

  // Multisender spender contract address
  const multisenderAddress = useMemo(() => getMultisenderAddressForChain(chainId), [chainId]);

  // Read Token Balance & Symbol
  const {
    symbol: tokenSymbol,
    decimals: tokenDecimals,
    balance: userBalance,
    refetch: refetchBalance,
  } = useTokenBalance(tokenAddress, userAddress);

  // Read Spender Allowance
  const { allowance: userAllowance, refetch: refetchAllowance } = useTokenAllowance(
    tokenAddress,
    userAddress,
    multisenderAddress
  );

  // Multisend Execution Hook
  const {
    step,
    error: txError,
    approveTxHash,
    multisendTxHash,
    estimatedGasBnb,
    isEstimatingGas,
    executeApproval,
    executeMultisend,
    estimateMultisendGas,
    resetTxState,
  } = useMultisend();

  // Recipient input table state
  const [recipients, setRecipients] = useState<RecipientInput[]>([
    { id: '1', address: '', amount: '100' },
    { id: '2', address: '', amount: '100' },
  ]);

  const [allowDuplicates, setAllowDuplicates] = useState(false);

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Validate recipients on change
  const validation = useMemo(
    () => validateRecipientList(recipients, tokenDecimals, allowDuplicates),
    [recipients, tokenDecimals, allowDuplicates]
  );

  // Derived state
  const formattedBalance = safeFormatUnits(userBalance, tokenDecimals, 4);
  const formattedTotalStr = safeFormatUnits(validation.totalAmountBigInt, tokenDecimals, 4);
  const isInsufficientBalance = isConnected && userBalance < validation.totalAmountBigInt;
  const isNeedsApproval = isConnected && userAllowance < validation.totalAmountBigInt;
  const isMainnet = chainId === bscMainnet.id;
  const explorerUrl = isMainnet ? bscMainnet.blockExplorers.default.url : bscTestnet.blockExplorers.default.url;

  // Handlers for updating recipients
  const handleUpdateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRecipient = () => {
    if (recipients.length >= 100) return;
    setRecipients((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        address: '',
        amount: prev[prev.length - 1]?.amount || '100',
      },
    ]);
  };

  const handleRemoveRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCsvImport = (imported: RecipientInput[]) => {
    setRecipients(imported);
  };

  // Open Preview Modal
  const handleOpenPreview = async () => {
    if (!validation.isValid) return;
    if (multisenderAddress && userAddress) {
      const recipientAddrs = validation.validRecipients.map((r) => r.address);
      const recipientAmounts = validation.validRecipients.map((r) => r.amount);
      await estimateMultisendGas(
        multisenderAddress,
        tokenAddress,
        recipientAddrs,
        recipientAmounts,
        userAddress
      );
    }
    setIsPreviewOpen(true);
  };

  // Execute Batch Transaction Flow
  const handleConfirmTransaction = async () => {
    setIsPreviewOpen(false);
    setIsStatusOpen(true);
    resetTxState();

    if (!multisenderAddress) {
      alert('Multisender contract address is not configured for this network.');
      return;
    }

    const totalAmount = validation.totalAmountBigInt;
    const recipientAddrs = validation.validRecipients.map((r) => r.address);
    const recipientAmounts = validation.validRecipients.map((r) => r.amount);

    // Check allowance: if insufficient, perform exact approval first
    if (userAllowance < totalAmount) {
      const approvedSuccess = await executeApproval(tokenAddress, multisenderAddress, totalAmount);
      if (!approvedSuccess) return;
      await refetchAllowance();
    }

    // Step 2: Multisend transaction call
    const sendSuccess = await executeMultisend(
      multisenderAddress,
      tokenAddress,
      recipientAddrs,
      recipientAmounts
    );

    if (sendSuccess) {
      refetchBalance();
      refetchAllowance();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <NetworkWarning />
        <SecurityWarnings />

        {/* User Balance & Contract Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Connected Wallet Balance
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {isConnected ? formattedBalance : '0.00'}
                </span>
                <span className="text-sm font-bold text-emerald-400">{tokenSymbol}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            {/* Custom Token Input */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Token Address ({tokenSymbol})
              </label>
              <input
                type="text"
                value={customTokenAddr}
                onChange={(e) => setCustomTokenAddr(e.target.value)}
                placeholder={defaultToken.address}
                className="w-full sm:w-72 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* CSV Importer / Exporter */}
        <CsvHandler onImport={handleCsvImport} currentRecipients={recipients} />

        {/* Recipient Table */}
        <RecipientTable
          recipients={recipients}
          errors={validation.errors}
          allowDuplicates={allowDuplicates}
          onUpdateRecipient={handleUpdateRecipient}
          onAddRecipient={handleAddRecipient}
          onRemoveRecipient={handleRemoveRecipient}
          onToggleDuplicates={() => setAllowDuplicates((prev) => !prev)}
          tokenSymbol={tokenSymbol}
        />

        {/* Transaction Summary Footer & Action Button */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Total Recipients</span>
              <span className="text-xl font-bold text-slate-100">{recipients.length}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Total Batch Transfer</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {formattedTotalStr} {tokenSymbol}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Required Approval</span>
              <span className="text-sm font-semibold text-slate-200">
                {isNeedsApproval ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Exact Approval Needed
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sufficient Allowance
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Validation Warnings */}
          {isInsufficientBalance && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Insufficient {tokenSymbol} balance in wallet for total batch transfer.</span>
            </div>
          )}

          {!validation.isValid && validation.errors.length > 0 && (
            <div className="mb-4 p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Please resolve all recipient validation errors before proceeding.</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400">
              Only standard BSC network gas is charged. Zero multisender fees.
            </span>

            <button
              onClick={handleOpenPreview}
              disabled={!isConnected || !validation.isValid || isInsufficientBalance}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Preview & Send</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirm={handleConfirmTransaction}
        networkName={isMainnet ? bscMainnet.name : bscTestnet.name}
        isMainnet={isMainnet}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        tokenAddress={tokenAddress}
        recipients={validation.validRecipients}
        totalAmountBigInt={validation.totalAmountBigInt}
        multisenderAddress={multisenderAddress}
        estimatedGasBnb={estimatedGasBnb}
      />

      <TransactionStatus
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        step={step}
        error={txError}
        approveTxHash={approveTxHash}
        multisendTxHash={multisendTxHash}
        tokenSymbol={tokenSymbol}
        totalAmountStr={formattedTotalStr}
        recipientCount={validation.validRecipients.length}
        explorerUrl={explorerUrl}
        isNeedsApproval={isNeedsApproval}
      />
    </div>
  );
};
