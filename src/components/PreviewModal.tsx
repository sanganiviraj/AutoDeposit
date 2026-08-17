import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { safeFormatUnits } from '../utils/amounts';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  networkName: string;
  isMainnet: boolean;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  recipients: { address: `0x${string}`; amount: bigint; rawAmountStr: string }[];
  totalAmountBigInt: bigint;
  multisenderAddress?: string;
  estimatedGasBnb?: string | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  networkName,
  isMainnet,
  tokenSymbol,
  tokenDecimals,
  tokenAddress,
  recipients,
  totalAmountBigInt,
  multisenderAddress,
  estimatedGasBnb,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const formattedTotal = safeFormatUnits(totalAmountBigInt, tokenDecimals, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Review Batch Transaction
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm all details before submitting transaction to wallet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-300 text-xs sm:text-sm">
          {/* Mainnet Warning Banner if applicable */}
          {isMainnet ? (
            <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300 block text-xs sm:text-sm">
                  MAINNET TRANSACTION
                </span>
                <p className="text-xs text-red-300/80 mt-0.5">
                  You are about to transfer real USDT on BNB Smart Chain Mainnet. Transfers are irreversible.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-between">
              <span className="font-semibold text-xs">Environment: {networkName}</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[11px] font-bold">
                TESTNET MODE
              </span>
            </div>
          )}

          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Total Amount</span>
              <span className="text-sm sm:text-base font-bold text-emerald-400">
                {formattedTotal} {tokenSymbol}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Recipients</span>
              <span className="text-sm sm:text-base font-bold text-slate-100">
                {recipients.length}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 col-span-2 sm:col-span-2">
              <span className="text-[11px] text-slate-400 block">Multisender Spender Contract</span>
              <span className="text-xs font-mono text-slate-300 truncate block">
                {multisenderAddress || 'Configured via deployment'}
              </span>
            </div>
          </div>

          {/* Recipient breakdown list */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs mb-2">
              Recipient Breakdown ({recipients.length})
            </h4>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl max-h-52 overflow-y-auto divide-y divide-slate-800 font-mono text-xs">
              {recipients.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-slate-500 text-[11px]">#{idx + 1}</span>
                    <span className="text-slate-300 truncate">{item.address}</span>
                  </div>
                  <span className="font-semibold text-emerald-400 shrink-0">
                    {item.rawAmountStr} {tokenSymbol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gas Estimate */}
          {estimatedGasBnb && (
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-xs flex items-center justify-between text-slate-400">
              <span>Estimated Gas Fee:</span>
              <span className="font-mono font-semibold text-slate-200">{estimatedGasBnb} BNB</span>
            </div>
          )}

          {/* Checkbox verification */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmCheck"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="confirmCheck" className="text-xs text-slate-300 cursor-pointer select-none">
              I have checked all recipient addresses and amounts, verified the token address and network, and understand that blockchain transactions are irreversible.
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isChecked}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition-all"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
