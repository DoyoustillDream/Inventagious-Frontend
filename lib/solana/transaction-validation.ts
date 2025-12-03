'use client';

import { Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';

/**
 * Maximum transaction size in bytes (Solana limit)
 */
export const MAX_TRANSACTION_SIZE = 1232;

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a Transaction before signing
 */
export function validateTransaction(
  transaction: Transaction,
  expectedFeePayer?: PublicKey,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if transaction exists
  if (!transaction) {
    errors.push('Transaction is undefined or null');
    return { valid: false, errors, warnings };
  }

  // Check recent blockhash
  if (!transaction.recentBlockhash) {
    errors.push('Transaction missing recentBlockhash');
  }

  // Check fee payer
  if (!transaction.feePayer) {
    errors.push('Transaction missing feePayer');
  } else if (expectedFeePayer && !transaction.feePayer.equals(expectedFeePayer)) {
    warnings.push(
      `Fee payer mismatch: expected ${expectedFeePayer.toBase58()}, got ${transaction.feePayer.toBase58()}`,
    );
  }

  // Check instructions
  if (!transaction.instructions || transaction.instructions.length === 0) {
    errors.push('Transaction has no instructions');
  } else {
    // Validate each instruction
    transaction.instructions.forEach((ix, index) => {
      if (!ix.programId) {
        errors.push(`Instruction at index ${index} missing programId`);
      } else {
        try {
          // Verify programId is a valid PublicKey
          new PublicKey(ix.programId);
        } catch {
          errors.push(`Instruction at index ${index} has invalid programId`);
        }
      }

      // Validate accounts
      if (!ix.keys || ix.keys.length === 0) {
        warnings.push(`Instruction at index ${index} has no accounts`);
      } else {
        ix.keys.forEach((key, keyIndex) => {
          if (!key.pubkey) {
            errors.push(`Instruction ${index}, account ${keyIndex} missing pubkey`);
          } else {
            try {
              new PublicKey(key.pubkey);
            } catch {
              errors.push(`Instruction ${index}, account ${keyIndex} has invalid pubkey`);
            }
          }
        });
      }
    });
  }

  // Check transaction size
  try {
    const serialized = transaction.serialize({ requireAllSignatures: false });
    if (serialized.length > MAX_TRANSACTION_SIZE) {
      errors.push(
        `Transaction too large: ${serialized.length} bytes (max ${MAX_TRANSACTION_SIZE} bytes)`,
      );
    }
  } catch (serializeError: any) {
    warnings.push(`Could not serialize transaction for size check: ${serializeError.message}`);
  }

  // Check signatures
  if (transaction.signatures.length === 0) {
    warnings.push('Transaction has no signatures (will be signed by wallet)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a VersionedTransaction before signing
 */
export function validateVersionedTransaction(
  transaction: VersionedTransaction,
  expectedFeePayer?: PublicKey,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if transaction exists
  if (!transaction) {
    errors.push('Transaction is undefined or null');
    return { valid: false, errors, warnings };
  }

  // Check message
  if (!transaction.message) {
    errors.push('VersionedTransaction missing message');
    return { valid: false, errors, warnings };
  }

  // Check static account keys
  const staticAccountKeys = transaction.message.staticAccountKeys;
  if (!staticAccountKeys || staticAccountKeys.length === 0) {
    errors.push('VersionedTransaction has no account keys');
  } else {
    // First account should be fee payer
    if (staticAccountKeys.length > 0) {
      const feePayer = staticAccountKeys[0];
      if (expectedFeePayer && !feePayer.equals(expectedFeePayer)) {
        warnings.push(
          `Fee payer mismatch: expected ${expectedFeePayer.toBase58()}, got ${feePayer.toBase58()}`,
        );
      }
    }
  }

  // Check instructions
  const instructions = transaction.message.compiledInstructions;
  if (!instructions || instructions.length === 0) {
    errors.push('VersionedTransaction has no instructions');
  }

  // Check transaction size
  try {
    const serialized = transaction.serialize();
    if (serialized.length > MAX_TRANSACTION_SIZE) {
      errors.push(
        `Transaction too large: ${serialized.length} bytes (max ${MAX_TRANSACTION_SIZE} bytes)`,
      );
    }
  } catch (serializeError: any) {
    warnings.push(`Could not serialize transaction for size check: ${serializeError.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate any transaction type
 */
export function validateAnyTransaction(
  transaction: Transaction | VersionedTransaction,
  expectedFeePayer?: PublicKey,
): ValidationResult {
  if (transaction instanceof Transaction) {
    return validateTransaction(transaction, expectedFeePayer);
  } else if (transaction instanceof VersionedTransaction) {
    return validateVersionedTransaction(transaction, expectedFeePayer);
  } else {
    return {
      valid: false,
      errors: [`Invalid transaction type: ${typeof transaction}`],
      warnings: [],
    };
  }
}

