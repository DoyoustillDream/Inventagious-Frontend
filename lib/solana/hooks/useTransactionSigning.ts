'use client';

import { useCallback } from 'react';
import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { useWallet } from '@/hooks/useWallet';
import { getConnection } from '../connection';
import {
  signTransactionWithRetry,
  signAllTransactionsWithRetry,
  serializeSignedTransaction,
  SigningConfig,
} from '../transaction-signing';

/**
 * Enhanced hook for transaction signing with retry logic and validation
 */
export function useTransactionSigning() {
  const { wallet, publicKey, connected } = useWallet();

  /**
   * Sign a transaction with optimized error handling and retry logic
   */
  const signTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction,
      connection?: Connection,
      config?: SigningConfig,
    ): Promise<Transaction | VersionedTransaction> => {
      if (!wallet || !connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get connection if not provided
      let conn = connection;
      if (!conn) {
        try {
          conn = await getConnection();
        } catch (error) {
          console.warn('Could not get connection, signing without preparation:', error);
        }
      }

      // If we have connection, use optimized signing
      if (conn) {
        return await signTransactionWithRetry(transaction, wallet, publicKey, conn, config);
      }

      // Fallback to basic signing if no connection
      return await wallet.signTransaction(transaction);
    },
    [wallet, connected, publicKey],
  );

  /**
   * Sign multiple transactions with optimized error handling
   */
  const signAllTransactions = useCallback(
    async (
      transactions: (Transaction | VersionedTransaction)[],
      connection?: Connection,
      config?: SigningConfig,
    ): Promise<(Transaction | VersionedTransaction)[]> => {
      if (!wallet || !connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      if (!wallet.signAllTransactions) {
        throw new Error('Wallet does not support batch transaction signing');
      }

      // Get connection if not provided
      let conn = connection;
      if (!conn) {
        try {
          conn = await getConnection();
        } catch (error) {
          console.warn('Could not get connection, signing without preparation:', error);
        }
      }

      // If we have connection, use optimized signing
      if (conn) {
        return await signAllTransactionsWithRetry(transactions, wallet, publicKey, conn, config);
      }

      // Fallback to basic signing if no connection
      return await wallet.signAllTransactions(transactions);
    },
    [wallet, connected, publicKey],
  );

  /**
   * Serialize a signed transaction
   */
  const serializeTransaction = useCallback(
    (signedTransaction: Transaction | VersionedTransaction): Uint8Array => {
      return serializeSignedTransaction(signedTransaction);
    },
    [],
  );

  return {
    signTransaction,
    signAllTransactions,
    serializeTransaction,
    wallet,
    publicKey,
    connected,
  };
}

