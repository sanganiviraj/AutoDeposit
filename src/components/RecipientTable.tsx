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
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base">Recipient List</h3>
            <p className="text-xs text-slate-400">
              Enter target BSC wallet addresses and exact token amounts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Duplicate toggle */}
          <button
            onClick={onToggleDuplicates}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            {allowDuplicates ? (
              <ToggleRight className="w-6 h-6 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-600" />
            )}
            <span>Allow Duplicates</span>
          </button>

          {/* Recipient count badge */}
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold border border-slate-700">
            {recipients.length} / 100
          </span>
        </div>
      </div>

      {/* Recipient list rows */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {recipients.map((item, index) => {
          const rowNum = index + 1;
          const addrErr = getRowError(rowNum, 'address');
          const amtErr = getRowError(rowNum, 'amount');

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                addrErr || amtErr
                  ? 'bg-red-950/20 border-red-500/40'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-slate-300">Recipient #{rowNum}</span>
                {recipients.length > 1 && (
                  <button
                    onClick={() => onRemoveRecipient(item.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded"
                    title="Remove recipient"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Address Input */}
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    placeholder="BSC Address (0x...)"
                    value={item.address}
                    onChange={(e) => onUpdateRecipient(item.id, 'address', e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-lg text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      addrErr
                        ? 'border-red-500/60 focus:border-red-500'
                        : 'border-slate-800 focus:border-emerald-500/60'
                    }`}
                  />
                  {addrErr && (
                    <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {addrErr}
                    </span>
                  )}
                </div>

                {/* Amount Input */}
                <div className="sm:col-span-4 relative">
                  <input
                    type="text"
                    placeholder="Amount (e.g. 1)"
                    value={item.amount}
                    onChange={(e) => onUpdateRecipient(item.id, 'amount', e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-lg text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition-all pr-14 ${
                      amtErr
                        ? 'border-red-500/60 focus:border-red-500'
                        : 'border-slate-800 focus:border-emerald-500/60'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                    {tokenSymbol}
                  </span>
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
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onAddRecipient}
          disabled={recipients.length >= 100}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Recipient
        </button>
      </div>
    </div>
  );
};
