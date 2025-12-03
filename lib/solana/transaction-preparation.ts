'use client';

import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
  TransactionMessage,
  AddressLookupTableAccount,
} from '@solana/web3.js';

/**
 * Prepare a Transaction for signing by ensuring blockhash and fee payer are set
 */
export async function prepareTransaction(
  transaction: Transaction,
  connection: Connection,
  feePayer: PublicKey,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed',
): Promise<Transaction> {
  // Ensure fee payer is set
  if (!transaction.feePayer) {
    transaction.feePayer = feePayer;
  } else if (!transaction.feePayer.equals(feePayer)) {
    // If fee payer is different, update it
    transaction.feePayer = feePayer;
  }

  // Ensure blockhash is set and fresh
  if (!transaction.recentBlockhash) {
    const { blockhash } = await connection.getLatestBlockhash(commitment);
    transaction.recentBlockhash = blockhash;
  } else {
    // Verify blockhash is still valid (not expired)
    // Solana blockhashes expire after ~60 seconds
    // For safety, we'll refresh if it's older than 30 seconds
    // Note: We can't check age directly, so we'll refresh if not recent
    try {
      const { blockhash: latestBlockhash } = await connection.getLatestBlockhash(commitment);
      // If blockhash is different, it might be expired, refresh it
      if (transaction.recentBlockhash !== latestBlockhash) {
        transaction.recentBlockhash = latestBlockhash;
      }
    } catch (error) {
      // If we can't get latest blockhash, use the existing one
      // The transaction will fail if it's expired, but that's better than failing here
      console.warn('Could not refresh blockhash, using existing:', error);
    }
  }

  return transaction;
}

/**
 * Prepare a VersionedTransaction for signing
 * Note: VersionedTransactions are typically created with blockhash already set
 * This function ensures the fee payer is correct
 */
export async function prepareVersionedTransaction(
  transaction: VersionedTransaction,
  connection: Connection,
  feePayer: PublicKey,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed',
): Promise<VersionedTransaction> {
  // For VersionedTransaction, we need to check if the fee payer is correct
  const message = transaction.message;
  if (!message) {
    throw new Error('VersionedTransaction missing message');
  }

  // Check if fee payer (first account) matches
  const staticAccountKeys = message.staticAccountKeys;
  if (staticAccountKeys.length > 0) {
    const currentFeePayer = staticAccountKeys[0];
    if (!currentFeePayer.equals(feePayer)) {
      // Rebuild transaction with correct fee payer
      // This is complex, so we'll throw an error instead
      throw new Error(
        `VersionedTransaction fee payer mismatch: expected ${feePayer.toBase58()}, got ${currentFeePayer.toBase58()}. ` +
          `Transaction must be rebuilt with correct fee payer.`,
      );
    }
  }

  // Verify blockhash is still valid
  try {
    const { blockhash: latestBlockhash } = await connection.getLatestBlockhash(commitment);
    // For VersionedTransaction, we can't easily check if blockhash is expired
    // The transaction will fail if it's expired, which is acceptable
  } catch (error) {
    console.warn('Could not verify blockhash for VersionedTransaction:', error);
  }

  return transaction;
}

/**
 * Prepare any transaction type for signing
 */
export async function prepareAnyTransaction(
  transaction: Transaction | VersionedTransaction,
  connection: Connection,
  feePayer: PublicKey,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed',
): Promise<Transaction | VersionedTransaction> {
  if (transaction instanceof Transaction) {
    return await prepareTransaction(transaction, connection, feePayer, commitment);
  } else if (transaction instanceof VersionedTransaction) {
    return await prepareVersionedTransaction(transaction, connection, feePayer, commitment);
  } else {
    throw new Error(`Invalid transaction type: ${typeof transaction}`);
  }
}

/**
 * Create a fresh transaction with new blockhash
 * Useful when a transaction might have expired
 */
export async function refreshTransactionBlockhash(
  transaction: Transaction,
  connection: Connection,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed',
): Promise<Transaction> {
  const { blockhash } = await connection.getLatestBlockhash(commitment);
  transaction.recentBlockhash = blockhash;
  return transaction;
}

