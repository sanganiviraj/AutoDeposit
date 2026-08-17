import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../config/abi';

export interface TokenAllowanceData {
  allowance: bigint;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTokenAllowance(
  tokenAddress?: `0x${string}`,
  userAddress?: `0x${string}`,
  spenderAddress?: `0x${string}`
): TokenAllowanceData {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    query: {
      enabled: Boolean(tokenAddress && userAddress && spenderAddress),
    },
  });

  return {
    allowance: (data as bigint) ?? 0n,
    isLoading,
    isError,
    refetch,
  };
}
