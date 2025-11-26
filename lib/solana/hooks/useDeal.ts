'use client';

import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
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

/**
 * Hook for deal operations
 */
export function useDeal() {
  const { connection } = useConnection();
  const wallet = useWallet();
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
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const inventorPubkey = new PublicKey(inventorWalletAddress);

        // Build transaction
        const { transaction, dealPda } = await createDealTransaction(
          wallet.publicKey,
          inventorPubkey,
          projectId, // Using projectId as dealId
          amount,
          proposedDeadline,
          termsHash,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with wallet address and signature
        await dealsApi.create({
          projectId,
          amount,
          proposedDeadline: new Date(proposedDeadline * 1000).toISOString(),
          investorWalletAddress: wallet.publicKey.toBase58(),
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
    [wallet, connection, program],
  );

  /**
   * Accept a deal (inventor accepts, investor signs to transfer funds)
   */
  const acceptDeal = useCallback(
    async (
      dealId: string,
      dealPda: string,
      inventorWalletAddress: string,
    ): Promise<string> => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const dealPubkey = new PublicKey(dealPda);
        const inventorPubkey = new PublicKey(inventorWalletAddress);

        // Build transaction
        const transaction = await acceptDealTransaction(
          wallet.publicKey, // Investor must sign
          inventorPubkey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'accepted',
            walletAddress: wallet.publicKey.toBase58(),
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
    [wallet, connection, program],
  );

  /**
   * Reject a deal
   */
  const rejectDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await rejectDealTransaction(
          wallet.publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'rejected',
            walletAddress: wallet.publicKey.toBase58(),
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
    [wallet, connection, program],
  );

  /**
   * Cancel a deal
   */
  const cancelDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await cancelDealTransaction(
          wallet.publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.update(
          dealId,
          {
            status: 'cancelled',
            walletAddress: wallet.publicKey.toBase58(),
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
    [wallet, connection, program],
  );

  /**
   * Release milestone funds
   */
  const releaseMilestone = useCallback(
    async (
      dealId: string,
      dealPda: string,
      inventorWalletAddress: string,
      milestoneIndex: number,
      amount: number,
    ): Promise<string> => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const dealPubkey = new PublicKey(dealPda);
        const inventorPubkey = new PublicKey(inventorWalletAddress);

        // Build transaction
        const transaction = await releaseMilestoneTransaction(
          wallet.publicKey,
          inventorPubkey,
          dealPubkey,
          milestoneIndex,
          amount,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to release milestone';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, connection, program],
  );

  /**
   * Complete a deal
   */
  const completeDeal = useCallback(
    async (dealId: string, dealPda: string): Promise<string> => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const dealPubkey = new PublicKey(dealPda);

        // Build transaction
        const transaction = await completeDealTransaction(
          wallet.publicKey,
          dealPubkey,
          program,
          connection,
        );

        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature
        await dealsApi.complete(
          dealId,
          'inventor',
          wallet.publicKey.toBase58(),
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
    [wallet, connection, program],
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
        const dealPubkey = new PublicKey(dealPda);
        return await getDeal(dealPubkey, connection, program);
      } catch (err: any) {
        throw new Error(err.message || 'Failed to fetch deal');
      }
    },
    [connection, program],
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

