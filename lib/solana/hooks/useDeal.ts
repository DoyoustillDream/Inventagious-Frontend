'use client';

import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { getConnection } from '../connection';
import {
  createDealTransaction,
  acceptDealTransaction,
  rejectDealTransaction,
  cancelDealTransaction,
  releaseMilestoneTransaction,
  completeDealTransaction,
  getDeal,
  useDealEscrowProgram,
} from '../deal';
import { dealsApi } from '@/lib/api/deals';
import { normalizeUrl } from '@/lib/utils/url';

/**
 * Hook for deal operations
 */
export function useDeal() {
  const { publicKey, connected, signAndSendTransaction } = usePhantomWallet();
  const { program } = useDealEscrowProgram();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a deal on-chain
   */
  const createDeal = useCallback(
    async (
      projectId: string,
      inventorWalletAddress: string,
      amount: number,
      proposedDeadline: number,
      termsHash?: string,
    ): Promise<{ signature: string; dealPda: string }> => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const connection = await getConnection();
        const inventorPubkey = new PublicKey(inventorWalletAddress);

        // Build transaction
        const { transaction, dealPda } = await createDealTransaction(
          publicKey,
          inventorPubkey,
          projectId, // Using projectId as dealId
          amount,
          proposedDeadline,
          termsHash,
          program,
          connection,
        );

        // Send transaction using Phantom SDK
        const result = await signAndSendTransaction(transaction);
        const signature = result.hash;

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with wallet address and signature
        await dealsApi.create({
          projectId,
          amount,
          proposedDeadline: new Date(proposedDeadline * 1000).toISOString(),
          investorWalletAddress: publicKey.toBase58(),
          transactionSignature: signature,
        });

        return {
          signature,
          dealPda: dealPda.toBase58(),
        };
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to create deal';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey, signAndSendTransaction, program],
  );

  /**
   * Accept a deal (inventor accepts, investor signs to transfer funds)
   * Supports both on-chain smart contract and off-chain direct SOL transfers
   */
  const acceptDeal = useCallback(
    async (
      dealId: string,
      dealPda: string | undefined,
      inventorWalletAddress: string,
      dealAmount?: number, // Required for off-chain deals
    ): Promise<string> => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const connection = await getConnection();
        // Check if deal uses on-chain smart contracts
        const useOnChain = dealPda && dealPda.length > 0 && program;

        if (useOnChain) {
          // On-chain smart contract flow (existing logic)
          try {
            const dealPubkey = new PublicKey(dealPda);
            const inventorPubkey = new PublicKey(inventorWalletAddress);

            const transaction = await acceptDealTransaction(
              publicKey,
              inventorPubkey,
              dealPubkey,
              program,
              connection,
            );

            const result = await signAndSendTransaction(transaction);
            const signature = result.hash;
            await connection.confirmTransaction(signature, 'confirmed');

            await dealsApi.update(
              dealId,
              {
                status: 'accepted',
                walletAddress: publicKey.toBase58(),
                transactionSignature: signature,
              },
              'inventor',
            );

            return signature;
          } catch (onChainError: any) {
            // If on-chain fails, fall back to direct transfer
            console.warn('On-chain deal acceptance failed, falling back to direct transfer:', onChainError);
            // Continue to direct transfer flow below
          }
        }

        // Off-chain: Direct SOL transfer flow
        if (!dealAmount) {
          throw new Error('Deal amount is required for off-chain deals');
        }

        // Get deal wallet address from backend (unique wallet for this deal)
        // REQUIRED: Deal must have its own wallet (no fallback to platform wallet)
        let escrowWallet: string;
        try {
          const dealWalletUrl = normalizeUrl('/api/solana/deal-wallet', `/${dealId}`);
          const dealWalletResponse = await fetch(dealWalletUrl);
          if (!dealWalletResponse.ok) {
            throw new Error('Deal wallet not found. Deal must be created before funds can be sent.');
          }
          const data = await dealWalletResponse.json();
          escrowWallet = data.walletAddress;
        } catch (error: any) {
          throw new Error(`Failed to get deal wallet: ${error?.message || 'Unknown error'}`);
        }

        // Import direct transfer utilities
        const { createDirectSOLTransfer } = await import('../direct-transfer');

        // Create direct SOL transfer to escrow wallet
        const transaction = await createDirectSOLTransfer(
          publicKey,
          new PublicKey(escrowWallet),
          dealAmount,
          connection,
        );

        // Sign and send transaction using Phantom SDK
        const result = await signAndSendTransaction(transaction);
        const signature = result.hash;
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'accepted',
            walletAddress: publicKey.toBase58(),
            transactionSignature: signature,
          },
          'inventor',
        );

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to accept deal';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey, signAndSendTransaction, program],
  );

  /**
   * Reject a deal
   */
  const rejectDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const connection = await getConnection();
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await rejectDealTransaction(
          publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction using Phantom SDK
        const result = await signAndSendTransaction(transaction);
        const signature = result.hash;

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'rejected',
            walletAddress: publicKey.toBase58(),
            transactionSignature: signature,
          },
          'inventor',
        );

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to reject deal';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey, signAndSendTransaction, program],
  );

  /**
   * Cancel a deal
   */
  const cancelDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const connection = await getConnection();
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await cancelDealTransaction(
          publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction using Phantom SDK
        const result = await signAndSendTransaction(transaction);
        const signature = result.hash;

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'cancelled',
            walletAddress: publicKey.toBase58(),
            transactionSignature: signature,
          },
          'investor',
        );

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to cancel deal';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey, signAndSendTransaction, program],
  );

  /**
   * Release milestone funds
   * AUTOMATIC: Backend sends SOL from platform wallet to inventor
   */
  const releaseMilestone = useCallback(
    async (
      dealId: string,
      amount: number,
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Backend automatically sends SOL from platform wallet
        const result = await dealsApi.releaseFunds(dealId, amount);
        
        if (!result.releaseTransactionSignature) {
          throw new Error('Transaction signature not returned from backend');
        }

        return result.releaseTransactionSignature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to release milestone';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Complete a deal
   */
  const completeDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const connection = await getConnection();
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await completeDealTransaction(
          publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction using Phantom SDK
        const result = await signAndSendTransaction(transaction);
        const signature = result.hash;

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.complete(
          dealId,
          'inventor',
          publicKey.toBase58(),
          signature,
        );

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to complete deal';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey, signAndSendTransaction, program],
  );

  /**
   * Fetch deal data from chain
   */
  const fetchDeal = useCallback(
    async (dealPda: string): Promise<any> => {
      if (!program) {
        throw new Error('Program not initialized');
      }

      try {
        const connection = await getConnection();
        const dealPubkey = new PublicKey(dealPda);
        return await getDeal(dealPubkey, connection, program);
      } catch (err: any) {
        throw new Error(err.message || 'Failed to fetch deal');
      }
    },
    [program],
  );

  return {
    createDeal,
    acceptDeal,
    rejectDeal,
    cancelDeal,
    releaseMilestone,
    completeDeal,
    fetchDeal,
    isLoading,
    error,
  };
}

