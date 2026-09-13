import React from 'react';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import {
  Key,
  CheckSquare,
  Zap,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  FileText,
  GitBranch,
  Shield,
  Gauge,
  Coins,
  ArrowRight,
  ShieldCheck,
  ArrowDown,
  Rocket,
  Code,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full text-[#D4E4FA] animate-in pb-0 selection:bg-[#F3BA2F] selection:text-[#0B0F17]">
      {/* 1. Hero Section with Background Beams Collision */}
      <BackgroundBeamsWithCollision className="min-h-screen pt-20 pb-16">
        <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden z-10" id="hero-section">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold text-[#F3BA2F] uppercase tracking-wider">
                NON-CUSTODIAL WEB3 PAYMENTS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-glow leading-tight">
              <span className="inline-flex flex-wrap items-center gap-x-2.5">
                <span>Send tokens to</span>
                <ContainerTextFlip
                  words={['hundreds', 'thousands', 'multiple', 'scalable']}
                  interval={2800}
                />
                <span>of wallets.</span>
              </span>
              <span className="text-[#D3C5AD] block mt-3">In one transaction.</span>
            </h1>



            <p className="text-base sm:text-lg text-[#D3C5AD] max-w-xl leading-relaxed">
              AutoDeposit lets you distribute USDT and other BEP-20 tokens across multiple wallets with one transparent, wallet-signed transaction.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchApp}
                className="px-8 py-4 rounded-xl font-bold text-sm bg-[#F3BA2F] text-[#0B0F17] hover:shadow-[0_0_25px_rgba(243,186,47,0.4)] transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Launch AutoDeposit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('process')}
                className="px-8 py-4 rounded-xl font-bold text-sm text-[#D4E4FA] border border-white/10 hover:bg-white/5 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Micro Specs Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10 font-mono text-xs text-[#D3C5AD]/70">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6BF8BA]" />
                <span>Non-custodial</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#5B8CFF]" />
                <span>Wallet-signed</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#F3BA2F]" />
                <span>BNB Smart Chain</span>
              </div>
            </div>
          </div>

          {/* Right 3D Floating Dashboard Card Preview */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="ambient-glow -top-20 -left-20"></div>
            <div className="glass-card rounded-2xl border border-white/15 p-5 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-500">
              {/* Fake Header */}
              <div className="h-12 border-b border-white/10 flex items-center justify-between px-3 bg-white/5 rounded-t-xl mb-4">
                <span className="font-semibold text-sm text-white">Send Tokens</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                </div>
              </div>

              {/* Fake Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-[#D3C5AD] mb-1">Total Distribution</div>
                    <div className="font-mono text-2xl font-bold text-white">
                      12,450.00 <span className="text-[#F3BA2F] text-sm">USDT</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#D3C5AD] mb-1">Recipients</div>
                    <div className="font-mono text-2xl font-bold text-[#6BF8BA]">48</div>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-white/5 rounded-xl bg-[#080B12] overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-2 p-3 border-b border-white/5 bg-white/5 text-[#D3C5AD] uppercase text-[10px] font-bold">
                    <div>Address</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="p-3 grid grid-cols-2 border-b border-white/5 text-slate-300">
                    <div className="truncate">0x71C...976F</div>
                    <div className="text-right text-[#F3BA2F]">250.00</div>
                  </div>
                  <div className="p-3 grid grid-cols-2 border-b border-white/5 text-slate-300">
                    <div className="truncate">0x892...3B42</div>
                    <div className="text-right text-[#F3BA2F]">100.50</div>
                  </div>
                  <div className="p-3 grid grid-cols-2 opacity-50 text-slate-300">
                    <div className="truncate">0x3A1...C899</div>
                    <div className="text-right text-[#F3BA2F]">500.00</div>
                  </div>
                </div>

                <button
                  onClick={onLaunchApp}
                  className="w-full py-3 rounded-xl bg-[#F3BA2F]/20 text-[#F3BA2F] border border-[#F3BA2F]/40 font-bold text-xs hover:bg-[#F3BA2F] hover:text-[#0B0F17] transition-all cursor-pointer"
                >
                  Approve Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </BackgroundBeamsWithCollision>

      {/* 2. Trust Bar / Live Statistics */}
      <section className="py-10 border-y border-white/5 bg-[#051424]/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/5 text-center">
            <div className="px-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D3C5AD] mb-1">
                Total Volume Processed
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#F3BA2F] text-glow">
                $45M+
              </div>
            </div>

            <div className="px-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D3C5AD] mb-1">
                Transactions
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#F3BA2F] text-glow">
                125K+
              </div>
            </div>

            <div className="px-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D3C5AD] mb-1">
                Supported Networks
              </div>
              <div className="text-3xl font-extrabold font-mono text-white">
                BNB Chain
              </div>
            </div>

            <div className="px-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D3C5AD] mb-1">
                Uptime
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#6BF8BA]">
                99.99%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Feature Section (Enterprise-Grade Infrastructure) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" id="premium-features">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Enterprise-Grade Infrastructure
          </h2>
          <p className="text-[#D3C5AD] text-base max-w-2xl mx-auto">
            Built for scale, security, and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-[#F3BA2F]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center mb-6 text-[#F3BA2F]">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Non-Custodial Design</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Your private keys never leave your device. AutoDeposit facilitates the transaction directly between your wallet and the smart contract, ensuring you retain full control of your assets at all times.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-[#F3BA2F]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center mb-6 text-[#F3BA2F]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Exact Amount Approvals</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              We enforce strict security best practices by requesting approval only for the exact amount needed for your distribution, preventing the risk of unlimited token allowances.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-[#F3BA2F]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center mb-6 text-[#F3BA2F]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Atomic Execution</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Distributions occur within a single atomic transaction. Either all transfers succeed, or the entire transaction reverts, eliminating the risk of partial, messy distributions.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-[#F3BA2F]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center mb-6 text-[#F3BA2F]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">CSV Powered Automation</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Seamlessly import thousands of addresses and unique token amounts via standard CSV files. Our parser validates data instantly, highlighting errors before you sign.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Distribution Process (Process Flow) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#051424]/30 border-y border-white/5" id="process">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-16">
            The Distribution Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Horizontal Line on Desktop */}
            <div className="hidden md:block absolute top-7 left-10 right-10 h-0.5 bg-white/10 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#051424] border border-[#F3BA2F] text-[#F3BA2F] font-bold text-xl flex items-center justify-center shadow-[0_0_15px_rgba(243,186,47,0.2)]">
                1
              </div>
              <h4 className="font-bold text-white text-base">Connect</h4>
              <p className="text-xs text-[#D3C5AD] max-w-[150px]">Link your web3 wallet to the dApp.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#051424] border border-white/20 text-[#D4E4FA] font-bold text-xl flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-white text-base">Add</h4>
              <p className="text-xs text-[#D3C5AD] max-w-[150px]">Upload CSV or input addresses manually.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#051424] border border-white/20 text-[#D4E4FA] font-bold text-xl flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-white text-base">Review</h4>
              <p className="text-xs text-[#D3C5AD] max-w-[150px]">Verify amounts and recipient count.</p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#051424] border border-white/20 text-[#D4E4FA] font-bold text-xl flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-white text-base">Approve</h4>
              <p className="text-xs text-[#D3C5AD] max-w-[150px]">Sign exact token allowance.</p>
            </div>

            {/* Step 5 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#051424] border border-white/20 text-[#D4E4FA] font-bold text-xl flex items-center justify-center">
                5
              </div>
              <h4 className="font-bold text-white text-base">Send</h4>
              <p className="text-xs text-[#D3C5AD] max-w-[150px]">Execute single batch transaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Security Technical Deep-Dive & Diagram */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" id="security">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for Absolute Security
            </h2>
            <p className="text-base text-[#D3C5AD] leading-relaxed">
              AutoDeposit's architecture ensures your assets are never at risk. We utilize established patterns to guarantee a trustless environment.
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#F3BA2F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Private Key Isolation</div>
                  <div className="text-xs text-[#D3C5AD] leading-relaxed mt-0.5">
                    Your private key remains encrypted within your wallet (e.g., MetaMask). The dApp only requests cryptographic signatures.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#F3BA2F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Stateless Contracts</div>
                  <div className="text-xs text-[#D3C5AD] leading-relaxed mt-0.5">
                    Our smart contracts do not hold funds. They act purely as a routing mechanism during the exact block of execution.
                  </div>
                </div>
              </li>
            </ul>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-[#D3C5AD]">
                <ShieldCheck className="w-4 h-4 text-[#6BF8BA]" />
                <span className="font-mono font-bold uppercase tracking-wider">OpenZeppelin Standard</span>
              </div>
            </div>
          </div>

          {/* Right Diagram Card */}
          <div className="lg:col-span-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
              {/* Wallet */}
              <div className="p-4 rounded-xl border border-[#F3BA2F]/30 bg-[#F3BA2F]/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F3BA2F]/10 flex items-center justify-center text-[#F3BA2F]">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Your Wallet</div>
                    <div className="text-[10px] font-mono text-[#F3BA2F] font-bold">PRIVATE KEY SECURED</div>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-slate-400" />
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center text-slate-400 text-xs font-mono">
                <span>Provides Signature</span>
                <ArrowDown className="w-4 h-4 mt-1 animate-bounce text-[#F3BA2F]" />
              </div>

              {/* Contract */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#051424] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">AutoDeposit Contract</div>
                    <div className="text-[10px] font-mono text-slate-400">STATELESS ROUTER</div>
                  </div>
                </div>
                <Code className="w-5 h-5 text-slate-400" />
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center text-slate-400 text-xs font-mono">
                <span>Executes Batch Transfer</span>
                <GitBranch className="w-4 h-4 mt-1 text-[#F3BA2F]" />
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg border border-white/5 bg-[#051424]/60 text-center font-mono text-xs text-slate-300">
                  Recipient 1
                </div>
                <div className="p-3 rounded-lg border border-white/5 bg-[#051424]/60 text-center font-mono text-xs text-slate-300">
                  Recipient 2
                </div>
                <div className="p-3 rounded-lg border border-white/5 bg-[#051424]/60 text-center font-mono text-xs text-slate-300">
                  Recipient N
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Network Section (Native to BNB Smart Chain) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#F0B90B]/5 border-y border-[#F0B90B]/10" id="network">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F0B90B]/20 text-[#F0B90B] mx-auto mb-2 shadow-[0_0_20px_rgba(240,185,11,0.2)]">
            <Coins className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Native to BNB Smart Chain
          </h2>

          <p className="text-base text-[#D3C5AD] max-w-2xl mx-auto leading-relaxed">
            Optimized specifically for BSC's low-latency, high-throughput environment. Send to thousands of addresses with near-zero gas fees.
          </p>

          <div className="flex justify-center items-center gap-8 pt-4">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-[#F0B90B]">BEP-20</div>
              <div className="text-[11px] font-mono uppercase text-[#D3C5AD] mt-1">Full Token Support</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-[#F0B90B]">~0.01 BNB</div>
              <div className="text-[11px] font-mono uppercase text-[#D3C5AD] mt-1">Avg Batch Gas Cost</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Features Grid (Gas Optimized, OpenZeppelin Standard, BEP-20 Native) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" id="features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <Gauge className="w-10 h-10 text-[#F3BA2F]" />
            <h3 className="text-xl font-bold text-white">Gas Optimized</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Distribute to hundreds of wallets in seconds. Our smart contracts use advanced assembly and memory packing to minimize gas costs on the BNB Smart Chain.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <Shield className="w-10 h-10 text-[#F3BA2F]" />
            <h3 className="text-xl font-bold text-white">OpenZeppelin Standard</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Fully non-custodial smart contracts built on OpenZeppelin primitives and audited by industry-leading security firms for maximum peace of mind.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <Coins className="w-10 h-10 text-[#F3BA2F]" />
            <h3 className="text-xl font-bold text-white">BEP-20 Native</h3>
            <p className="text-sm text-[#D3C5AD] leading-relaxed">
              Deep integration with all standard BEP-20 tokens (USDT, USDC, BUSD). Supports all major web3 wallets and seamlessly integrates with your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 text-center" id="cta">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-glow">
            Ready to streamline your distributions?
          </h2>
          <p className="text-base text-[#D3C5AD]">
            Connect your wallet and experience the fastest, most secure way to send tokens on the BNB Smart Chain.
          </p>
          <button
            onClick={onLaunchApp}
            className="px-10 py-4 rounded-xl font-bold text-sm bg-[#F3BA2F] text-[#0B0F17] hover:shadow-[0_0_30px_rgba(243,186,47,0.5)] transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Launch AutoDeposit Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 9. Complete Footer */}
      <footer className="bg-[#010F1F] w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="font-extrabold text-2xl text-[#F3BA2F] tracking-tight">AutoDeposit</div>
            <p className="text-xs text-[#D3C5AD]/60 max-w-sm leading-relaxed">
              Premium Web3 Infrastructure for non-custodial multisender protocols. Secure, fast, and optimized for scale.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#122131] border border-white/5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#6BF8BA] animate-pulse"></span>
              <span className="text-[11px] font-mono text-[#D3C5AD]">BSC Network: Operational</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-[#D3C5AD]/80">
              <li><button onClick={onLaunchApp} className="hover:text-[#F3BA2F] transition-colors cursor-pointer">Launch App</button></li>
              <li><a href="#process" className="hover:text-[#F3BA2F] transition-colors">How it Works</a></li>
              <li><a href="#premium-features" className="hover:text-[#F3BA2F] transition-colors">Pricing</a></li>
              <li><a href="#features" className="hover:text-[#F3BA2F] transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">Developers</h4>
            <ul className="space-y-2.5 text-xs text-[#D3C5AD]/80">
              <li><a href="#security" className="hover:text-[#F3BA2F] transition-colors">Documentation</a></li>
              <li><a href="#security" className="hover:text-[#F3BA2F] transition-colors">Smart Contracts</a></li>
              <li><a href="#security" className="hover:text-[#F3BA2F] transition-colors">Security Audit</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#F3BA2F] transition-colors">Github</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">Network & Legal</h4>
            <ul className="space-y-2.5 text-xs text-[#D3C5AD]/80">
              <li><a href="#network" className="hover:text-[#F3BA2F] transition-colors">BNB Smart Chain</a></li>
              <li><a href="#" className="hover:text-[#F3BA2F] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#F3BA2F] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#F3BA2F] transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#D3C5AD]/60">
          <div>© 2024 AutoDeposit. Non-custodial multisender protocol.</div>
          <div className="flex gap-4">
            <Rocket className="w-4 h-4 text-[#D3C5AD]/60 hover:text-[#F3BA2F] cursor-pointer" />
            <Code className="w-4 h-4 text-[#D3C5AD]/60 hover:text-[#F3BA2F] cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};
