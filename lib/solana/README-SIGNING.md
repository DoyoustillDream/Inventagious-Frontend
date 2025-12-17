# Optimized Transaction Signing System

This directory contains a comprehensive, production-ready transaction signing system for Solana that follows best practices used by major platforms.

## Architecture

The signing system is split into focused, modular files for better organization and maintainability:

### Core Modules

1. **`transaction-validation.ts`** - Transaction validation utilities
   - Validates transaction structure before signing
   - Checks transaction size (max 1232 bytes)
   - Verifies blockhash, fee payer, and instructions
   - Supports both `Transaction` and `VersionedTransaction`

2. **`transaction-preparation.ts`** - Transaction preparation utilities
   - Ensures blockhash is set and fresh
   - Sets fee payer correctly
   - Handles blockhash expiration
   - Supports both transaction types

3. **`transaction-errors.ts`** - Error handling utilities
   - User-friendly error messages
   - Parses wallet errors (rejection, network issues, etc.)
   - Determines if errors are retryable
   - Custom `TransactionError` class

4. **`transaction-signing.ts`** - Main signing service
   - Retry logic with exponential backoff
   - Automatic transaction preparation and validation
   - Handles both single and batch transaction signing
   - Proper error handling and user feedback

5. **`hooks/useTransactionSigning.ts`** - React hook wrapper
   - Easy-to-use hook for components
   - Integrates with `useWallet` hook
   - Automatically gets connection if needed

## Features

### ✅ Production-Ready Features

- **Automatic Retry Logic**: Retries failed signatures with exponential backoff (up to 3 retries by default)
- **Transaction Validation**: Validates transactions before signing to catch errors early
- **Blockhash Management**: Automatically refreshes expired blockhashes
- **Error Handling**: User-friendly error messages for common issues
- **Wallet Compatibility**: Works with Phantom Connect SDK (Google, Apple, Extension, and Mobile)
- **Transaction Size Validation**: Prevents transactions that exceed Solana's 1232 byte limit
- **Versioned Transaction Support**: Handles both legacy and versioned transactions

### ✅ Best Practices Implemented

1. **Separation of Concerns**: Each module has a single responsibility
2. **Error Recovery**: Automatic retry for transient errors (network issues, timeouts)
3. **User Experience**: Clear error messages instead of technical jargon
4. **Validation First**: Validates transactions before attempting to sign
5. **Fresh Blockhashes**: Ensures blockhashes are recent to prevent expiration
6. **Proper Serialization**: Handles different wallet return types correctly

## Usage

### Basic Usage

```typescript
import { useTransactionSigning } from '@/lib/solana/hooks/useTransactionSigning';
import { getConnection } from '@/lib/solana/connection';

function MyComponent() {
  const { signTransaction, serializeTransaction } = useTransactionSigning();
  const connection = await getConnection();

  // Sign a transaction
  const signedTx = await signTransaction(transaction, connection);
  
  // Serialize for sending
  const serialized = serializeTransaction(signedTx);
  
  // Send to network
  const signature = await connection.sendRawTransaction(serialized);
}
```

### Advanced Usage with Custom Config

```typescript
import { signTransactionWithRetry } from '@/lib/solana/transaction-signing';

const signedTx = await signTransactionWithRetry(
  transaction,
  wallet,
  publicKey,
  connection,
  {
    maxRetries: 5,
    retryDelay: 2000,
    validateBeforeSign: true,
    prepareBeforeSign: true,
    commitment: 'confirmed',
  }
);
```

## Error Handling

The system provides user-friendly error messages for common scenarios:

- **User Rejection**: "Transaction was rejected. Please approve the transaction in your wallet to continue."
- **Network Mismatch**: "Network mismatch detected. Please ensure your wallet is on the same network."
- **Insufficient Funds**: "Insufficient funds. Please ensure you have enough SOL..."
- **Transaction Too Large**: "Transaction is too large. Please try with a smaller transaction..."
- **Network Errors**: Automatically retries with exponential backoff

## Migration from Old Code

The old signing code in `useCampaign.ts` and `useDeal.ts` has been replaced with calls to the optimized signing service. The new system:

1. **Reduces code duplication**: All signing logic is centralized
2. **Improves reliability**: Automatic retry and validation
3. **Better error messages**: Users see helpful messages instead of technical errors
4. **Easier maintenance**: Changes to signing logic only need to be made in one place

## Testing

When testing the signing system:

1. Test with different connection methods (Google, Apple, Phantom extension, Mobile)
2. Test network errors (disconnect network, slow connection)
3. Test user rejection (reject in wallet)
4. Test with expired blockhashes
5. Test with invalid transactions (too large, missing fields)

## Future Enhancements

Potential improvements for the future:

- [ ] Transaction simulation before signing
- [ ] Fee estimation before signing
- [ ] Transaction history tracking
- [ ] Batch transaction optimization
- [ ] Support for more wallet types

