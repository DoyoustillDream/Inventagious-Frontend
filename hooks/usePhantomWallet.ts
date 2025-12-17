'use client';

import { usePhantom, useSolana, useConnect, useDisconnect, useAccounts } from "@phantom/react-sdk";
import { AddressType } from "@phantom/browser-sdk";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import bs58 from "bs58";

export interface UsePhantomWalletReturn {
  // Connection state
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  isLoading: boolean;
  
  // Connection methods
  connect: (provider?: "google" | "apple" | "injected") => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Solana operations
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAndSendTransaction: (transaction: Transaction | VersionedTransaction) => Promise<{ hash: string }>;
  
  // Addresses
  addresses: Array<{ address: string; addressType: string }> | null;
  
  // OAuth user info (for Google/Apple connections)
  user: any | null;
  
  // Wallet object for compatibility (if needed)
  wallet: any | null;
}

/**
 * Hook to manage Phantom wallet connection using Phantom Connect SDK
 */
export function usePhantomWallet(): UsePhantomWalletReturn {
  const { isConnected, isLoading: phantomLoading, user } = usePhantom();
  const { connect: phantomConnect, isConnecting, error } = useConnect();
  const { disconnect: phantomDisconnect } = useDisconnect();
  const addresses = useAccounts();
  const { solana, isAvailable: solanaAvailable } = useSolana();

  // Get Solana public key from addresses
  // AddressType from useAccounts returns an enum value, compare with AddressType enum
  const solanaAddress = addresses?.find(
    (addr) => addr.addressType === AddressType.solana
  );
  const publicKey = solanaAddress 
    ? new PublicKey(solanaAddress.address)
    : null;

  const connect = useCallback(async (
    provider: "google" | "apple" | "injected" = "injected"
  ) => {
    try {
      await phantomConnect({ provider });
    } catch (err) {
      console.error("Failed to connect:", err);
      throw err;
    }
  }, [phantomConnect]);

  const disconnect = useCallback(async () => {
    try {
      await phantomDisconnect();
    } catch (err) {
      console.error("Failed to disconnect:", err);
      throw err;
    }
  }, [phantomDisconnect]);

  const signMessage = useCallback(async (message: Uint8Array): Promise<Uint8Array> => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    if (!solana.isConnected) {
      throw new Error("Wallet is not connected");
    }
    
    try {
      // Convert message to string for Phantom SDK
      const messageString = new TextDecoder().decode(message);
      const result = await solana.signMessage(messageString);
      
      // Phantom SDK returns { signature: string } where signature can be:
      // - base64 encoded string
      // - base58 encoded string  
      // - Uint8Array
      // We need to convert it to Uint8Array for consistency
      let signatureBytes: Uint8Array;
      
      if (typeof result.signature === 'string') {
        // Try base64 first (most common)
        try {
          const binaryString = atob(result.signature);
          signatureBytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            signatureBytes[i] = binaryString.charCodeAt(i);
          }
        } catch {
          // If base64 fails, try base58 (Solana standard)
          try {
            signatureBytes = bs58.decode(result.signature);
          } catch {
            // If both fail, log error
            console.error('Failed to decode signature:', result.signature);
            throw new Error('Invalid signature format from wallet');
          }
        }
      } else if (result.signature instanceof Uint8Array) {
        signatureBytes = result.signature;
      } else if (Array.isArray(result.signature)) {
        signatureBytes = new Uint8Array(result.signature);
      } else {
        console.error('Unexpected signature format:', result);
        throw new Error('Unexpected signature format from wallet');
      }
      
      return signatureBytes;
    } catch (err: any) {
      console.error("Failed to sign message:", err);
      throw err;
    }
  }, [solana, solanaAvailable]);

  const signTransaction = useCallback(async (transaction: Transaction | VersionedTransaction) => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    if (!solana.isConnected) {
      throw new Error("Wallet is not connected");
    }
    
    try {
      // Note: signTransaction is not supported for embedded wallets
      // Use signAndSendTransaction instead for embedded wallets
      // For injected wallets, we can try signTransaction
      if (solana.signTransaction) {
        return await solana.signTransaction(transaction);
      } else {
        // For embedded wallets, we need to use signAndSendTransaction
        // But the caller expects just the signed transaction, not sent
        // This is a limitation - embedded wallets don't support sign-only
        throw new Error("This wallet type does not support sign-only transactions. Use signAndSendTransaction instead.");
      }
    } catch (err: any) {
      console.error("Failed to sign transaction:", err);
      throw err;
    }
  }, [solana, solanaAvailable]);

  const signAndSendTransaction = useCallback(async (transaction: Transaction | VersionedTransaction) => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    if (!solana.isConnected) {
      throw new Error("Wallet is not connected");
    }
    
    try {
      const result = await solana.signAndSendTransaction(transaction);
      // Phantom SDK returns { signature: string } or { hash: string }
      return { hash: (result as any).hash || result.signature || '' };
    } catch (err: any) {
      console.error("Failed to sign and send transaction:", err);
      throw err;
    }
  }, [solana, solanaAvailable]);

  // Compute connected state - check both isConnected and if we have addresses/publicKey
  const connectedState = isConnected && !!publicKey && !!solanaAddress;
  
  // Debug logging - only in development and only when user changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && user) {
      const userAny = user as any;
      // Only log if we haven't seen this user before (by walletId or authUserId)
      const userKey = userAny.walletId || userAny.authUserId;
      if (userKey && !(window as any).__lastLoggedUserKey || (window as any).__lastLoggedUserKey !== userKey) {
        (window as any).__lastLoggedUserKey = userKey;
        console.log('[usePhantomWallet] User connected:', {
          walletId: userAny.walletId,
          authProvider: userAny.authProvider,
          hasAddresses: !!addresses?.length,
        });
      }
    }
  }, [user, addresses]);

  return {
    publicKey,
    connected: connectedState,
    connecting: isConnecting,
    isLoading: phantomLoading,
    connect,
    disconnect,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    addresses,
    user, // OAuth user info (email, name, etc. for Google/Apple connections)
    wallet: solana, // Provide solana object as wallet for compatibility
  };
}

