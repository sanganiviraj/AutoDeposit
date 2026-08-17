import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { bscMainnet, bscTestnet } from '../config/chains';

export const NetworkWarning: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const isSupported = chainId === bscMainnet.id || chainId === bscTestnet.id;

  if (isSupported) return null;

  return (
    <div className="bg-amber-950/80 border border-amber-500/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-amber-200 text-sm sm:text-base">
            Unsupported Network Detected
          </h4>
          <p className="text-xs sm:text-sm text-amber-300/80">
            Please switch your wallet to BNB Smart Chain or BSC Testnet to send USDT.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => switchChain?.({ chainId: bscTestnet.id })}
          disabled={isPending}
          className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
          Switch to BSC Testnet
        </button>
        <button
          onClick={() => switchChain?.({ chainId: bscMainnet.id })}
          disabled={isPending}
          className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
        >
          Switch to BSC Mainnet
        </button>
      </div>
    </div>
  );
};
