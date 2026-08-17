import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bscMainnet, bscTestnet } from './chains';

// Read Reown Project ID from environment variable
export const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || 'b56e64d476b8b60018599f7123456789';

export const networks = [bscTestnet, bscMainnet] as const;

export const wagmiAdapter = new WagmiAdapter({
  networks: [bscTestnet, bscMainnet],
  projectId,
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Initialize Reown AppKit Web3 modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [bscTestnet, bscMainnet],
  defaultNetwork: bscTestnet,
  projectId,
  metadata: {
    name: 'BSC USDT Multisender',
    description: 'Non-custodial BEP-20 USDT batch transfer dApp for BNB Smart Chain.',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://bsc-usdt-multisender.app',
    icons: ['https://bscscan.com/images/svg/brands/bnb.svg'],
  },
  features: {
    analytics: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#059669',
    '--w3m-border-radius-master': '2px',
  },
});
