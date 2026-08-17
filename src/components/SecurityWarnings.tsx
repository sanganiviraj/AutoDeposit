import React from 'react';
import { ShieldCheck, Info, AlertOctagon } from 'lucide-react';

export const SecurityWarnings: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-emerald-300 block mb-0.5">Non-Custodial dApp</span>
          <p className="text-emerald-400/80">
            Never enter your seed phrase or private key into this website. Your wallet retains full control.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-blue-300 block mb-0.5">Recipient Verification</span>
          <p className="text-slate-400">
            Always verify the network, token contract, recipient addresses, and amounts before signing.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-300 block mb-0.5">Irreversible Transactions</span>
          <p className="text-slate-400">
            Blockchain transactions are irreversible. Ensure destination addresses are accurate.
          </p>
        </div>
      </div>
    </div>
  );
};
