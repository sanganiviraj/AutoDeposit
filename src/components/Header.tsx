import React, { useState } from 'react';
import { WalletButton } from './WalletButton';
import { Coins, LayoutDashboard, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { useChainId } from 'wagmi';
import { bscMainnet, bscTestnet } from '../config/chains';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

export type ViewTab = 'landing' | 'sender' | 'history';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount }) => {
  const chainId = useChainId();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMainnet = chainId === bscMainnet.id;
  const isTestnet = chainId === bscTestnet.id;

  const handleNavClick = (tab: ViewTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      name: 'Product Landing',
      link: '#landing',
      onClick: () => handleNavClick('landing'),
      isActive: activeTab === 'landing',
    },
    {
      name: 'App Dashboard',
      link: '#dashboard',
      onClick: () => handleNavClick('sender'),
      isActive: activeTab === 'sender',
    },
    {
      name: `History ${historyCount > 0 ? `(${historyCount})` : ''}`,
      link: '#history',
      onClick: () => handleNavClick('history'),
      isActive: activeTab === 'history',
    },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation Body */}
      <NavBody>
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F3BA2F]/10 border border-[#F3BA2F]/30 flex items-center justify-center text-[#F3BA2F] group-hover:scale-105 transition-all">
            <Coins className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[#F3BA2F] text-glow">
              AutoDeposit
            </span>
            {isMainnet && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold">
                MAINNET
              </span>
            )}
            {isTestnet && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-[#6BF8BA] border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold">
                TESTNET
              </span>
            )}
          </div>
        </div>

        {/* Center Nav Items */}
        <NavItems items={navItems} />

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-emerald-500/20 rounded-full text-[11px] text-[#6BF8BA] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Verified</span>
          </div>
          <WalletButton />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F3BA2F]/10 border border-[#F3BA2F]/30 flex items-center justify-center text-[#F3BA2F]">
              <Coins className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#F3BA2F]">
              AutoDeposit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <WalletButton />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="w-full space-y-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                activeTab === 'landing' ? 'bg-[#F3BA2F] text-[#0B0F17]' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Product Landing Page</span>
            </button>

            <button
              onClick={() => handleNavClick('sender')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                activeTab === 'sender' ? 'bg-[#F3BA2F] text-[#0B0F17]' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Application Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === 'history' ? 'bg-[#F3BA2F] text-[#0B0F17]' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Transaction History</span>
              </div>
              {historyCount > 0 && (
                <span className="px-2 py-0.5 bg-[#05070B] text-[#F3BA2F] text-xs font-mono rounded-full font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};


