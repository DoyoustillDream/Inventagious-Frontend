import * as anchor from '@coral-xyz/anchor';
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { getDealEscrowProgramId, getTreasuryProgramId } from './program-ids';
import {
  deriveDealPda,
  deriveDealEscrowVaultPda,
  deriveMilestonePda,
  deriveTreasuryPda,
  deriveFeeVaultPda,
} from './pda';

const MIN_DEAL_AMOUNT = 10 * LAMPORTS_PER_SOL; // 10 SOL

/**
 * Hook to interact with the Deal Escrow program
 * No SDK - returns null values
 */
export function useDealEscrowProgram() {
  return { program: null, wallet: null, connection: null };
}

/**
 * Create a deal on-chain
 * Returns the transaction that needs to be signed
 */
export async function createDealTransaction(
  investor: PublicKey,
  inventor: PublicKey,
  dealId: string,
  amount: number,
  proposedDeadline: number,
  termsHash?: string,
  program: any = null,
  connection: any = null,
): Promise<{ transaction: any; dealPda: PublicKey }> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  // Validate minimum deal amount
  const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);
  if (amountLamports < MIN_DEAL_AMOUNT) {
    throw new Error(
      `Minimum deal amount is ${MIN_DEAL_AMOUNT / LAMPORTS_PER_SOL} SOL`,
    );
  }

  // Convert project_id to bytes for the hash and full ID
  const projectIdBytes = Buffer.from(dealId, 'utf-8');
  
  // Create project_id_hash (first 32 bytes of project_id)
  const projectIdHash = Buffer.alloc(32);
  projectIdBytes.copy(projectIdHash, 0, 0, Math.min(32, projectIdBytes.length));

  // Full project_id buffer (64 bytes)
  const projectIdBuffer = Buffer.alloc(64);
  projectIdBytes.copy(projectIdBuffer, 0, 0, Math.min(64, projectIdBytes.length));

  // Derive PDAs using project_id_hash
  const [dealPda] = await deriveDealPda(investor, dealId);
  const [dealEscrowVaultPda] = await deriveDealEscrowVaultPda(dealPda);

  // Convert terms hash if provided
  let termsHashBuffer: number[] | null = null;
  if (termsHash) {
    const hashBytes = Buffer.from(termsHash, 'hex');
    termsHashBuffer = Array.from(hashBytes);
  }

  // Get program ID from backend
  const dealEscrowProgramId = await getDealEscrowProgramId();

  // Fetch IDL and create program instance
  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  // Build transaction
  const tx = await dealProgram.methods
    .createDeal(
      Array.from(projectIdHash),
      Array.from(projectIdBuffer),
      projectIdBytes.length,
      new anchor.BN(amountLamports),
      new anchor.BN(proposedDeadline),
      termsHashBuffer ? Array.from(new Uint8Array(32)) : null,
    )
    .accounts({
      deal: dealPda,
      dealEscrowVault: dealEscrowVaultPda,
      investor,
      inventor,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return { transaction: tx, dealPda };
}

/**
 * Accept a deal (inventor accepts, investor must sign to transfer funds)
 */
export async function acceptDealTransaction(
  investor: PublicKey,
  inventor: PublicKey,
  dealPda: PublicKey,
  program: any,
  connection: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const [dealEscrowVaultPda] = await deriveDealEscrowVaultPda(dealPda);
  const [treasuryPda] = await deriveTreasuryPda();
  const [feeVaultPda] = await deriveFeeVaultPda(treasuryPda);

  // Fetch IDL
  let dealIdl: anchor.Idl | null = null;
  let treasuryIdl: anchor.Idl | null = null;

  try {
    const dealEscrowProgramId = await getDealEscrowProgramId();
    const treasuryProgramId = await getTreasuryProgramId();
    
    dealIdl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
    treasuryIdl = await anchor.Program.fetchIdl(treasuryProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load program IDLs');
  }

  if (!dealIdl || !treasuryIdl) {
    throw new Error('Program IDLs not found');
  }

  const dealEscrowProgramId = await getDealEscrowProgramId();
  const treasuryProgramId = await getTreasuryProgramId();

  // Normalize IDLs with correct program IDs to avoid DeclaredProgramIdMismatch
  const normalizedDealIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...dealIdl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const normalizedTreasuryIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...treasuryIdl,
    address: treasuryProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedDealIdl,
    program.provider,
  );

  const treasuryProgram = new anchor.Program(
    normalizedTreasuryIdl,
    program.provider,
  );

  // Build transaction
  const tx = await dealProgram.methods
    .acceptDeal()
    .accounts({
      deal: dealPda,
      dealEscrowVault: dealEscrowVaultPda,
      investor,
      inventor,
      treasury: treasuryPda,
      feeVault: feeVaultPda,
      treasuryProgram: treasuryProgram.programId,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return tx;
}

/**
 * Reject a deal
 */
export async function rejectDealTransaction(
  inventor: PublicKey,
  dealPda: PublicKey,
  program: any,
  connection: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const dealEscrowProgramId = await getDealEscrowProgramId();

  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  const tx = await dealProgram.methods
    .rejectDeal()
    .accounts({
      deal: dealPda,
      inventor,
    })
    .transaction();

  return tx;
}

/**
 * Cancel a deal
 */
export async function cancelDealTransaction(
  investor: PublicKey,
  dealPda: PublicKey,
  program: any,
  connection: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const [dealEscrowVaultPda] = await deriveDealEscrowVaultPda(dealPda);

  const dealEscrowProgramId = await getDealEscrowProgramId();

  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  const tx = await dealProgram.methods
    .cancelDeal()
    .accounts({
      deal: dealPda,
      dealEscrowVault: dealEscrowVaultPda,
      investor,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return tx;
}

/**
 * Release milestone funds
 */
export async function releaseMilestoneTransaction(
  investor: PublicKey,
  inventor: PublicKey,
  dealPda: PublicKey,
  milestoneIndex: number,
  amount: number,
  program: any,
  connection: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const [dealEscrowVaultPda] = await deriveDealEscrowVaultPda(dealPda);
  const [milestonePda] = await deriveMilestonePda(dealPda, milestoneIndex);

  const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);

  const dealEscrowProgramId = await getDealEscrowProgramId();

  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  const tx = await dealProgram.methods
    .releaseMilestone(milestoneIndex, new anchor.BN(amountLamports))
    .accounts({
      deal: dealPda,
      dealEscrowVault: dealEscrowVaultPda,
      milestone: milestonePda,
      investor,
      inventor,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return tx;
}

/**
 * Complete a deal
 */
export async function completeDealTransaction(
  inventor: PublicKey,
  dealPda: PublicKey,
  program: any,
  connection: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const dealEscrowProgramId = await getDealEscrowProgramId();

  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  const tx = await dealProgram.methods
    .completeDeal()
    .accounts({
      deal: dealPda,
      inventor,
    })
    .transaction();

  return tx;
}

/**
 * Get deal account data
 */
export async function getDeal(
  dealPda: PublicKey,
  connection: any,
  program: any,
): Promise<any> {
  if (!program || !connection) {
    throw new Error('Program not initialized');
  }

  const dealEscrowProgramId = await getDealEscrowProgramId();

  let idl: anchor.Idl | null = null;
  try {
    idl = await anchor.Program.fetchIdl(dealEscrowProgramId, {
      connection,
    } as any);
  } catch (error) {
    throw new Error('Failed to load deal escrow program IDL');
  }

  if (!idl) {
    throw new Error('Deal Escrow program IDL not found');
  }

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: dealEscrowProgramId.toBase58(),
  }));

  const dealProgram = new anchor.Program(
    normalizedIdl,
    program.provider,
  );

  try {
    const deal = await (dealProgram.account as any).deal.fetch(dealPda);
    return deal;
  } catch (error) {
    throw new Error(`Failed to fetch deal: ${error}`);
  }
}

