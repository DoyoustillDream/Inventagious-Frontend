/**
 * Wallet Standard API Integration
 * Uses the browser's Wallet Standard API to detect and connect to Solana wallets
 * This is the modern standard supported by Phantom, Solflare, Backpack, and others
 */

import { PublicKey, Connection, Transaction, VersionedTransaction } from '@solana/web3.js';

export interface Wallet {
  name: string;
  icon?: string;
  publicKey: PublicKey | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  signAllTransactions?: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
}

/**
 * Detect available wallets using Wallet Standard API
 */
export function detectWallets(): Wallet[] {
  const wallets: Wallet[] = [];

  // Check for Wallet Standard API (modern standard)
  if (typeof window !== 'undefined' && 'wallets' in window) {
    const standardWallets = (window as any).wallets?.get();
    if (standardWallets) {
      standardWallets.forEach((wallet: any) => {
        if (wallet.chains?.includes('solana:mainnet') || wallet.chains?.includes('solana:devnet')) {
          wallets.push(createStandardWallet(wallet));
        }
      });
    }
  }

  // Fallback to direct wallet detection (Phantom, Solflare, etc.)
  if (typeof window !== 'undefined') {
    // Phantom
    if ('phantom' in window && (window as any).phantom?.solana) {
      wallets.push(createDirectWallet('Phantom', (window as any).phantom.solana));
    }

    // Solflare
    if ('solflare' in window && (window as any).solflare) {
      wallets.push(createDirectWallet('Solflare', (window as any).solflare));
    }

    // Backpack
    if ('backpack' in window && (window as any).backpack) {
      wallets.push(createDirectWallet('Backpack', (window as any).backpack));
    }

    // Glow
    if ('glow' in window && (window as any).glow) {
      wallets.push(createDirectWallet('Glow', (window as any).glow));
    }
  }

  return wallets;
}

/**
 * Create a wallet adapter from Wallet Standard API wallet
 */
function createStandardWallet(wallet: any): Wallet {
  let publicKey: PublicKey | null = null;
  let connected = false;

  return {
    name: wallet.name || 'Unknown Wallet',
    icon: wallet.icon,
    get publicKey() {
      return publicKey;
    },
    get connected() {
      return connected;
    },
    async connect() {
      try {
        const result = await wallet.features['standard:connect'].connect();
        if (result?.accounts?.[0]?.address) {
          publicKey = new PublicKey(result.accounts[0].address);
          connected = true;
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    },
    async disconnect() {
      try {
        await wallet.features['standard:disconnect']?.disconnect();
        publicKey = null;
        connected = false;
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    },
    async signTransaction(transaction: Transaction | VersionedTransaction) {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      try {
        const result = await wallet.features['standard:signTransaction'].signTransaction({
          account: publicKey,
          transaction,
        });
        return result.signedTransaction;
      } catch (error) {
        console.error('Failed to sign transaction:', error);
        throw error;
      }
    },
    async signMessage(message: Uint8Array) {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      try {
        const result = await wallet.features['standard:signMessage'].signMessage({
          account: publicKey,
          message,
        });
        return result.signature;
      } catch (error) {
        console.error('Failed to sign message:', error);
        throw error;
      }
    },
  };
}

/**
 * Create a wallet adapter from direct wallet provider (window.solana, etc.)
 */
function createDirectWallet(name: string, provider: any): Wallet {
  let publicKey: PublicKey | null = null;
  let connected = false;

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
      try {
        const response = await provider.connect();
        if (response?.publicKey) {
          publicKey = new PublicKey(response.publicKey);
          connected = true;
        }
      } catch (error) {
        console.error(`Failed to connect ${name}:`, error);
        throw error;
      }
    },
    async disconnect() {
      try {
        await provider.disconnect();
        publicKey = null;
        connected = false;
      } catch (error) {
        console.error(`Failed to disconnect ${name}:`, error);
      }
    },
    async signTransaction(transaction: Transaction | VersionedTransaction) {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      try {
        if (transaction instanceof VersionedTransaction) {
          return await provider.signTransaction(transaction);
        }
        return await provider.signTransaction(transaction);
      } catch (error) {
        console.error(`Failed to sign transaction with ${name}:`, error);
        throw error;
      }
    },
    async signMessage(message: Uint8Array) {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      try {
        const result = await provider.signMessage(message, 'utf8');
        return result.signature;
      } catch (error) {
        console.error(`Failed to sign message with ${name}:`, error);
        throw error;
      }
    },
    async signAllTransactions(transactions: (Transaction | VersionedTransaction)[]) {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      try {
        return await provider.signAllTransactions(transactions);
      } catch (error) {
        console.error(`Failed to sign all transactions with ${name}:`, error);
        throw error;
      }
    },
  };
}

/**
 * Get the first available wallet (for quick connection)
 */
export function getFirstAvailableWallet(): Wallet | null {
  const wallets = detectWallets();
  return wallets.length > 0 ? wallets[0] : null;
}

