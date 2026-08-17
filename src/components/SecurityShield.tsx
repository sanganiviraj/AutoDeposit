import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';
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
    <div className={`rounded-2xl border p-5 transition-all mb-6 shadow-xl ${
      isHighRisk
        ? 'bg-red-950/40 border-red-500/60'
        : hasWarnings
        ? 'bg-amber-950/30 border-amber-500/50'
        : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-emerald-500/30'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border shrink-0 ${
            isHighRisk
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : hasWarnings
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {isHighRisk ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-100">
                Web3 Anti-Fraud & Security Guardian
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                isHighRisk
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isHighRisk ? 'RISK DETECTED' : '100% PROTECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active protection against phishing, zero addresses, contract traps, and unlimited drainers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>{isDetailsOpen ? 'Hide Security Checklist' : 'Security Badges'}</span>
          {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Security Warnings List */}
      {hasWarnings && (
        <div className="mt-4 space-y-2 pt-3 border-t border-slate-800">
          {securityResult.warnings.map((warn, idx) => (
            <div
              key={idx}
              className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Security Checklist */}
      {isDetailsOpen && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in">
          {/* Protocol 1: Anti-Phishing Shield */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Anti-Phishing Guard</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scans addresses against known zero/burn traps and drainer scripts.
            </p>
          </div>

          {/* Protocol 2: Exact Allowance Enforcement */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Exact Approval Policy</span>
            </div>
            <p className="text-[11px] text-slate-400">
              No unlimited approvals. Approves strictly exact batch sum ({tokenSymbol}).
            </p>
          </div>

          {/* Protocol 3: Non-Custodial Contract */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>0 Owner / 0 Fee Contract</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Contract has zero admin keys, zero withdrawal functions, and zero fees.
            </p>
          </div>

          {/* Protocol 4: Contract Trap Protection */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Eye className="w-4 h-4" />
              <span>Contract Trap Protection</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prevents sending tokens to contract addresses that lack token withdrawal functions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
