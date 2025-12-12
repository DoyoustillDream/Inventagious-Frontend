'use client';

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  getMint,
} from '@solana/spl-token';

import { apiClient } from '@/lib/api/client';

/**
 * Get USDC mint address from backend
 */
export async function getUSDCMintAddress(): Promise<PublicKey> {
  try {
    const data = await apiClient.get<{ mintAddress: string }>('/solana/usdc-mint');
    return new PublicKey(data.mintAddress);
  } catch (error) {
    throw new Error(`Failed to get USDC mint address: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a USDC token transfer transaction
 * @param from PublicKey of the sender
 * @param to PublicKey of the recipient (campaign wallet)
 * @param amount Amount in USDC (will be converted to micro-USDC with 6 decimals)
 * @param connection Solana connection
 * @returns Transaction ready to be signed
 */
export async function createUSDCTransfer(
  from: PublicKey,
  to: PublicKey,
  amount: number,
  connection: Connection,
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Get USDC mint address
  const usdcMint = await getUSDCMintAddress();

  // Get sender's Associated Token Account (ATA) for USDC
  const fromATA = getAssociatedTokenAddressSync(usdcMint, from);

  // Get recipient's Associated Token Account (ATA) for USDC
  const toATA = getAssociatedTokenAddressSync(usdcMint, to);

  // Convert USDC amount to micro-USDC (6 decimals)
  const microUSDC = BigInt(Math.floor(amount * 1e6));

  // Get mint info to verify decimals
  let mintInfo;
  try {
    mintInfo = await getMint(connection, usdcMint);
  } catch (error) {
    throw new Error(`Failed to get USDC mint info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Create transaction
  const transaction = new Transaction();

  // Check if recipient ATA exists, if not, we need to create it
  // For now, we'll use TransferChecked which includes the mint in the instruction
  // This is safer and more explicit
  transaction.add(
    createTransferCheckedInstruction(
      fromATA,           // source
      usdcMint,          // mint
      toATA,             // destination
      from,              // owner (authority)
      microUSDC,         // amount in micro-USDC
      mintInfo.decimals, // decimals (should be 6 for USDC)
    ),
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;

  return transaction;
}

/**
 * Check if a wallet has a USDC Associated Token Account
 * @param walletAddress Wallet public key
 * @param connection Solana connection
 * @returns true if ATA exists, false otherwise
 */
export async function hasUSDCTokenAccount(
  walletAddress: PublicKey,
  connection: Connection,
): Promise<boolean> {
  try {
    const usdcMint = await getUSDCMintAddress();
    const ata = getAssociatedTokenAddressSync(usdcMint, walletAddress);
    
    // Try to get account info
    const accountInfo = await connection.getAccountInfo(ata);
    return accountInfo !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get USDC balance for a wallet
 * @param walletAddress Wallet public key
 * @param connection Solana connection
 * @returns Balance in USDC (6 decimals)
 */
export async function getUSDCBalance(
  walletAddress: PublicKey,
  connection: Connection,
): Promise<number> {
  try {
    const usdcMint = await getUSDCMintAddress();
    const ata = getAssociatedTokenAddressSync(usdcMint, walletAddress);
    
    // Import getAccount dynamically to avoid issues
    const { getAccount } = await import('@solana/spl-token');
    const account = await getAccount(connection, ata);
    
    // USDC has 6 decimals
    return Number(account.amount) / 1e6;
  } catch (error) {
    // If account doesn't exist, balance is 0
    return 0;
  }
}

