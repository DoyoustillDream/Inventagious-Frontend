import * as anchor from '@coral-xyz/anchor';
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import { getCampaignProgramId, getTreasuryProgramId, getProgramIds } from './program-ids';
import {
  deriveCampaignPda,
  deriveCampaignVaultPda,
  deriveContributionPda,
  deriveTreasuryPda,
  deriveFeeVaultPda,
  deriveCampaignConfigPda,
} from './pda';
import { loadIdl } from './idl-loader';
import { getMinContributionAmount } from '@/lib/api/payment-settings';

/**
 * Hook to interact with the Campaign program
 * No SDK - returns null values
 */
export function useCampaignProgram() {
  return { program: null, wallet: null, connection: null };
}

/**
 * Initialize a campaign on-chain
 * Returns the transaction that needs to be signed
 */
export async function initializeCampaignTransaction(
  creator: PublicKey,
  campaignId: string,
  fundingGoal: number,
  deadline: number,
  program: any,
  connection: any,
): Promise<{ transaction: any; campaignPda: PublicKey }> {
  if (!program) {
    throw new Error('Program not initialized');
  }

  if (!connection) {
    throw new Error('Connection not provided');
  }

  // Derive PDAs
  const [campaignPda] = await deriveCampaignPda(creator, campaignId);
  const [campaignVaultPda] = await deriveCampaignVaultPda(campaignPda);
  const [campaignConfigPda] = await deriveCampaignConfigPda();

  // Convert campaign_id to bytes
  const campaignIdBytes = Buffer.from(campaignId, 'utf-8');
  const campaignIdBuffer = Buffer.alloc(64);
  campaignIdBytes.copy(
    campaignIdBuffer,
    0,
    0,
    Math.min(64, campaignIdBytes.length),
  );

  // Convert funding goal to lamports
  const fundingGoalLamports = Math.floor(fundingGoal * LAMPORTS_PER_SOL);

  // Get program IDs from backend
  const programIds = await getProgramIds();
  const campaignProgramId = programIds.campaignProgramId;

  // Load IDL with fallback strategy (chain -> static file)
  const idl = await loadIdl(campaignProgramId, connection, programIds);

  // Validate IDL structure before creating Program
  if (!idl) {
    throw new Error('IDL is null or undefined');
  }
  
  if (!idl.instructions) {
    throw new Error('IDL missing instructions array');
  }
  
  if (!idl.accounts || idl.accounts.length === 0) {
    throw new Error('IDL missing accounts array');
  }
  
  if (!idl.types || idl.types.length === 0) {
    throw new Error('IDL missing types array');
  }

  // Verify all accounts have matching type definitions
  const typeNames = new Set((idl.types || []).map((t: any) => t.name));
  const missingTypes: string[] = [];
  
  for (const account of idl.accounts || []) {
    if (!typeNames.has(account.name)) {
      missingTypes.push(account.name);
    }
  }
  
  if (missingTypes.length > 0) {
    console.warn(
      `IDL accounts missing type definitions: ${missingTypes.join(', ')}. ` +
      `This might cause issues with Anchor Program initialization.`
    );
  }

  // Deep clone IDL to avoid any mutation issues
  // and ensure it has required metadata
  // CRITICAL: Override the IDL's address field with the actual program ID
  // This fixes the DeclaredProgramIdMismatch error when the IDL was generated
  // with a different program ID than what's actually deployed
  const normalizedIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idl,
    address: campaignProgramId.toBase58(), // Override with actual program ID
    metadata: idl.metadata || {
      name: 'crowdfunding_campaign',
      version: '0.1.0',
      spec: '0.1.0',
    },
  }));

  let campaignProgram;
  try {
    // Anchor v0.31.0+ Program constructor: new Program(idl, provider)
    // The program ID is extracted from the IDL's address field
    // The IDL must be a plain object, not a class instance
    // We've ensured the address matches the actual deployed program ID above
    campaignProgram = new anchor.Program(
      normalizedIdl,
      program.provider,
    );
  } catch (programError: any) {
    console.error('Error creating Anchor Program:', programError);
    console.error('Error stack:', programError?.stack);
    console.error('IDL structure:', {
      hasAddress: !!(normalizedIdl as any).address,
      address: (normalizedIdl as any).address,
      hasInstructions: !!normalizedIdl.instructions,
      instructionCount: normalizedIdl.instructions?.length || 0,
      hasAccounts: !!normalizedIdl.accounts,
      accountCount: normalizedIdl.accounts?.length || 0,
      hasTypes: !!normalizedIdl.types,
      typeCount: normalizedIdl.types?.length || 0,
      accountNames: normalizedIdl.accounts?.map((a: any) => a.name) || [],
      typeNames: normalizedIdl.types?.map((t: any) => t.name) || [],
      accountDetails: normalizedIdl.accounts?.map((a: any) => ({
        name: a.name,
        hasDiscriminator: !!a.discriminator,
        discriminatorLength: a.discriminator?.length || 0,
      })) || [],
      typeDetails: normalizedIdl.types?.map((t: any) => ({
        name: t.name,
        hasType: !!t.type,
        typeKind: t.type?.kind,
      })) || [],
    });
    throw new Error(
      `Failed to create Anchor Program: ${programError?.message || 'Unknown error'}. ` +
      `This is likely due to an IDL structure issue. Check console for details.`
    );
  }

  // Build transaction
  // For deadline, convert to string if it's i64::MAX to avoid precision loss in JavaScript
  // i64::MAX = 9223372036854775807 (beyond JavaScript's safe integer range)
  const deadlineValue = deadline >= 9223372036854775000 
    ? '9223372036854775807' // i64::MAX as string
    : deadline;
  
  try {
    // Verify program is properly initialized
    if (!campaignProgram || !campaignProgram.methods) {
      throw new Error('Campaign program is not properly initialized');
    }

    // Verify the method exists
    if (!campaignProgram.methods.initializeCampaign) {
      throw new Error('initializeCampaign method not found in program IDL');
    }

    // Build accounts object - Anchor accepts both camelCase and snake_case
    // but we'll use snake_case to match the IDL exactly
    const accounts = {
      campaign: campaignPda,
      campaign_vault: campaignVaultPda,
      config: campaignConfigPda,
      creator,
      system_program: SystemProgram.programId,
    };

    // Verify all accounts are defined
    for (const [key, value] of Object.entries(accounts)) {
      if (!value) {
        throw new Error(`Account ${key} is undefined`);
      }
    }

    // Prepare arguments - Anchor expects arrays for array types
    // But we need to ensure the data is properly formatted
    const campaignIdArray = Array.from(campaignIdBuffer);
    
    // Verify the array is valid
    if (!campaignIdArray || campaignIdArray.length !== 64) {
      throw new Error(`Invalid campaign ID buffer: expected 64 bytes, got ${campaignIdArray?.length || 0}`);
    }
    
    const txBuilder = campaignProgram.methods
      .initializeCampaign(
        campaignIdArray,
        campaignIdBytes.length,
        new anchor.BN(fundingGoalLamports),
        new anchor.BN(deadlineValue),
      )
      .accounts(accounts);

    let tx;
    try {
      // Get the instruction first, then manually build the transaction
      // This gives us more control over the transaction structure
      const instruction = await txBuilder.instruction();
      
      // Log instruction details for debugging
      console.log('Instruction details:', {
        programId: instruction.programId.toBase58(),
        keysCount: instruction.keys.length,
        keys: instruction.keys.map((key, i) => ({
          index: i,
          pubkey: key.pubkey.toBase58(),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        })),
        dataLength: instruction.data?.length || 0,
      });
      
      // Manually build the transaction to ensure proper structure
      tx = new Transaction();
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = blockhash;
      tx.feePayer = creator;
      
      // Add the instruction
      tx.add(instruction);
      
      // Verify transaction is a proper Transaction instance
      if (!(tx instanceof Transaction)) {
        throw new Error(
          `Expected Transaction instance, got ${typeof tx}. ` +
          `This might indicate an issue with the Anchor program setup.`
        );
      }
      
      // Verify transaction has required fields (Anchor should set these automatically)
      if (!tx.recentBlockhash) {
        // If Anchor didn't set it, we need to set it manually
        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        tx.recentBlockhash = blockhash;
      }
      if (!tx.feePayer) {
        tx.feePayer = creator;
      }
      
      // Verify transaction has instructions
      if (!tx.instructions || tx.instructions.length === 0) {
        throw new Error('Transaction has no instructions');
      }
      
      // Verify transaction has instructions
      if (!tx.instructions || tx.instructions.length === 0) {
        throw new Error('Transaction has no instructions');
      }
      
      // Verify all instructions are valid
      for (let i = 0; i < tx.instructions.length; i++) {
        const ix = tx.instructions[i];
        if (!ix) {
          throw new Error(`Instruction at index ${i} is undefined`);
        }
        if (!ix.programId) {
          throw new Error(`Instruction at index ${i} missing programId`);
        }
        // Check if instruction data is valid
        if (ix.data && !(ix.data instanceof Buffer) && !(ix.data instanceof Uint8Array)) {
          console.warn(`Instruction at index ${i} has invalid data type:`, typeof ix.data);
        }
      }
    } catch (txError: any) {
      console.error('Error building transaction:', txError);
      console.error('Stack:', txError?.stack);
      console.error('Accounts:', accounts);
      console.error('Method args:', {
        campaignId: Array.from(campaignIdBuffer),
        campaignIdLen: campaignIdBytes.length,
        fundingGoal: fundingGoalLamports,
        deadline: deadlineValue,
      });
      throw new Error(
        `Failed to build transaction: ${txError?.message || 'Unknown error'}. ` +
        `This might be due to account mismatches or IDL structure issues.`
      );
    }

    if (!tx) {
      throw new Error('Failed to build transaction: transaction is undefined');
    }

    // Verify transaction has required properties
    if (tx instanceof Transaction) {
      if (!tx.recentBlockhash && !tx.feePayer) {
        // Transaction is not fully initialized, but that's ok - we'll set it later
      }
    }

    return { transaction: tx, campaignPda };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error building initialize campaign transaction:', error);
    console.error('Campaign Program ID:', campaignProgramId.toString());
    console.error('Campaign PDA:', campaignPda.toString());
    console.error('Campaign Vault PDA:', campaignVaultPda.toString());
    throw new Error(
      `Failed to build initialize campaign transaction: ${errorMessage}`,
    );
  }
}

/**
 * Contribute to a campaign
 * Returns the transaction that needs to be signed
 */
export async function contributeTransaction(
  contributor: PublicKey,
  campaignPda: PublicKey,
  amount: number,
  program: any,
  connection: any,
): Promise<any> {
  if (!program) {
    throw new Error('Program not initialized');
  }

  // Validate minimum contribution
  const minContributionSol = await getMinContributionAmount();
  const minContributionLamports = Math.floor(minContributionSol * LAMPORTS_PER_SOL);
  const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);
  if (amountLamports < minContributionLamports) {
    throw new Error(
      `Minimum contribution is ${minContributionSol} SOL`,
    );
  }

  // Get program IDs from backend
  const programIds = await getProgramIds();
  const campaignProgramId = programIds.campaignProgramId;
  const treasuryProgramId = programIds.treasuryProgramId;

  // Derive PDAs
  const [campaignVaultPda] = await deriveCampaignVaultPda(campaignPda);
  const [contributionPda] = await deriveContributionPda(campaignPda, contributor);
  const [treasuryPda] = await deriveTreasuryPda();
  const [feeVaultPda] = await deriveFeeVaultPda(treasuryPda);

  // Load IDLs with fallback strategy (chain -> static file)
  const campaignIdlRaw = await loadIdl(campaignProgramId, connection, programIds);
  const treasuryIdlRaw = await loadIdl(treasuryProgramId, connection, programIds);

  // Normalize IDLs with correct program IDs to avoid DeclaredProgramIdMismatch
  const campaignIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...campaignIdlRaw,
    address: campaignProgramId.toBase58(),
  }));

  const treasuryIdl: anchor.Idl = JSON.parse(JSON.stringify({
    ...treasuryIdlRaw,
    address: treasuryProgramId.toBase58(),
  }));

  const campaignProgram = new anchor.Program(
    campaignIdl,
    program.provider,
  );

  const treasuryProgram = new anchor.Program(
    treasuryIdl,
    program.provider,
  );

  // Build transaction
  const tx = await campaignProgram.methods
    .contribute(new anchor.BN(amountLamports))
    .accounts({
      campaign: campaignPda,
      campaignVault: campaignVaultPda,
      contribution: contributionPda,
      contributor,
      treasury: treasuryPda,
      feeVault: feeVaultPda,
      treasuryProgram: treasuryProgram.programId,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return tx;
}

/**
 * Get campaign account data
 */
export async function getCampaign(
  campaignPda: PublicKey,
  connection: any,
  program: any,
): Promise<any> {
  if (!program) {
    throw new Error('Program not initialized');
  }

  // Get program IDs from backend
  const programIds = await getProgramIds();
  const campaignProgramId = programIds.campaignProgramId;

  // Load IDL with fallback strategy (chain -> static file)
  const idlRaw = await loadIdl(campaignProgramId, connection, programIds);

  // Normalize IDL with correct program ID to avoid DeclaredProgramIdMismatch
  const idl: anchor.Idl = JSON.parse(JSON.stringify({
    ...idlRaw,
    address: campaignProgramId.toBase58(),
  }));

  const campaignProgram = new anchor.Program(
    idl,
    program.provider,
  );

  try {
    const campaign = await (campaignProgram.account as any).campaign.fetch(campaignPda);
    return campaign;
  } catch (error) {
    throw new Error(`Failed to fetch campaign: ${error}`);
  }
}

