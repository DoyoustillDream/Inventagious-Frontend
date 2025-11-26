import { PublicKey } from '@solana/web3.js';
import {
  getCampaignProgramId,
  getDealEscrowProgramId,
  getTreasuryProgramId,
} from './program-ids';

/**
 * Derive Campaign PDA
 * Seeds: ["campaign", creator, campaign_id_hash]
 * Note: Uses SHA256 hash of campaign_id (32 bytes) to stay within Solana's seed length limit
 */
export async function deriveCampaignPda(
  creator: PublicKey,
  campaignId: string,
): Promise<[PublicKey, number]> {
  // Get program ID from backend
  const campaignProgramId = await getCampaignProgramId();
  
  // Use Web Crypto API to create SHA256 hash (browser-compatible)
  const campaignIdBytes = new TextEncoder().encode(campaignId);
  // Create a new ArrayBuffer from the Uint8Array to ensure type compatibility
  const arrayBuffer = new ArrayBuffer(campaignIdBytes.length);
  new Uint8Array(arrayBuffer).set(campaignIdBytes);
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const campaignIdHash = Buffer.from(new Uint8Array(hashBuffer));

  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), creator.toBuffer(), campaignIdHash],
    campaignProgramId,
  );
}

/**
 * Derive Campaign Vault PDA
 * Seeds: ["campaign_vault", campaign]
 */
export async function deriveCampaignVaultPda(
  campaign: PublicKey,
): Promise<[PublicKey, number]> {
  const campaignProgramId = await getCampaignProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign_vault'), campaign.toBuffer()],
    campaignProgramId,
  );
}

/**
 * Derive Contribution PDA
 * Seeds: ["contribution", campaign, contributor]
 */
export async function deriveContributionPda(
  campaign: PublicKey,
  contributor: PublicKey,
): Promise<[PublicKey, number]> {
  const campaignProgramId = await getCampaignProgramId();
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('contribution'),
      campaign.toBuffer(),
      contributor.toBuffer(),
    ],
    campaignProgramId,
  );
}

/**
 * Derive Deal PDA
 * Seeds: ["deal", investor, project_id_hash]
 * Note: Uses hash of project_id (first 32 bytes), not full project_id
 */
export async function deriveDealPda(
  investor: PublicKey,
  projectId: string,
): Promise<[PublicKey, number]> {
  const dealEscrowProgramId = await getDealEscrowProgramId();
  
  // Create project_id_hash (first 32 bytes of project_id)
  const projectIdBytes = Buffer.from(projectId, 'utf-8');
  const projectIdHash = Buffer.alloc(32);
  projectIdBytes.copy(projectIdHash, 0, 0, Math.min(32, projectIdBytes.length));

  return PublicKey.findProgramAddressSync(
    [Buffer.from('deal'), investor.toBuffer(), projectIdHash],
    dealEscrowProgramId,
  );
}

/**
 * Derive Deal Escrow Vault PDA
 * Seeds: ["deal_escrow_vault", deal]
 */
export async function deriveDealEscrowVaultPda(
  deal: PublicKey,
): Promise<[PublicKey, number]> {
  const dealEscrowProgramId = await getDealEscrowProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('deal_escrow_vault'), deal.toBuffer()],
    dealEscrowProgramId,
  );
}

/**
 * Derive Milestone PDA
 * Seeds: ["milestone", deal, milestone_index]
 */
export async function deriveMilestonePda(
  deal: PublicKey,
  milestoneIndex: number,
): Promise<[PublicKey, number]> {
  const dealEscrowProgramId = await getDealEscrowProgramId();
  const indexBuffer = Buffer.alloc(4);
  indexBuffer.writeUInt32LE(milestoneIndex, 0);

  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), deal.toBuffer(), indexBuffer],
    dealEscrowProgramId,
  );
}

/**
 * Derive Treasury PDA
 * Seeds: ["treasury", program_id]
 */
export async function deriveTreasuryPda(): Promise<[PublicKey, number]> {
  const treasuryProgramId = await getTreasuryProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('treasury'), treasuryProgramId.toBuffer()],
    treasuryProgramId,
  );
}

/**
 * Derive Fee Vault PDA
 * Seeds: ["fee_vault", treasury]
 */
export async function deriveFeeVaultPda(treasury: PublicKey): Promise<[PublicKey, number]> {
  const treasuryProgramId = await getTreasuryProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('fee_vault'), treasury.toBuffer()],
    treasuryProgramId,
  );
}

/**
 * Derive Campaign Config PDA
 * Seeds: ["campaign_config"]
 */
export async function deriveCampaignConfigPda(): Promise<[PublicKey, number]> {
  const campaignProgramId = await getCampaignProgramId();
  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign_config')],
    campaignProgramId,
  );
}

