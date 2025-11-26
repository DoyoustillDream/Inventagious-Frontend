'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey, Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { detectWallets, getFirstAvailableWallet, Wallet } from '@/lib/wallet/wallet-standard';

export interface UseWalletReturn {
  wallet: Wallet | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  isLoading: boolean; // New: indicates if wallet state is still being checked
  availableWallets: Wallet[];
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  signAllTransactions?: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
}

/**
 * Hook to manage wallet connection using Wallet Standard API
 */
export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);

  // Detect available wallets on mount
  useEffect(() => {
    const wallets = detectWallets();
    setAvailableWallets(wallets);

    // Listen for wallet changes
    const handleWalletChange = () => {
      const updatedWallets = detectWallets();
      setAvailableWallets(updatedWallets);
    };

    window.addEventListener('wallet-standard:app-ready', handleWalletChange);
    
    return () => {
      window.removeEventListener('wallet-standard:app-ready', handleWalletChange);
    };
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined') {
        // Small delay to ensure wallet extensions are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check Phantom
        if ((window as any).phantom?.solana?.isConnected) {
          const phantomWallet = createDirectWalletFromProvider('Phantom', (window as any).phantom.solana);
          setWallet(phantomWallet);
          setPublicKey(phantomWallet.publicKey);
          setConnected(phantomWallet.connected);
        }
        // Check Solflare
        else if ((window as any).solflare?.isConnected) {
          const solflareWallet = createDirectWalletFromProvider('Solflare', (window as any).solflare);
          setWallet(solflareWallet);
          setPublicKey(solflareWallet.publicKey);
          setConnected(solflareWallet.connected);
        }
        // Check Backpack
        else if ((window as any).backpack?.isConnected) {
          const backpackWallet = createDirectWalletFromProvider('Backpack', (window as any).backpack);
          setWallet(backpackWallet);
          setPublicKey(backpackWallet.publicKey);
          setConnected(backpackWallet.connected);
        }
      }
      setIsLoading(false); // Mark as done loading
    };
    checkExistingConnection();
  }, []);

  const connect = useCallback(async (walletName?: string) => {
    setConnecting(true);
    try {
      // Re-detect wallets in case they weren't detected on mount
      const detectedWallets = detectWallets();
      if (detectedWallets.length > 0) {
        setAvailableWallets(detectedWallets);
      }

      let selectedWallet: Wallet | null = null;

      if (walletName) {
        selectedWallet = detectedWallets.find(w => w.name.toLowerCase() === walletName.toLowerCase()) || 
                        availableWallets.find(w => w.name.toLowerCase() === walletName.toLowerCase()) || null;
      } else {
        selectedWallet = detectedWallets.length > 0 ? detectedWallets[0] : getFirstAvailableWallet();
      }

      if (!selectedWallet) {
        throw new Error('No wallet available. Please install a Solana wallet extension.');
      }

      await selectedWallet.connect();
      setWallet(selectedWallet);
      setPublicKey(selectedWallet.publicKey);
      setConnected(selectedWallet.connected);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [availableWallets]);

  const disconnect = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
        setWallet(null);
        setPublicKey(null);
        setConnected(false);
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
        throw error;
      }
    }
  }, [wallet]);

  const signTransaction = useCallback(async (transaction: Transaction | VersionedTransaction) => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }
    return await wallet.signTransaction(transaction);
  }, [wallet, connected]);

  const signMessage = useCallback(async (message: Uint8Array) => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }
    return await wallet.signMessage(message);
  }, [wallet, connected]);

  const signAllTransactions = useCallback(async (transactions: (Transaction | VersionedTransaction)[]) => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }
    if (!wallet.signAllTransactions) {
      throw new Error('Wallet does not support signing multiple transactions');
    }
    return await wallet.signAllTransactions(transactions);
  }, [wallet, connected]);

  return {
    wallet,
    publicKey,
    connected,
    connecting,
    isLoading,
    availableWallets,
    connect,
    disconnect,
    signTransaction,
    signMessage,
    signAllTransactions,
  };
}

/**
 * Helper to create wallet from provider (for existing connections)
 */
function createDirectWalletFromProvider(name: string, provider: any): Wallet {
  let publicKey: PublicKey | null = null;
  let connected = false;

  if (provider.publicKey) {
    publicKey = new PublicKey(provider.publicKey);
    connected = provider.isConnected || false;
  }

  return {
    name,
    icon: provider.icon,
    get publicKey() {
      return publicKey;
    },
    get connected() {
      return connected;
    },
    async connect() {
      const response = await provider.connect();
      if (response?.publicKey) {
        publicKey = new PublicKey(response.publicKey);
        connected = true;
      }
    },
    async disconnect() {
      await provider.disconnect();
      publicKey = null;
      connected = false;
    },
    async signTransaction(transaction: Transaction | VersionedTransaction) {
      return await provider.signTransaction(transaction);
    },
    async signMessage(message: Uint8Array) {
      const result = await provider.signMessage(message, 'utf8');
      return result.signature;
    },
    async signAllTransactions(transactions: (Transaction | VersionedTransaction)[]) {
      return await provider.signAllTransactions(transactions);
    },
  };
}

