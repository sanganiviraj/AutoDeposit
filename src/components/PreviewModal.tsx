import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-lg animate-in">
      <div className="layer-floating rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#080B12]/80">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#F3BA2F]" />
              <span>Review Batch Transaction</span>
            </h3>
            <p className="text-xs text-[#D3C5AD]/80 mt-0.5">
              Confirm all details before submitting transaction to Web3 wallet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#D3C5AD] hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-[#D4E4FA] text-xs sm:text-sm">
          {/* Mainnet Warning Banner if applicable */}
          {isMainnet ? (
            <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300 block text-xs sm:text-sm">
                  MAINNET TRANSACTION
                </span>
                <p className="text-xs text-red-300/80 mt-0.5">
                  You are about to transfer real tokens on BNB Smart Chain Mainnet. Blockchain transfers are irreversible.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-300 flex items-center justify-between">
              <span className="font-semibold text-xs">Environment: {networkName}</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-[#6BF8BA] rounded-full text-[11px] font-mono font-bold border border-emerald-500/30">
                TESTNET MODE
              </span>
            </div>
          )}

          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="layer-2 rounded-2xl p-3.5 border border-white/5">
              <span className="text-[11px] text-[#D3C5AD]/70 uppercase font-mono block mb-1">Total Amount</span>
              <span className="text-base font-bold font-mono text-[#F3BA2F]">
                {formattedTotal} {tokenSymbol}
              </span>
            </div>

            <div className="layer-2 rounded-2xl p-3.5 border border-white/5">
              <span className="text-[11px] text-[#D3C5AD]/70 uppercase font-mono block mb-1">Recipients</span>
              <span className="text-base font-bold font-mono text-white">
                {recipients.length}
              </span>
            </div>

            <div className="layer-2 rounded-2xl p-3.5 border border-white/5 col-span-2 sm:col-span-2">
              <span className="text-[11px] text-[#D3C5AD]/70 uppercase font-mono block mb-1">Spender Contract</span>
              <span className="text-xs font-mono text-[#D4E4FA] truncate block">
                {multisenderAddress || 'Configured via deployment'}
              </span>
            </div>
          </div>

          {/* Recipient breakdown list */}
          <div>
            <h4 className="font-bold text-white text-xs mb-2">
              Recipient Breakdown ({recipients.length})
            </h4>
            <div className="layer-2 rounded-2xl max-h-52 overflow-y-auto divide-y divide-white/5 font-mono text-xs border border-white/5">
              {recipients.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[#D3C5AD]/50 text-[11px]">#{idx + 1}</span>
                    <span className="text-[#D4E4FA] truncate">{item.address}</span>
                  </div>
                  <span className="font-bold text-[#F3BA2F] shrink-0">
                    {item.rawAmountStr} {tokenSymbol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gas Estimate */}
          {estimatedGasBnb && (
            <div className="p-3.5 layer-2 rounded-2xl border border-white/5 text-xs flex items-center justify-between text-[#D3C5AD]">
              <span>Estimated Network Gas Fee:</span>
              <span className="font-mono font-bold text-white">{estimatedGasBnb} BNB</span>
            </div>
          )}

          {/* Checkbox verification */}
          <div className="p-4 layer-2 rounded-2xl border border-white/10 flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmCheck"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-[#05070B] text-[#F3BA2F] focus:ring-[#F3BA2F] cursor-pointer"
            />
            <label htmlFor="confirmCheck" className="text-xs text-[#D3C5AD] cursor-pointer select-none leading-relaxed">
              I have verified all recipient wallet addresses and amounts, confirmed the token contract, and understand that blockchain batch transactions are final and irreversible.
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 bg-[#080B12]/90 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#080B12] hover:bg-white/5 text-[#D4E4FA] font-semibold text-xs rounded-xl border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isChecked}
            className="px-6 py-2.5 bg-[#F3BA2F] text-[#0B0F17] hover:shadow-[0_0_20px_rgba(243,186,47,0.4)] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs rounded-xl transition-all active:scale-95"
          >
            Confirm & Submit Batch
          </button>
        </div>
      </div>
    </div>
  );
};

