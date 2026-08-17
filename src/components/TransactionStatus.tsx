import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, Smartphone } from 'lucide-react';
import { TxStep } from '../hooks/useMultisend';

interface TransactionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  step: TxStep;
  error: string | null;
  approveTxHash?: `0x${string}`;
  multisendTxHash?: `0x${string}`;
  tokenSymbol: string;
  totalAmountStr: string;
  recipientCount: number;
  explorerUrl: string;
  isNeedsApproval: boolean;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  isOpen,
  onClose,
  step,
  error,
  approveTxHash,
  multisendTxHash,
  tokenSymbol,
  totalAmountStr,
  recipientCount,
  explorerUrl,
  isNeedsApproval,
}) => {
  if (!isOpen) return null;

  const isWaitingWallet = step === 'approving' || step === 'sending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-100 mb-4">Transaction Status</h3>

        {/* Action Required Banner for Wallet Confirmation */}
        {isWaitingWallet && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl mb-4 text-xs text-emerald-300 flex items-center gap-3 animate-pulse">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-200 block mb-0.5">Check Your Wallet App</span>
              <p className="text-emerald-300/80">
                Please open <strong>Trust Wallet / MetaMask</strong> on your device and tap <strong>Approve / Confirm</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Stepper Progress */}
        <div className="space-y-4 mb-6">
          {/* Step 1: Exact Approval */}
          {isNeedsApproval && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                step === 'approving'
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : step === 'approved' || step === 'sending' || step === 'success'
                  ? 'bg-slate-950/40 border-slate-800'
                  : 'bg-slate-950/20 border-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step === 'approving' ? (
                    <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  ) : step === 'approved' || step === 'sending' || step === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      1
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-xs text-slate-200 block">
                      Step 1: Approve {tokenSymbol}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Exact Amount: {totalAmountStr} {tokenSymbol}
                    </span>
                  </div>
                </div>

                {approveTxHash && (
                  <a
                    href={`${explorerUrl}/tx/${approveTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    View Tx <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Multisend Batch Execution */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              step === 'sending'
                ? 'bg-emerald-950/30 border-emerald-500/50'
                : step === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/50'
                : 'bg-slate-950/20 border-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step === 'sending' ? (
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                ) : step === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    {isNeedsApproval ? '2' : '1'}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-xs text-slate-200 block">
                    Step {isNeedsApproval ? '2' : '1'}: Send {totalAmountStr} {tokenSymbol}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Recipients: {recipientCount} address(es)
                  </span>
                </div>
              </div>

              {multisendTxHash && (
                <a
                  href={`${explorerUrl}/tx/${multisendTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  View Tx <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {step === 'error' && error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-xl mb-4 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-300 block mb-0.5">Transaction Failed</span>
              <p className="text-red-300/80 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {step === 'success' && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl mb-4 text-xs text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">Batch Transfer Complete!</span>
              <p className="text-emerald-300/80">
                Your batch transfer of {totalAmountStr} {tokenSymbol} to {recipientCount} recipients succeeded.
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            {step === 'success' || step === 'error' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
