import React from 'react';
import { Plus, Trash2, Users, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { RecipientInput, RecipientValidationError } from '../utils/validation';

interface RecipientTableProps {
  recipients: RecipientInput[];
  errors: RecipientValidationError[];
  allowDuplicates: boolean;
  onUpdateRecipient: (id: string, field: 'address' | 'amount', value: string) => void;
  onAddRecipient: () => void;
  onRemoveRecipient: (id: string) => void;
  onToggleDuplicates: () => void;
  tokenSymbol: string;
}

export const RecipientTable: React.FC<RecipientTableProps> = ({
  recipients,
  errors,
  allowDuplicates,
  onUpdateRecipient,
  onAddRecipient,
  onRemoveRecipient,
  onToggleDuplicates,
  tokenSymbol,
}) => {
  const getRowError = (rowNum: number, field: 'address' | 'amount') => {
    return errors.find((e) => e.row === rowNum && (e.field === field || e.field === 'general'))?.message;
  };

  return (
    <div className="bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center text-[#F3BA2F] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Recipient Addresses & Amounts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify destination wallet addresses and token transfer values.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Allow Duplicates Toggle */}
          <button
            onClick={onToggleDuplicates}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {allowDuplicates ? (
              <ToggleRight className="w-6 h-6 text-[#F3BA2F]" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-600" />
            )}
            <span>Allow Duplicates</span>
          </button>

          {/* Row Count Pill */}
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono font-semibold text-slate-300">
            <span className="text-[#F3BA2F]">{recipients.length}</span> / 100
          </div>
        </div>
      </div>

      {/* Recipient Rows */}
      <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
        {recipients.map((item, index) => {
          const rowNum = index + 1;
          const addrErr = getRowError(rowNum, 'address');
          const amtErr = getRowError(rowNum, 'amount');

          return (
            <div
              key={item.id}
              className="bg-[#05070B] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-400">Recipient #{rowNum}</span>
                {recipients.length > 1 && (
                  <button
                    onClick={() => onRemoveRecipient(item.id)}
                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Address Field */}
                <div className="md:col-span-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="BSC Address (0x...)"
                      value={item.address}
                      onChange={(e) => onUpdateRecipient(item.id, 'address', e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-[#080B12] border rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                        addrErr
                          ? 'border-red-500/60 focus:border-red-500 bg-red-950/10'
                          : 'border-white/10 focus:border-[#F3BA2F] focus:bg-[#05070B]'
                      }`}
                    />
                  </div>
                  {addrErr && (
                    <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {addrErr}
                    </span>
                  )}
                </div>

                {/* Amount Field */}
                <div className="md:col-span-4">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => onUpdateRecipient(item.id, 'amount', e.target.value)}
                      className={`w-full pl-3.5 pr-16 py-2.5 bg-[#080B12] border rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                        amtErr
                          ? 'border-red-500/60 focus:border-red-500 bg-red-950/10'
                          : 'border-white/10 focus:border-[#F3BA2F] focus:bg-[#05070B]'
                      }`}
                    />
                    <div className="absolute right-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-mono font-bold text-[#F3BA2F]">
                      {tokenSymbol}
                    </div>
                  </div>
                  {amtErr && (
                    <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {amtErr}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Recipient Action */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={onAddRecipient}
          disabled={recipients.length >= 100}
          className="px-4 py-2.5 bg-[#F3BA2F]/10 hover:bg-[#F3BA2F]/20 disabled:opacity-40 text-[#F3BA2F] border border-[#F3BA2F]/30 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recipient Row</span>
        </button>
      </div>
    </div>
  );
};


