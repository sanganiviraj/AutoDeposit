import { useState } from 'react';
import { useWriteContract, useConfig } from 'wagmi';
import { estimateGas } from 'wagmi/actions';
import { encodeFunctionData, formatEther } from 'viem';
import { MULTISENDER_ABI, ERC20_ABI } from '../config/abi';

export type TxStep = 'idle' | 'approving' | 'approved' | 'sending' | 'success' | 'error';

export interface UseMultisendResult {
  step: TxStep;
  error: string | null;
  approveTxHash: `0x${string}` | undefined;
  multisendTxHash: `0x${string}` | undefined;
  estimatedGasBnb: string | null;
  isEstimatingGas: boolean;
  executeApproval: (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    exactAmount: bigint
  ) => Promise<boolean>;
  executeMultisend: (
    multisenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    recipients: `0x${string}`[],
    amounts: bigint[]
  ) => Promise<boolean>;
  estimateMultisendGas: (
    multisenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    recipients: `0x${string}`[],
    amounts: bigint[],
    userAddress: `0x${string}`
  ) => Promise<void>;
  resetTxState: () => void;
}

export function useMultisend(): UseMultisendResult {
  const config = useConfig();
  const [step, setStep] = useState<TxStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [multisendTxHash, setMultisendTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [estimatedGasBnb, setEstimatedGasBnb] = useState<string | null>(null);
  const [isEstimatingGas, setIsEstimatingGas] = useState<boolean>(false);

  const { writeContractAsync } = useWriteContract();

  const resetTxState = () => {
    setStep('idle');
    setError(null);
    setApproveTxHash(undefined);
    setMultisendTxHash(undefined);
    setEstimatedGasBnb(null);
  };

  const estimateMultisendGas = async (
    multisenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    recipients: `0x${string}`[],
    amounts: bigint[],
    userAddress: `0x${string}`
  ) => {
    setIsEstimatingGas(true);
    setEstimatedGasBnb(null);
    try {
      const data = encodeFunctionData({
        abi: MULTISENDER_ABI,
        functionName: 'multisend',
        args: [tokenAddress, recipients, amounts],
      });

      const gasLimit = await estimateGas(config, {
        account: userAddress,
        to: multisenderAddress,
        data,
      });

      // Average BSC gas price ~3 Gwei
      const estimatedFeeWei = gasLimit * 3000000000n;
      setEstimatedGasBnb(formatEther(estimatedFeeWei));
    } catch (err: any) {
      console.warn('Gas estimation failed:', err);
      setEstimatedGasBnb('Gas estimation unavailable (will be estimated in wallet)');
    } finally {
      setIsEstimatingGas(false);
    }
  };

  const executeApproval = async (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    exactAmount: bigint
  ): Promise<boolean> => {
    setStep('approving');
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, exactAmount],
      });
      setApproveTxHash(hash);
      setStep('approved');
      return true;
    } catch (err: any) {
      const msg = parseWeb3Error(err);
      setError(msg);
      setStep('error');
      return false;
    }
  };

  const executeMultisend = async (
    multisenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    recipients: `0x${string}`[],
    amounts: bigint[]
  ): Promise<boolean> => {
    setStep('sending');
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: multisenderAddress,
        abi: MULTISENDER_ABI,
        functionName: 'multisend',
        args: [tokenAddress, recipients, amounts],
      });
      setMultisendTxHash(hash);
      setStep('success');
      return true;
    } catch (err: any) {
      const msg = parseWeb3Error(err);
      setError(msg);
      setStep('error');
      return false;
    }
  };

  return {
    step,
    error,
    approveTxHash,
    multisendTxHash,
    estimatedGasBnb,
    isEstimatingGas,
    executeApproval,
    executeMultisend,
    estimateMultisendGas,
    resetTxState,
  };
}

function parseWeb3Error(err: any): string {
  if (!err) return 'Unknown transaction error occurred.';

  const message = err.shortMessage || err.message || String(err);

  if (message.includes('User rejected') || message.includes('user rejected') || message.includes('User denied')) {
    return 'Transaction rejected in wallet. No funds were transferred.';
  }

  if (message.includes('insufficient funds') || message.includes('Insufficient funds')) {
    return 'Insufficient BNB in wallet for gas fee.';
  }

  if (message.includes('ZeroToken')) return 'Invalid token contract address.';
  if (message.includes('EmptyRecipients')) return 'Recipient list cannot be empty.';
  if (message.includes('LengthMismatch')) return 'Recipient and amount count mismatch.';
  if (message.includes('TooManyRecipients')) return 'Exceeded maximum 100 recipients limit.';
  if (message.includes('ZeroRecipient')) return 'One or more recipient addresses are 0x0.';
  if (message.includes('ZeroAmount')) return 'One or more recipient amounts are zero.';

  return message.length > 150 ? `${message.substring(0, 150)}...` : message;
}
