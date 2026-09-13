import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { SecurityCheckResult } from '../utils/security';

interface SecurityShieldProps {
  securityResult: SecurityCheckResult;
  tokenSymbol: string;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({ securityResult, tokenSymbol }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const hasWarnings = securityResult.warnings.length > 0;
  const isHighRisk = securityResult.phishingRiskCount > 0 || securityResult.contractAddressCount > 0;

  return (
    <div className={`bg-[#0B0F17]/90 backdrop-blur-xl border rounded-2xl p-5 shadow-xl transition-all ${
      isHighRisk
        ? 'border-red-500/50 bg-red-950/20'
        : hasWarnings
        ? 'border-amber-500/40 bg-amber-950/15'
        : 'border-emerald-500/20'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isHighRisk
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : hasWarnings
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-[#6BF8BA] border-emerald-500/20'
          }`}>
            {isHighRisk ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight whitespace-nowrap">
                Web3 Anti-Fraud Guardian Shield
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide ${
                isHighRisk
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/15 text-[#6BF8BA] border border-emerald-500/30'
              }`}>
                {isHighRisk ? 'RISK DETECTED' : 'PROTECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal">
              Active scan for phishing traps, contract drains, and allowance exploits.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border border-white/10 shrink-0 cursor-pointer active:scale-95"
        >
          <span>{isDetailsOpen ? 'Hide Audit' : 'Security Badges'}</span>
          {isDetailsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Security Warnings List */}
      {hasWarnings && (
        <div className="mt-4 space-y-2 pt-3 border-t border-white/10">
          {securityResult.warnings.map((warn, idx) => (
            <div
              key={idx}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2 font-mono"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Security Checklist */}
      {isDetailsOpen && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in">
          {/* Protocol 1 */}
          <div className="bg-[#05070B] border border-white/5 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-[#6BF8BA] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Anti-Phishing Guard</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scans recipient addresses against zero/burn traps and malicious contract code.
            </p>
          </div>

          {/* Protocol 2 */}
          <div className="bg-[#05070B] border border-white/5 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-[#6BF8BA] font-semibold">
              <Lock className="w-4 h-4" />
              <span>Exact Approval Policy</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Zero infinite token allowances. Strictly approves exact batch sum ({tokenSymbol}).
            </p>
          </div>

          {/* Protocol 3 */}
          <div className="bg-[#05070B] border border-white/5 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-[#6BF8BA] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Non-Custodial Smart Contract</span>
            </div>
            <p className="text-[11px] text-slate-400">
              0 Owner keys, 0 admin withdraw functions, 0 platform tax.
            </p>
          </div>

          {/* Protocol 4 */}
          <div className="bg-[#05070B] border border-white/5 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-[#6BF8BA] font-semibold">
              <Eye className="w-4 h-4" />
              <span>Contract Trap Protection</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prevents token loss when sending to non-ERC20 recipient smart contracts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


