'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Use refs to track state without causing re-renders in the interval
  const connectedRef = useRef(false);
  const walletRef = useRef<Wallet | null>(null);
  const lastCheckRef = useRef<number>(0);
  const CHECK_DEBOUNCE_MS = 1000; // Don't check more than once per second

  // Check for existing connection on mount and listen for changes
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined') {
        // Small delay to ensure wallet extensions are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check Phantom
        if ((window as any).phantom?.solana) {
          const phantomProvider = (window as any).phantom.solana;
          const checkPhantomConnection = () => {
            // Debounce rapid calls
            const now = Date.now();
            if (now - lastCheckRef.current < CHECK_DEBOUNCE_MS) {
              return;
            }
            lastCheckRef.current = now;

            const isConnected = phantomProvider.isConnected && phantomProvider.publicKey;
            const currentPublicKeyStr = connectedRef.current && walletRef.current?.publicKey 
              ? walletRef.current.publicKey.toBase58() 
              : null;
            const newPublicKeyStr = isConnected && phantomProvider.publicKey 
              ? (typeof phantomProvider.publicKey === 'string' 
                  ? phantomProvider.publicKey 
                  : phantomProvider.publicKey.toBase58())
              : null;
            
            // Only update if state actually changed
            if (isConnected && newPublicKeyStr && newPublicKeyStr !== currentPublicKeyStr) {
              const phantomWallet = createDirectWalletFromProvider('Phantom', phantomProvider);
              const newPublicKey = phantomWallet.publicKey;
              if (newPublicKey) {
                setWallet(phantomWallet);
                setPublicKey(newPublicKey);
                setConnected(true);
                connectedRef.current = true;
                walletRef.current = phantomWallet;
              }
            } else if (!isConnected && connectedRef.current) {
              setWallet(null);
              setPublicKey(null);
              setConnected(false);
              connectedRef.current = false;
              walletRef.current = null;
            }
          };
          
          checkPhantomConnection();
          
          // Listen for Phantom connection changes
          if (phantomProvider.on) {
            phantomProvider.on('connect', checkPhantomConnection);
            phantomProvider.on('disconnect', checkPhantomConnection);
            phantomProvider.on('accountChanged', checkPhantomConnection);
          }
        }
        // Check Solflare
        else if ((window as any).solflare) {
          const solflareProvider = (window as any).solflare;
          const checkSolflareConnection = () => {
            // Debounce rapid calls
            const now = Date.now();
            if (now - lastCheckRef.current < CHECK_DEBOUNCE_MS) {
              return;
            }
            lastCheckRef.current = now;

            const isConnected = solflareProvider.isConnected && solflareProvider.publicKey;
            const currentPublicKeyStr = connectedRef.current && walletRef.current?.publicKey 
              ? walletRef.current.publicKey.toBase58() 
              : null;
            const newPublicKeyStr = isConnected && solflareProvider.publicKey 
              ? (typeof solflareProvider.publicKey === 'string' 
                  ? solflareProvider.publicKey 
                  : solflareProvider.publicKey.toBase58())
              : null;
            
            // Only update if state actually changed
            if (isConnected && newPublicKeyStr && newPublicKeyStr !== currentPublicKeyStr) {
              const solflareWallet = createDirectWalletFromProvider('Solflare', solflareProvider);
              const newPublicKey = solflareWallet.publicKey;
              if (newPublicKey) {
                setWallet(solflareWallet);
                setPublicKey(newPublicKey);
                setConnected(true);
                connectedRef.current = true;
                walletRef.current = solflareWallet;
              }
            } else if (!isConnected && connectedRef.current) {
              setWallet(null);
              setPublicKey(null);
              setConnected(false);
              connectedRef.current = false;
              walletRef.current = null;
            }
          };
          
          checkSolflareConnection();
          
          // Listen for Solflare connection changes
          if (solflareProvider.on) {
            solflareProvider.on('connect', checkSolflareConnection);
            solflareProvider.on('disconnect', checkSolflareConnection);
            solflareProvider.on('accountChanged', checkSolflareConnection);
          }
        }
        // Check Backpack
        else if ((window as any).backpack) {
          const backpackProvider = (window as any).backpack;
          const checkBackpackConnection = () => {
            // Debounce rapid calls
            const now = Date.now();
            if (now - lastCheckRef.current < CHECK_DEBOUNCE_MS) {
              return;
            }
            lastCheckRef.current = now;

            const isConnected = backpackProvider.isConnected && backpackProvider.publicKey;
            const currentPublicKeyStr = connectedRef.current && walletRef.current?.publicKey 
              ? walletRef.current.publicKey.toBase58() 
              : null;
            const newPublicKeyStr = isConnected && backpackProvider.publicKey 
              ? (typeof backpackProvider.publicKey === 'string' 
                  ? backpackProvider.publicKey 
                  : backpackProvider.publicKey.toBase58())
              : null;
            
            // Only update if state actually changed
            if (isConnected && newPublicKeyStr && newPublicKeyStr !== currentPublicKeyStr) {
              const backpackWallet = createDirectWalletFromProvider('Backpack', backpackProvider);
              const newPublicKey = backpackWallet.publicKey;
              if (newPublicKey) {
                setWallet(backpackWallet);
                setPublicKey(newPublicKey);
                setConnected(true);
                connectedRef.current = true;
                walletRef.current = backpackWallet;
              }
            } else if (!isConnected && connectedRef.current) {
              setWallet(null);
              setPublicKey(null);
              setConnected(false);
              connectedRef.current = false;
              walletRef.current = null;
            }
          };
          
          checkBackpackConnection();
          
          // Listen for Backpack connection changes
          if (backpackProvider.on) {
            backpackProvider.on('connect', checkBackpackConnection);
            backpackProvider.on('disconnect', checkBackpackConnection);
            backpackProvider.on('accountChanged', checkBackpackConnection);
          }
        }
      }
      setIsLoading(false); // Mark as done loading
    };
    
    checkExistingConnection();
    
    // Only poll periodically if not already connected (event listeners handle most cases)
    // Use a longer interval (5 seconds) and only check when disconnected to reduce overhead
    const interval = setInterval(() => {
      // Skip polling if already connected (event listeners handle state changes)
      if (connectedRef.current) {
        return;
      }

      if (typeof window !== 'undefined') {
        // Re-check connection status for all wallets only when disconnected
        if ((window as any).phantom?.solana) {
          const phantomProvider = (window as any).phantom.solana;
          const isConnected = phantomProvider.isConnected && phantomProvider.publicKey;
          if (isConnected && !connectedRef.current) {
            const phantomWallet = createDirectWalletFromProvider('Phantom', phantomProvider);
            setWallet(phantomWallet);
            setPublicKey(phantomWallet.publicKey);
            setConnected(true);
            connectedRef.current = true;
            walletRef.current = phantomWallet;
          }
        } else if ((window as any).solflare) {
          const solflareProvider = (window as any).solflare;
          const isConnected = solflareProvider.isConnected && solflareProvider.publicKey;
          if (isConnected && !connectedRef.current) {
            const solflareWallet = createDirectWalletFromProvider('Solflare', solflareProvider);
            setWallet(solflareWallet);
            setPublicKey(solflareWallet.publicKey);
            setConnected(true);
            connectedRef.current = true;
            walletRef.current = solflareWallet;
          }
        } else if ((window as any).backpack) {
          const backpackProvider = (window as any).backpack;
          const isConnected = backpackProvider.isConnected && backpackProvider.publicKey;
          if (isConnected && !connectedRef.current) {
            const backpackWallet = createDirectWalletFromProvider('Backpack', backpackProvider);
            setWallet(backpackWallet);
            setPublicKey(backpackWallet.publicKey);
            setConnected(true);
            connectedRef.current = true;
            walletRef.current = backpackWallet;
          }
        }
      }
    }, 5000); // Check every 5 seconds instead of 500ms, and only when disconnected
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array - refs handle state tracking

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
      connectedRef.current = selectedWallet.connected;
      walletRef.current = selectedWallet;
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
        connectedRef.current = false;
        walletRef.current = null;
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
    if (!publicKey) {
      throw new Error('Public key not available');
    }
    // Use basic wallet signing - for optimized signing with retry logic, use useTransactionSigning hook
    return await wallet.signTransaction(transaction);
  }, [wallet, connected, publicKey]);

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
    if (!publicKey) {
      throw new Error('Public key not available');
    }
    if (!wallet.signAllTransactions) {
      throw new Error('Wallet does not support signing multiple transactions');
    }
    // Use basic wallet signing - for optimized signing with retry logic, use useTransactionSigning hook
    return await wallet.signAllTransactions(transactions);
  }, [wallet, connected, publicKey]);

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
  return {
    name,
    icon: provider.icon,
    get publicKey() {
      // Always check current state from provider
      if (provider.publicKey) {
        try {
          return new PublicKey(provider.publicKey);
        } catch {
          return null;
        }
      }
      return null;
    },
    get connected() {
      // Always check current state from provider
      return provider.isConnected === true && !!provider.publicKey;
    },
    async connect() {
      const response = await provider.connect();
      if (response?.publicKey) {
        // State will be updated via getters
      }
    },
    async disconnect() {
      await provider.disconnect();
      // State will be updated via getters
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

