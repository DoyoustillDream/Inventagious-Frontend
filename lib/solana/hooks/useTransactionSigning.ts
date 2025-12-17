'use client';

import { useCallback, useMemo } from 'react';
import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { getConnection } from '../connection';
import {
  signTransactionWithRetry,
  signAllTransactionsWithRetry,
  serializeSignedTransaction,
  SigningConfig,
  Wallet,
} from '../transaction-signing';

/**
 * Enhanced hook for transaction signing with retry logic and validation
 */
export function useTransactionSigning() {
  const { wallet: phantomWallet, publicKey, connected, signTransaction: phantomSignTransaction, signAndSendTransaction } = usePhantomWallet();
  
  // Create a Wallet-compatible adapter from Phantom wallet
  const wallet: Wallet | null = useMemo(() => {
    if (!phantomWallet || !connected || !publicKey) {
      return null;
    }
    
    return {
      name: 'Phantom',
      icon: undefined,
      publicKey,
      connected,
      connect: async () => {
        // Connection is handled by Phantom SDK
      },
      disconnect: async () => {
        // Disconnection is handled by Phantom SDK
      },
      signTransaction: async (transaction: Transaction | VersionedTransaction) => {
        // Use Phantom's signTransaction if available, otherwise use signAndSendTransaction
        // Note: Embedded wallets may not support sign-only, so we'll try signTransaction first
        try {
          return await phantomSignTransaction(transaction);
        } catch (error: any) {
          // If signTransaction fails (e.g., embedded wallet), we can't use sign-only
          // The caller will need to handle this or use signAndSendTransaction directly
          throw error;
        }
      },
      signMessage: async (message: Uint8Array) => {
        // This should be handled by the hook, but include for completeness
        throw new Error('Use usePhantomWallet.signMessage directly');
      },
      signAllTransactions: phantomWallet.signAllTransactions 
        ? async (transactions: (Transaction | VersionedTransaction)[]) => {
            // Phantom SDK may support batch signing
            if (typeof phantomWallet.signAllTransactions === 'function') {
              return await phantomWallet.signAllTransactions(transactions);
            }
            throw new Error('Batch signing not supported');
          }
        : undefined,
    };
  }, [phantomWallet, connected, publicKey, phantomSignTransaction]);

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

