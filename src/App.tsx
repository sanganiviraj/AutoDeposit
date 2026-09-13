import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useChainId, useBalance } from 'wagmi';
import { Header, ViewTab } from './components/Header';
import { ShaderBackground } from './components/ShaderBackground';
import { LandingPage } from './components/LandingPage';
import { NetworkWarning } from './components/NetworkWarning';
import { SecurityWarnings } from './components/SecurityWarnings';
import { SecurityShield } from './components/SecurityShield';
import { CsvHandler } from './components/CsvHandler';
import { RecipientTable } from './components/RecipientTable';
import { PreviewModal } from './components/PreviewModal';
import { TransactionStatus } from './components/TransactionStatus';
import { TransactionHistory } from './components/TransactionHistory';
import { useTokenBalance } from './hooks/useTokenBalance';
import { useTokenAllowance } from './hooks/useTokenAllowance';
import { useMultisend } from './hooks/useMultisend';
import { validateRecipientList, RecipientInput } from './utils/validation';
import { safeFormatUnits } from './utils/amounts';
import { runSecurityAudit } from './utils/security';
import { getDefaultTokenForChain, getMultisenderAddressForChain } from './config/tokens';
import { bscMainnet, bscTestnet } from './config/chains';
import {
  getTransactionHistory,
  saveTransactionRecord,
  TransactionHistoryRecord,
} from './utils/history';
import { Wallet, AlertTriangle, CheckCircle2, ArrowRight, Coins, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Navigation tab state ('landing' | 'sender' | 'history')
  const [activeTab, setActiveTab] = useState<ViewTab>('landing');

  // Transaction history state
  const [history, setHistory] = useState<TransactionHistoryRecord[]>([]);

  useEffect(() => {
    setHistory(getTransactionHistory());
  }, []);

  // Read native BNB gas balance
  const { data: bnbBalanceData } = useBalance({ address: userAddress });
  const formattedBnbBalance = bnbBalanceData
    ? parseFloat(bnbBalanceData.formatted).toFixed(4)
    : '0.0000';

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
    executeApproval,
    executeMultisend,
    estimateMultisendGas,
    resetTxState,
  } = useMultisend();

  // Recipient input table state
  const [recipients, setRecipients] = useState<RecipientInput[]>([
    { id: '1', address: '', amount: '1' },
    { id: '2', address: '', amount: '1' },
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

  // Comprehensive Web3 Anti-Fraud & Security Audit
  const securityResult = useMemo(
    () => runSecurityAudit(recipients, userAddress, multisenderAddress, tokenAddress),
    [recipients, userAddress, multisenderAddress, tokenAddress]
  );

  // Derived state
  const formattedBalance = safeFormatUnits(userBalance, tokenDecimals, 4);
  const formattedTotalStr = safeFormatUnits(validation.totalAmountBigInt, tokenDecimals, 4);
  const isInsufficientBalance = isConnected && userBalance < validation.totalAmountBigInt;
  const isNeedsApproval = isConnected && userAllowance < validation.totalAmountBigInt;
  const isMainnet = chainId === bscMainnet.id;
  const explorerUrl = isMainnet
    ? bscMainnet.blockExplorers.default.url
    : bscTestnet.blockExplorers.default.url;

  // Handlers for updating recipients
  const handleUpdateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAddRecipient = () => {
    if (recipients.length >= 100) return;
    setRecipients((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        address: '',
        amount: prev[prev.length - 1]?.amount || '1',
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
    if (!validation.isValid || !securityResult.isSafe) return;
    if (multisenderAddress && userAddress) {
      const recipientAddrs = validation.validRecipients.map((r) => r.address);
      const recipientAmounts = validation.validRecipients.map((r) => r.amount);
      await estimateMultisendGas(
        multisenderAddress,
        tokenAddress,
        recipientAddrs,
        recipientAmounts,
        userAddress,
        userAllowance >= validation.totalAmountBigInt
      );
    }
    setIsPreviewOpen(true);
  };

  // Execute Batch Transaction Flow & Record History
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

    // Check allowance: if insufficient, perform exact approval first and WAIT for block confirmation
    if (userAllowance < totalAmount) {
      const approvedSuccess = await executeApproval(tokenAddress, multisenderAddress, totalAmount);
      if (!approvedSuccess) return;
      await refetchAllowance();
    }

    // Step 2: Multisend transaction call
    const result = await executeMultisend(
      multisenderAddress,
      tokenAddress,
      recipientAddrs,
      recipientAmounts
    );

    if (result.success && result.hash) {
      refetchBalance();
      refetchAllowance();

      // Automatically record in transaction history
      const historicalRecipients = validation.validRecipients.map((r) => ({
        address: r.address,
        amount: safeFormatUnits(r.amount, tokenDecimals, 4),
      }));

      const newRecord = saveTransactionRecord({
        txHash: result.hash,
        timestamp: Date.now(),
        networkName: isMainnet ? bscMainnet.name : bscTestnet.name,
        chainId,
        tokenSymbol,
        tokenAddress,
        totalAmountStr: formattedTotalStr,
        recipientCount: validation.validRecipients.length,
        recipients: historicalRecipients,
        explorerUrl,
      });

      setHistory((prev) => [newRecord, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#D4E4FA] font-sans selection:bg-[#F3BA2F] selection:text-[#0B0F17] relative">
      {/* WebGL 2D Simplex Noise Shader Canvas Background */}
      <ShaderBackground />

      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
      />

      {/* Main App Content View Switcher */}
      {activeTab === 'landing' ? (
        <LandingPage onLaunchApp={() => setActiveTab('sender')} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10 animate-in">
          <NetworkWarning />
          <SecurityWarnings />

          {activeTab === 'history' ? (
            <TransactionHistory
              history={history}
              onClearHistory={() => setHistory([])}
              onNavigateSender={() => setActiveTab('sender')}
            />
          ) : (
            <>
              {/* Dashboard Title & Overview Banner */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#F3BA2F] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Application Dashboard</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Batch Token Distribution
                  </h1>
                  <p className="text-sm text-[#D3C5AD]/80 mt-1 max-w-xl">
                    Distribute BEP-20 tokens to up to 100 wallet addresses in a single atomic transaction.
                  </p>
                </div>
              </div>

              {/* User Balance & Contract Status Banner */}
              <div className="glass-card rounded-3xl p-6 shadow-2xl mb-8 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8">
                  {/* Native BNB Gas Balance */}
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-amber-400/10 rounded-2xl text-[#F3BA2F] border border-amber-400/20">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#D3C5AD]/70 uppercase tracking-wider block">
                        BNB Gas Balance
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-extrabold text-white font-mono">
                          {isConnected ? formattedBnbBalance : '0.0000'}
                        </span>
                        <span className="text-xs font-bold text-[#F3BA2F]">BNB</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-10 w-[1px] bg-white/10 hidden sm:block"></div>

                  {/* Token Balance */}
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-[#6BF8BA] border border-emerald-500/20">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#D3C5AD]/70 uppercase tracking-wider block">
                        {tokenSymbol} Transfer Balance
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-extrabold text-white font-mono">
                          {isConnected ? formattedBalance : '0.00'}
                        </span>
                        <span className="text-xs font-bold text-[#6BF8BA]">{tokenSymbol}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Selector & Custom Contract Input */}
                <div className="w-full lg:w-auto">
                  <div className="layer-2 rounded-2xl p-4 border border-white/10 text-xs">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <label className="text-xs font-bold text-white">
                        Selected Token Contract
                      </label>
                      <span className="text-[10px] text-[#F3BA2F] font-mono font-bold px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 rounded-full">
                        BEP-20 {tokenSymbol}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={customTokenAddr}
                      onChange={(e) => setCustomTokenAddr(e.target.value)}
                      placeholder={`Default: ${defaultToken.address}`}
                      className="w-full sm:w-80 px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#F3BA2F]/70 placeholder:text-slate-600 transition-colors"
                    />
                    <span className="block text-[10px] text-[#D3C5AD]/60 mt-1">
                      Default: Official USDT. Paste custom BEP-20 token address if needed.
                    </span>
                  </div>
                </div>
              </div>

              {/* 12-Column Dashboard Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left 8-Column Section: CSV Handler & Recipient Table */}
                <div className="lg:col-span-8 space-y-6">
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
                </div>

                {/* Right 4-Column Section: Summary Widget & Web3 Action Center */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Anti-Fraud Guardian Shield */}
                  <SecurityShield securityResult={securityResult} tokenSymbol={tokenSymbol} />

                  {/* Summary & Execution Panel */}
                  <div className="bg-[#0B0F17]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-5 sticky top-28">
                    <h3 className="font-semibold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3 tracking-tight">
                      <Layers className="w-5 h-5 text-[#F3BA2F]" />
                      <span>Distribution Summary</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="bg-[#05070B] p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Total Recipients</span>
                        <span className="text-base font-bold font-mono text-white">{recipients.length}</span>
                      </div>

                      <div className="bg-[#05070B] p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Total Transfer</span>
                        <span className="text-lg font-bold font-mono text-[#F3BA2F] text-glow">
                          {formattedTotalStr} {tokenSymbol}
                        </span>
                      </div>

                      <div className="bg-[#05070B] p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Allowance Status</span>
                        <span className="text-xs font-semibold">
                          {isNeedsApproval ? (
                            <span className="text-amber-400 flex items-center gap-1 font-mono">
                              <AlertTriangle className="w-3.5 h-3.5" /> Approval Needed
                            </span>
                          ) : (
                            <span className="text-[#6BF8BA] flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Warnings */}
                    {isInsufficientBalance && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5 font-mono">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>Insufficient {tokenSymbol} balance in wallet for total batch transfer.</span>
                      </div>
                    )}

                    {!validation.isValid && validation.errors.length > 0 && (
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5 font-mono">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Resolve recipient list validation errors before proceeding.</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={handleOpenPreview}
                      disabled={!isConnected || !validation.isValid || isInsufficientBalance || !securityResult.isSafe}
                      className="w-full py-4 bg-gradient-to-r from-[#F3BA2F] to-[#f7be33] hover:from-[#f7be33] hover:to-[#F3BA2F] text-[#0B0F17] disabled:opacity-40 disabled:cursor-not-allowed font-extrabold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(243,186,47,0.35)] hover:shadow-[0_6px_25px_rgba(243,186,47,0.5)] flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
                    >
                      <span>Preview & Execute Batch</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-[11px] text-center text-slate-400 font-medium pt-1">
                      Zero protocol fees. Standard BSC network gas applies.
                    </p>
                  </div>

                </div>
              </div>
            </>
          )}
        </main>
      )}

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

