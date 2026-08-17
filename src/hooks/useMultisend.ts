import { useState } from 'react';
import { useWriteContract, useConfig } from 'wagmi';
import { estimateGas, waitForTransactionReceipt } from 'wagmi/actions';
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
  ) => Promise<{ success: boolean; hash?: `0x${string}` }>;
  estimateMultisendGas: (
    multisenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    recipients: `0x${string}`[],
    amounts: bigint[],
    userAddress: `0x${string}`,
    hasAllowance: boolean
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
    userAddress: `0x${string}`,
    hasAllowance: boolean
  ) => {
    setIsEstimatingGas(true);
    setEstimatedGasBnb(null);

    // If approval hasn't been granted yet, eth_estimateGas for multisend will fail simulation
    if (!hasAllowance) {
      setEstimatedGasBnb('Estimated after approval (~0.0005 BNB)');
      setIsEstimatingGas(false);
      return;
    }

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
      console.warn('Gas estimation warning:', err);
      const fallbackFeeWei = BigInt(80000 + recipients.length * 45000) * 3000000000n;
      setEstimatedGasBnb(`~${formatEther(fallbackFeeWei)} BNB`);
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

      // Wait for approval transaction receipt to be mined on BSC block
      await waitForTransactionReceipt(config, { hash });

      setStep('approved');
      return true;
    } catch (err: any) {
      console.error('Approval execution error:', err);
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
  ): Promise<{ success: boolean; hash?: `0x${string}` }> => {
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

      // Wait for batch transaction receipt to be mined on BSC block
      await waitForTransactionReceipt(config, { hash });

      setStep('success');
      return { success: true, hash };
    } catch (err: any) {
      console.error('Multisend execution error:', err);
      const msg = parseWeb3Error(err);
      setError(msg);
      setStep('error');
      return { success: false };
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
  if (message.includes('transfer amount exceeds allowance')) return 'Token approval pending or insufficient.';

  return message.length > 150 ? `${message.substring(0, 150)}...` : message;
}
