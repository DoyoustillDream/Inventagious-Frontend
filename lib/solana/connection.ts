'use client';

import { Connection, Commitment } from '@solana/web3.js';
import { getProgramIds } from './program-ids';

let connectionInstance: Connection | null = null;
let connectionPromise: Promise<Connection> | null = null;

/**
 * Get RPC URL from backend or environment variable
 * Works in both on-chain and off-chain modes
 */
async function getRpcUrl(): Promise<string> {
  try {
    const programIds = await getProgramIds();
    if (programIds.solanaRpcUrl) {
      return programIds.solanaRpcUrl;
    }
  } catch (error) {
    // If fetching program IDs fails, fall back to env variable
    console.warn('Failed to get RPC URL from backend, using env variable:', error);
  }
  
  // Fallback to environment variable
  const envRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (envRpcUrl) {
    return envRpcUrl;
  }
  
  // Final fallback to devnet
  return 'https://api.devnet.solana.com';
}

/**
 * Get or create a Solana connection instance
 * Uses RPC URL from program IDs configuration or environment variable
 * Works in both on-chain and off-chain modes
 */
export async function getConnection(): Promise<Connection> {
  if (connectionInstance) {
    return connectionInstance;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const rpcUrl = await getRpcUrl();
      
      const commitment: Commitment = 'confirmed';

      connectionInstance = new Connection(rpcUrl, {
        commitment,
        disableRetryOnRateLimit: false,
      });

      return connectionInstance;
    } catch (error) {
      // Clear promise on error so we can retry
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

/**
 * Create a new connection instance (for cases where you need a fresh connection)
 * Works in both on-chain and off-chain modes
 */
export async function createConnection(): Promise<Connection> {
  const rpcUrl = await getRpcUrl();
  
  const commitment: Commitment = 'confirmed';

  return new Connection(rpcUrl, {
    commitment,
    disableRetryOnRateLimit: false,
  });
}

