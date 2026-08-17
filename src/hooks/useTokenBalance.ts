import { useReadContracts, useChainId } from 'wagmi';
import { ERC20_ABI } from '../config/abi';
import { getDefaultTokenForChain } from '../config/tokens';

export interface TokenBalanceData {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  balance: bigint;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTokenBalance(
  tokenAddress?: `0x${string}`,
  userAddress?: `0x${string}`
): TokenBalanceData {
  const chainId = useChainId();
  const defaultToken = getDefaultTokenForChain(chainId);
  const targetTokenAddress = tokenAddress || defaultToken.address;

  const erc20Contract = {
    address: targetTokenAddress,
    abi: ERC20_ABI,
  } as const;

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'symbol',
      },
      {
        ...erc20Contract,
        functionName: 'decimals',
      },
      {
        ...erc20Contract,
        functionName: 'balanceOf',
        args: userAddress ? [userAddress] : undefined,
      },
    ],
    query: {
      enabled: Boolean(targetTokenAddress),
    },
  });

  const symbol = (data?.[0]?.result as string) || defaultToken.symbol;
  const decimals = (data?.[1]?.result as number) ?? defaultToken.decimals;
  const balance = (data?.[2]?.result as bigint) ?? 0n;

  return {
    address: targetTokenAddress,
    symbol,
    decimals,
    balance,
    isLoading,
    isError,
    refetch,
  };
}
