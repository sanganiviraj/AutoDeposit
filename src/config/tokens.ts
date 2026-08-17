import { bscMainnet, bscTestnet } from './chains';

export interface TokenConfig {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
}

export const MAINNET_USDT: TokenConfig = {
  address: (import.meta.env.VITE_USDT_ADDRESS as `0x${string}`) || '0x55d398326f99059fF775485246999027B3197955',
  symbol: 'USDT',
  name: 'Tether USD',
  decimals: 18,
};

export const TESTNET_USDT: TokenConfig = {
  address: (import.meta.env.VITE_TESTNET_USDT_ADDRESS as `0x${string}`) || '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  symbol: 'USDT',
  name: 'Testnet Tether USD',
  decimals: 18,
};

export function getDefaultTokenForChain(chainId?: number): TokenConfig {
  if (chainId === bscMainnet.id) {
    return MAINNET_USDT;
  }
  return TESTNET_USDT;
}

export function getMultisenderAddressForChain(chainId?: number): `0x${string}` | undefined {
  const envAddr = import.meta.env.VITE_MULTISENDER_ADDRESS;
  if (envAddr && envAddr.startsWith('0x') && envAddr.length === 42) {
    return envAddr as `0x${string}`;
  }
  return undefined;
}
