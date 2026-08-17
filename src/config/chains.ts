import { defineChain } from 'viem';

export const bscMainnet = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  },
});

export const bscTestnet = defineChain({
  id: 97,
  name: 'BSC Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tBNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_BSC_TESTNET_RPC_URL ||
          'https://data-seed-prebsc-1-s1.binance.org:8545',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan Testnet',
      url: 'https://testnet.bscscan.com',
    },
  },
  testnet: true,
});
