import { PublicKey } from '@solana/web3.js';
import { solanaApi } from '@/lib/api/solana';

// Cache for program IDs fetched from backend
let programIdsCache: ProgramIdsCache | null = null;

type ProgramIdsCache = {
  campaignProgramId: PublicKey;
  dealEscrowProgramId: PublicKey;
  treasuryProgramId: PublicKey;
  solanaRpcUrl: string;
  solanaCluster: string;
};

let programIdsPromise: Promise<ProgramIdsCache> | null = null;
let initializationError: Error | null = null;

// Placeholder PublicKeys that will be replaced after initialization
// These are invalid but will be replaced once we fetch from backend
let CAMPAIGN_PROGRAM_ID: PublicKey;
let DEAL_ESCROW_PROGRAM_ID: PublicKey;
let TREASURY_PROGRAM_ID: PublicKey;

// Initialize with dummy values (will be replaced)
try {
  CAMPAIGN_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
  DEAL_ESCROW_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
  TREASURY_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
} catch {
  // Fallback if PublicKey constructor fails
}

/**
 * Fetch program IDs from backend and cache them
 * This ensures we only fetch once and reuse the cached values
 */
async function fetchProgramIds(): Promise<ProgramIdsCache> {
  if (programIdsCache) {
    return programIdsCache;
  }

  if (initializationError) {
    throw initializationError;
  }

  if (programIdsPromise) {
    return programIdsPromise;
  }

  programIdsPromise = (async () => {
    try {
      console.log('Fetching program IDs from backend...');
      const response = await solanaApi.getProgramIds();
      console.log('Received program IDs:', {
        campaign: response.campaignProgramId?.substring(0, 8) + '...',
        dealEscrow: response.dealEscrowProgramId?.substring(0, 8) + '...',
        treasury: response.treasuryProgramId?.substring(0, 8) + '...',
      });
      
      const campaignProgramId = new PublicKey(response.campaignProgramId);
      const dealEscrowProgramId = new PublicKey(response.dealEscrowProgramId);
      const treasuryProgramId = new PublicKey(response.treasuryProgramId);

      // Replace the exported constants
      CAMPAIGN_PROGRAM_ID = campaignProgramId;
      DEAL_ESCROW_PROGRAM_ID = dealEscrowProgramId;
      TREASURY_PROGRAM_ID = treasuryProgramId;

      programIdsCache = {
        campaignProgramId,
        dealEscrowProgramId,
        treasuryProgramId,
        solanaRpcUrl: response.solanaRpcUrl,
        solanaCluster: response.solanaCluster,
      };

      console.log('Program IDs cached successfully');
      return programIdsCache;
    } catch (error) {
      console.error('Error fetching program IDs:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack',
        status: (error as any)?.status,
        statusText: (error as any)?.statusText,
      });
      
      // Clear promise on error so we can retry
      programIdsPromise = null;
      const err = new Error(
        `Failed to fetch program IDs from backend: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
        `Please ensure the backend is running and the /api/solana/program-ids endpoint is accessible.`
      );
      initializationError = err;
      throw err;
    }
  })();

  return programIdsPromise;
}

/**
 * Initialize program IDs (call this early in app lifecycle)
 * This will fetch from backend and cache the results
 * Returns true if initialization was successful, false if already initialized
 */
export async function initializeProgramIds(): Promise<void> {
  await fetchProgramIds();
}

/**
 * Get program IDs (async)
 * Use this in async functions or useEffect
 */
export async function getProgramIds(): Promise<ProgramIdsCache> {
  return fetchProgramIds();
}

/**
 * Get campaign program ID (async)
 */
export async function getCampaignProgramId(): Promise<PublicKey> {
  const ids = await fetchProgramIds();
  return ids.campaignProgramId;
}

/**
 * Get deal escrow program ID (async)
 */
export async function getDealEscrowProgramId(): Promise<PublicKey> {
  const ids = await fetchProgramIds();
  return ids.dealEscrowProgramId;
}

/**
 * Get treasury program ID (async)
 */
export async function getTreasuryProgramId(): Promise<PublicKey> {
  const ids = await fetchProgramIds();
  return ids.treasuryProgramId;
}

// Auto-initialize on client side (browser only)
if (typeof window !== 'undefined') {
  // Start initialization immediately but don't block
  fetchProgramIds().catch((error) => {
    console.error('Failed to auto-initialize program IDs:', error);
  });
}

// Export the PublicKey instances
// These will be the dummy values initially, then replaced with real values after fetch
export { CAMPAIGN_PROGRAM_ID, DEAL_ESCROW_PROGRAM_ID, TREASURY_PROGRAM_ID };
