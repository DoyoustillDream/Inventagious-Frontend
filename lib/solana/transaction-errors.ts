'use client';

/**
 * User-friendly error messages for common Solana transaction errors
 */
export class TransactionError extends Error {
  constructor(
    message: string,
    public code?: string | number,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

/**
 * Parse wallet error and return user-friendly message
 */
export function parseWalletError(error: any): string {
  if (!error) {
    return 'Unknown wallet error';
  }

  // Check for user rejection
  if (
    error.message?.includes('User rejected') ||
    error.message?.includes('User cancelled') ||
    error.message?.includes('rejected') ||
    error.message?.includes('denied') ||
    error.code === 4001 ||
    error.code === 'ACTION_REJECTED'
  ) {
    return 'Transaction was rejected. Please approve the transaction in your wallet to continue.';
  }

  // Check for network mismatch
  if (
    error.message?.includes('network') ||
    error.message?.includes('Network') ||
    error.message?.includes('cluster')
  ) {
    return 'Network mismatch detected. Please ensure your wallet is connected to the same network as the application.';
  }

  // Check for insufficient funds
  if (
    error.message?.includes('insufficient funds') ||
    error.message?.includes('Insufficient') ||
    error.message?.includes('0x1') // Solana error code for insufficient funds
  ) {
    return 'Insufficient funds. Please ensure you have enough SOL to cover the transaction fee and amount.';
  }

  // Check for transaction too large
  if (
    error.message?.includes('too large') ||
    error.message?.includes('size') ||
    error.message?.includes('1232')
  ) {
    return 'Transaction is too large. Please try with a smaller transaction or split it into multiple transactions.';
  }

  // Check for invalid transaction
  if (
    error.message?.includes('invalid') ||
    error.message?.includes('Invalid') ||
    error.message?.includes('malformed')
  ) {
    return 'Invalid transaction. Please try again or contact support if the issue persists.';
  }

  // Check for timeout
  if (
    error.message?.includes('timeout') ||
    error.message?.includes('Timeout') ||
    error.message?.includes('expired')
  ) {
    return 'Transaction timed out. Please try again.';
  }

  // Check for wallet not connected
  if (
    error.message?.includes('not connected') ||
    error.message?.includes('Not connected') ||
    error.message?.includes('disconnected')
  ) {
    return 'Wallet is not connected. Please connect your wallet and try again.';
  }

  // Check for RPC errors
  if (error.code === -32603 || error.message?.includes('RPC')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Return original message if we can't parse it
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Create a TransactionError from any error
 */
export function createTransactionError(error: any, context?: string): TransactionError {
  const message = parseWalletError(error);
  const fullMessage = context ? `${context}: ${message}` : message;
  return new TransactionError(fullMessage, error?.code, error);
}

/**
 * Check if error is a user rejection (should not retry)
 */
export function isUserRejection(error: any): boolean {
  return (
    error?.message?.includes('User rejected') ||
    error?.message?.includes('User cancelled') ||
    error?.message?.includes('rejected') ||
    error?.message?.includes('denied') ||
    error?.code === 4001 ||
    error?.code === 'ACTION_REJECTED'
  );
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Don't retry user rejections
  if (isUserRejection(error)) {
    return false;
  }

  // Retry network errors, timeouts, and RPC errors
  return (
    error?.message?.includes('timeout') ||
    error?.message?.includes('network') ||
    error?.message?.includes('RPC') ||
    error?.code === -32603 ||
    error?.code === 'NETWORK_ERROR'
  );
}

