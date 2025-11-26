'use client';

import { Connection, Commitment } from '@solana/web3.js';
import { getProgramIds } from './program-ids';

let connectionInstance: Connection | null = null;
let connectionPromise: Promise<Connection> | null = null;

/**
 * Get or create a Solana connection instance
 * Uses RPC URL from program IDs configuration
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
      const programIds = await getProgramIds();
      const rpcUrl = programIds.solanaRpcUrl || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
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
 */
export async function createConnection(): Promise<Connection> {
  const programIds = await getProgramIds();
  const rpcUrl = programIds.solanaRpcUrl || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  const commitment: Commitment = 'confirmed';

  return new Connection(rpcUrl, {
    commitment,
    disableRetryOnRateLimit: false,
  });
}

