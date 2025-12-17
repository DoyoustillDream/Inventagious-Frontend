'use client';

import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { Wallet } from '@/lib/wallet/wallet-standard';

// Re-export Wallet interface for use in other modules
export { type Wallet };
import { validateAnyTransaction } from './transaction-validation';
import { prepareAnyTransaction } from './transaction-preparation';
import {
  createTransactionError,
  isUserRejection,
  isRetryableError,
  TransactionError,
} from './transaction-errors';

/**
 * Configuration for transaction signing
 */
export interface SigningConfig {
  maxRetries?: number;
  retryDelay?: number;
  validateBeforeSign?: boolean;
  prepareBeforeSign?: boolean;
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Default signing configuration
 */
const DEFAULT_CONFIG: Required<SigningConfig> = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  validateBeforeSign: true,
  prepareBeforeSign: true,
  commitment: 'confirmed',
};

/**
 * Sign a transaction with proper error handling and retry logic
 */
export async function signTransactionWithRetry(
  transaction: Transaction | VersionedTransaction,
  wallet: Wallet,
  publicKey: PublicKey,
  connection: Connection,
  config: SigningConfig = {},
): Promise<Transaction | VersionedTransaction> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Validate wallet connection
  if (!wallet || !wallet.connected) {
    throw new TransactionError('Wallet is not connected. Please connect your wallet first.');
  }

  if (!publicKey) {
    throw new TransactionError('Public key is not available.');
  }

  // Prepare transaction if needed
  let preparedTransaction = transaction;
  if (finalConfig.prepareBeforeSign) {
    try {
      preparedTransaction = await prepareAnyTransaction(
        transaction,
        connection,
        publicKey,
        finalConfig.commitment,
      );
    } catch (prepareError: any) {
      throw createTransactionError(prepareError, 'Failed to prepare transaction');
    }
  }

  // Validate transaction if needed
  if (finalConfig.validateBeforeSign) {
    const validation = validateAnyTransaction(preparedTransaction, publicKey);
    if (!validation.valid) {
      throw new TransactionError(
        `Transaction validation failed: ${validation.errors.join(', ')}`,
      );
    }
    if (validation.warnings.length > 0) {
      console.warn('Transaction warnings:', validation.warnings);
    }
  }

  // Attempt signing with retry logic
  let lastError: any = null;
  let signedTransaction: Transaction | VersionedTransaction | null = null;
  
  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      // Don't retry if user rejected
      if (lastError && isUserRejection(lastError)) {
        throw createTransactionError(lastError);
      }

      // Sign the transaction
      signedTransaction = await wallet.signTransaction(preparedTransaction);

      // Verify the signed transaction
      if (!signedTransaction) {
        throw new TransactionError('Wallet returned null signed transaction');
      }

      // Verify it has a serialize method (basic sanity check)
      if (typeof (signedTransaction as any).serialize !== 'function') {
        // Some wallets modify the transaction in place, so check the original
        if (typeof (preparedTransaction as any).serialize === 'function') {
          // Return the original transaction (it should be signed now)
          return preparedTransaction;
        }
        throw new TransactionError(
          'Signed transaction does not have a serialize method. The wallet may not have properly signed the transaction.',
        );
      }

      // Successfully signed - return immediately, don't retry or refresh blockhash
      return signedTransaction;
    } catch (error: any) {
      lastError = error;

      // Don't retry user rejections
      if (isUserRejection(error)) {
        throw createTransactionError(error);
      }

      // Check if we should retry (only if signing failed, not after successful sign)
      if (attempt < finalConfig.maxRetries && isRetryableError(error)) {
        const delay = finalConfig.retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.warn(
          `Transaction signing failed (attempt ${attempt + 1}/${finalConfig.maxRetries + 1}), retrying in ${delay}ms...`,
          error,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Only refresh blockhash if we're retrying due to a failure
        // Create a NEW transaction for retry to avoid signing an already-signed transaction
        if (finalConfig.prepareBeforeSign && preparedTransaction instanceof Transaction) {
          try {
            const { blockhash } = await connection.getLatestBlockhash(finalConfig.commitment);
            // Create a fresh transaction copy for retry (don't modify the original)
            const retryTransaction = new Transaction();
            retryTransaction.recentBlockhash = blockhash;
            retryTransaction.feePayer = preparedTransaction.feePayer;
            // Copy instructions
            preparedTransaction.instructions.forEach(ix => {
              retryTransaction.add(ix);
            });
            preparedTransaction = retryTransaction;
          } catch (refreshError) {
            console.warn('Could not refresh blockhash before retry:', refreshError);
          }
        }

        continue;
      }

      // If we've exhausted retries or it's not retryable, throw
      throw createTransactionError(error);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw createTransactionError(lastError || new Error('Unknown error'));
}

/**
 * Sign multiple transactions (batch signing)
 */
export async function signAllTransactionsWithRetry(
  transactions: (Transaction | VersionedTransaction)[],
  wallet: Wallet,
  publicKey: PublicKey,
  connection: Connection,
  config: SigningConfig = {},
): Promise<(Transaction | VersionedTransaction)[]> {
  if (!wallet.signAllTransactions) {
    throw new TransactionError('Wallet does not support batch transaction signing');
  }

  // Prepare all transactions
  const preparedTransactions = await Promise.all(
    transactions.map((tx) =>
      config.prepareBeforeSign !== false
        ? prepareAnyTransaction(tx, connection, publicKey, config.commitment || 'confirmed')
        : Promise.resolve(tx),
    ),
  );

  // Validate all transactions
  if (config.validateBeforeSign !== false) {
    for (const tx of preparedTransactions) {
      const validation = validateAnyTransaction(tx, publicKey);
      if (!validation.valid) {
        throw new TransactionError(
          `Transaction validation failed: ${validation.errors.join(', ')}`,
        );
      }
    }
  }

  // Sign all transactions
  try {
    const signedTransactions = await wallet.signAllTransactions(preparedTransactions);
    return signedTransactions;
  } catch (error: any) {
    if (isUserRejection(error)) {
      throw createTransactionError(error);
    }
    throw createTransactionError(error, 'Failed to sign transactions');
  }
}

/**
 * Serialize a signed transaction for sending
 */
export function serializeSignedTransaction(
  signedTransaction: Transaction | VersionedTransaction,
): Uint8Array {
  if (typeof (signedTransaction as any).serialize === 'function') {
    return (signedTransaction as any).serialize();
  }

  throw new TransactionError(
    'Cannot serialize transaction: transaction does not have a serialize method',
  );
}

