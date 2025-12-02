'use client';

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

/**
 * Create a direct SOL transfer transaction (wallet-to-wallet)
 * @param from PublicKey of the sender
 * @param to PublicKey of the recipient
 * @param amount Amount in SOL
 * @param connection Solana connection
 * @returns Transaction ready to be signed
 */
export async function createDirectSOLTransfer(
  from: PublicKey,
  to: PublicKey,
  amount: number,
  connection: Connection,
): Promise<Transaction> {
  // Convert SOL to lamports
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  if (lamports <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Create transfer instruction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports,
    }),
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;

  return transaction;
}

/**
 * Send a direct SOL transfer and wait for confirmation
 * @param transaction Signed transaction
 * @param connection Solana connection
 * @returns Transaction signature
 */
export async function sendDirectSOLTransfer(
  transaction: Transaction,
  connection: Connection,
): Promise<string> {
  // Serialize transaction
  const serialized = transaction.serialize();

  // Send transaction
  const signature = await connection.sendRawTransaction(serialized, {
    skipPreflight: false,
  });

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}

