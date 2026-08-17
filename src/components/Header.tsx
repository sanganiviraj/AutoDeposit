import React from 'react';
import { WalletButton } from './WalletButton';
import { Send, ShieldCheck, Clock, SendHorizontal } from 'lucide-react';
import { useChainId } from 'wagmi';
import { bscMainnet, bscTestnet } from '../config/chains';

interface HeaderProps {
  activeTab: 'sender' | 'history';
  onTabChange: (tab: 'sender' | 'history') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount }) => {
  const chainId = useChainId();

  const isMainnet = chainId === bscMainnet.id;
  const isTestnet = chainId === bscTestnet.id;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
                BSC USDT Multisender
              </h1>
              {isMainnet && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                  MAINNET
                </span>
              )}
              {isTestnet && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                  TESTNET
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Send BEP-20 USDT to multiple BSC addresses in one transaction.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Batch Sender / History) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('sender')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'sender'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Multisender</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-slate-950 text-emerald-400 text-[10px] font-bold rounded-full font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Non-Custodial</span>
          </div>

          <WalletButton />
        </div>
      </div>
    </header>
  );
};
