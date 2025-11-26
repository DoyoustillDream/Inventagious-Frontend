import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Commitment } from '@solana/web3.js';
import {
  CAMPAIGN_PROGRAM_ID,
  DEAL_ESCROW_PROGRAM_ID,
  TREASURY_PROGRAM_ID,
} from './program-ids';

// IDL Types - These will be loaded from the IDL files
// For now, we use a generic type
type ProgramIdl = anchor.Idl;

let campaignIdl: ProgramIdl | null = null;
let dealEscrowIdl: ProgramIdl | null = null;
let treasuryIdl: ProgramIdl | null = null;

/**
 * Load IDL from public directory or fetch from chain
 */
async function loadIdl(programId: PublicKey): Promise<ProgramIdl | null> {
  try {
    // Try to load from public/idl directory
    const idlName = programId.equals(CAMPAIGN_PROGRAM_ID)
      ? 'crowdfunding_campaign'
      : programId.equals(DEAL_ESCROW_PROGRAM_ID)
        ? 'private_deal_escrow'
        : programId.equals(TREASURY_PROGRAM_ID)
          ? 'platform_treasury'
          : null;

    if (!idlName) return null;

    // In production, you'd fetch from your CDN or public directory
    // For now, we'll try to fetch from the chain
    const idl = await anchor.Program.fetchIdl(programId, {
      connection: new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          'https://api.devnet.solana.com',
      ),
    } as any);

    return idl;
  } catch (error) {
    console.warn('Failed to load IDL:', error);
    return null;
  }
}

/**
 * Get Anchor program instance
 * No SDK - returns null
 */
export function useAnchorProgram(programId: PublicKey) {
  return null;
}

/**
 * Initialize Anchor programs (call this once on app load)
 */
export async function initializeAnchorPrograms(connection: Connection) {
  try {
    campaignIdl = await loadIdl(CAMPAIGN_PROGRAM_ID);
    dealEscrowIdl = await loadIdl(DEAL_ESCROW_PROGRAM_ID);
    treasuryIdl = await loadIdl(TREASURY_PROGRAM_ID);
  } catch (error) {
    console.error('Failed to initialize Anchor programs:', error);
  }
}

