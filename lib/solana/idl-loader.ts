import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

// Import IDLs directly
import campaignIdl from './idls/crowdfunding_campaign.json';
import dealEscrowIdl from './idls/private_deal_escrow.json';
import treasuryIdl from './idls/platform_treasury.json';

// Cache for loaded IDLs
const idlCache = new Map<string, anchor.Idl>();

/**
 * Get IDL name from program ID
 */
function getIdlName(programId: PublicKey, programIds: {
  campaignProgramId: PublicKey;
  dealEscrowProgramId: PublicKey;
  treasuryProgramId: PublicKey;
}): string | null {
  if (programId.equals(programIds.campaignProgramId)) {
    return 'crowdfunding_campaign';
  }
  if (programId.equals(programIds.dealEscrowProgramId)) {
    return 'private_deal_escrow';
  }
  if (programId.equals(programIds.treasuryProgramId)) {
    return 'platform_treasury';
  }
  return null;
}

/**
 * Load IDL from local files
 * 
 * @param programId The program ID
 * @param connection The Solana connection (kept for compatibility, not used)
 * @param programIds The program IDs mapping
 * @returns The IDL
 */
export async function loadIdl(
  programId: PublicKey,
  connection: Connection,
  programIds: {
    campaignProgramId: PublicKey;
    dealEscrowProgramId: PublicKey;
    treasuryProgramId: PublicKey;
  },
): Promise<anchor.Idl> {
  // Check cache first
  const cacheKey = programId.toBase58();
  const cached = idlCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Get IDL name
  const idlName = getIdlName(programId, programIds);
  if (!idlName) {
    throw new Error(
      `Unknown program ID: ${programId.toBase58()}. ` +
      `Expected one of: campaign, deal escrow, or treasury program.`
    );
  }

  // Load from local files
  let idl: anchor.Idl;
  switch (idlName) {
    case 'crowdfunding_campaign':
      idl = campaignIdl as anchor.Idl;
      break;
    case 'private_deal_escrow':
      idl = dealEscrowIdl as anchor.Idl;
      break;
    case 'platform_treasury':
      idl = treasuryIdl as anchor.Idl;
      break;
    default:
      throw new Error(`Unknown IDL name: ${idlName}`);
  }

  // Cache the IDL
  idlCache.set(cacheKey, idl);
  return idl;
}

/**
 * Clear IDL cache (useful for testing or when programs are updated)
 */
export function clearIdlCache(): void {
  idlCache.clear();
}

/**
 * Clear cache for a specific program
 */
export function clearIdlCacheForProgram(programId: PublicKey): void {
  idlCache.delete(programId.toBase58());
}
