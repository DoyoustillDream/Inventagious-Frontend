'use client';

import { useState, useCallback } from 'react';
import { PublicKey, Transaction, VersionedTransaction, Connection } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useTransactionSigning } from './useTransactionSigning';
import { getConnection } from '../connection';
import { getCampaignProgramId, getProgramIds } from '../program-ids';
import {
  initializeCampaignTransaction,
  contributeTransaction,
  getCampaign,
} from '../campaign';
import { projectsApi } from '@/lib/api/projects';
import { normalizeUrl } from '@/lib/utils/url';
import { serializeSignedTransaction } from '../transaction-signing';

/**
 * Hook for campaign operations
 */
export function useCampaign() {
  const { publicKey, connected, wallet } = usePhantomWallet();
  const { signTransaction, serializeTransaction } = useTransactionSigning();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize a campaign on-chain
   */
  const initializeCampaign = useCallback(
    async (
      projectId: string,
      fundingGoal: number,
      deadline: number,
    ): Promise<{ signature: string; campaignPda: string }> => {
      if (!connected || !publicKey || !wallet) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      // Get program ID early so it's available in catch block
      let programId: PublicKey;
      try {
        programId = await getCampaignProgramId();
      } catch (idError) {
        setIsLoading(false);
        throw new Error(`Failed to get program ID: ${idError instanceof Error ? idError.message : 'Unknown error'}`);
      }

      try {
        // Get connection
        const connection = await getConnection();

        // Create Anchor provider from wallet
        // Note: We use the signTransaction from useTransactionSigning hook which is already available
        const anchorWallet = {
          publicKey,
          signTransaction: async (tx: Transaction | VersionedTransaction) => {
            if (!tx) {
              throw new Error('Transaction to sign is undefined');
            }
            // Use optimized signing service with connection for preparation and validation
            return await signTransaction(tx, connection);
          },
          signAllTransactions: wallet.signAllTransactions 
            ? async (txs: (Transaction | VersionedTransaction)[]) => {
                // For batch signing, we'll use the wallet's native method
                // The optimized service can be used if needed, but requires the hook
                if (!wallet.signAllTransactions) {
                  throw new Error('Wallet does not support batch transaction signing');
                }
                return await wallet.signAllTransactions(txs);
              }
            : undefined,
        };

        const provider = new anchor.AnchorProvider(
          connection,
          anchorWallet as any,
          { commitment: 'confirmed' }
        );

        // Create a program instance for the provider
        const program = {
          provider,
        };

        // Build transaction with detailed error handling
        let transaction, campaignPda;
        try {
          const result = await initializeCampaignTransaction(
            publicKey,
            projectId,
            fundingGoal,
            deadline,
            program,
            connection,
          );
          transaction = result.transaction;
          campaignPda = result.campaignPda;
        } catch (buildError: any) {
          console.error('Error in initializeCampaignTransaction:', buildError);
          console.error('Build error stack:', buildError?.stack);
          throw new Error(
            `Failed to build campaign transaction: ${buildError?.message || 'Unknown error'}. ` +
            `Check console for details.`
          );
        }

        if (!transaction) {
          throw new Error('Failed to build transaction: transaction is undefined');
        }

        // Sign transaction using optimized signing service
        // This handles validation, preparation, retry logic, and error handling
        const signedTransaction = await signTransaction(transaction, connection);
        
        // Serialize the signed transaction
        const serialized = serializeTransaction(signedTransaction);
        
        if (!serialized || serialized.length === 0) {
          throw new Error('Serialized transaction is empty');
        }
        
        // Verify program exists before sending transaction
        try {
          const programInfo = await connection.getAccountInfo(programId);
          if (!programInfo) {
            const programIds = await getProgramIds();
            throw new Error(
              `Program ${programId.toBase58()} is not deployed on ${programIds.solanaCluster || 'the current network'}.\n\n` +
              `Please deploy the program to ${programIds.solanaCluster || 'devnet'} first, or switch to a network where it is deployed.\n\n` +
              `Network: ${programIds.solanaCluster || 'devnet'}\n` +
              `RPC URL: ${programIds.solanaRpcUrl || 'https://api.devnet.solana.com'}`
            );
          }
        } catch (programCheckError: any) {
          // If it's our custom error, throw it
          if (programCheckError.message?.includes('not deployed')) {
            throw programCheckError;
          }
          // Otherwise, log and continue (might be network issue)
          console.warn('Could not verify program existence:', programCheckError);
        }
        
        const signature = await connection.sendRawTransaction(
          serialized,
          { skipPreflight: false }
        );

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with wallet address
        await projectsApi.publish(projectId, publicKey.toBase58());

        return {
          signature,
          campaignPda: campaignPda.toBase58(),
        };
      } catch (err: any) {
        // Log detailed error information
        console.error('Error in initializeCampaign:', err);
        console.error('Error stack:', err?.stack);
        console.error('Error name:', err?.name);
        console.error('Error message:', err?.message);
        
        // Check for program deployment error
        if (err?.message?.includes('program that does not exist') || 
            err?.message?.includes('not deployed') ||
            err?.message?.includes('Attempt to load a program')) {
          const programIds = await getProgramIds().catch(() => null);
          const network = programIds?.solanaCluster || 'devnet';
          const rpcUrl = programIds?.solanaRpcUrl || 'https://api.devnet.solana.com';
          
          const errorMessage = 
            `Solana program is not deployed on ${network}.\n\n` +
            `Program ID: ${programId.toBase58()}\n` +
            `Network: ${network}\n` +
            `RPC URL: ${rpcUrl}\n\n` +
            `Please deploy the program to ${network} before creating campaigns.\n\n` +
            `To deploy:\n` +
            `1. Navigate to the 'sc' directory\n` +
            `2. Run: anchor build\n` +
            `3. Run: anchor deploy --provider.cluster ${network}`;
          
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        
        // Check if it's the specific .size error
        if (err?.message?.includes('size') || err?.stack?.includes('size')) {
          console.error('This appears to be a serialization error. The transaction may not be properly initialized.');
          console.error('This could be due to:');
          console.error('1. IDL structure mismatch');
          console.error('2. Account names not matching IDL');
          console.error('3. Instruction data format issues');
          console.error('4. Transaction not fully built');
        }
        
        const errorMessage =
          err.message || 'Failed to initialize campaign on-chain';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, connected, wallet, signTransaction],
  );

  /**
   * Contribute to a campaign
   * Supports both on-chain smart contract and off-chain direct SOL/USDC transfers
   */
  const contribute = useCallback(
    async (
      projectId: string,
      campaignPda: string | undefined,
      amount: number,
      isOnChain: boolean = false,
      paymentMethod: 'SOL' | 'USDC' = 'SOL',
    ): Promise<string> => {
      if (!connected || !publicKey || !wallet) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check if project uses on-chain smart contracts
        // Only try on-chain if explicitly marked as on-chain AND campaignPda is provided
        const useOnChain = isOnChain && campaignPda && campaignPda.length > 0;

        if (useOnChain) {
          // Only get connection for on-chain operations
          const connection = await getConnection();
          // On-chain smart contract flow (existing logic)
          try {
            const campaignPubkey = new PublicKey(campaignPda);
            const programId = await getCampaignProgramId();

            const anchorWallet = {
              publicKey,
              signTransaction: async (tx: Transaction | VersionedTransaction) => {
                return await signTransaction(tx);
              },
              signAllTransactions: wallet.signAllTransactions 
                ? async (txs: (Transaction | VersionedTransaction)[]) => {
                    return await wallet.signAllTransactions!(txs);
                  }
                : undefined,
            };

            const provider = new anchor.AnchorProvider(
              connection,
              anchorWallet as any,
              { commitment: 'confirmed' }
            );

            const program = { provider };

            const transaction = await contributeTransaction(
              publicKey,
              campaignPubkey,
              amount,
              program,
              connection,
            );

            const { blockhash } = await connection.getLatestBlockhash('confirmed');
            
            if (transaction instanceof Transaction) {
              transaction.recentBlockhash = blockhash;
              transaction.feePayer = publicKey;
            }

            // Use optimized signing service
            const signedTransaction = await signTransaction(transaction, connection);
            const serialized = serializeTransaction(signedTransaction);
            
            const signature = await connection.sendRawTransaction(
              serialized,
              { skipPreflight: false }
            );

            await connection.confirmTransaction(signature, 'confirmed');

            await projectsApi.contribute(
              projectId,
              amount,
              publicKey.toBase58(),
              signature,
            );

            return signature;
          } catch (onChainError: any) {
            // If on-chain fails, fall back to direct transfer
            console.warn('On-chain contribution failed, falling back to direct transfer:', onChainError);
            // Continue to direct transfer flow below
          }
        }

        // Off-chain: Direct SOL or USDC transfer flow
        // Get campaign wallet address from backend (unique wallet for this campaign)
        // REQUIRED: Campaign must have its own wallet (no fallback to platform wallet)
        let recipientWallet: string;
        try {
          const campaignWalletUrl = normalizeUrl('/api/solana/campaign-wallet', `/${projectId}`);
          const campaignWalletResponse = await fetch(campaignWalletUrl);
          if (!campaignWalletResponse.ok) {
            throw new Error('Campaign wallet not found. Campaign must be published before contributions can be made.');
          }
          const data = await campaignWalletResponse.json();
          recipientWallet = data.walletAddress;
        } catch (error: any) {
          throw new Error(`Failed to get campaign wallet: ${error?.message || 'Unknown error'}`);
        }

        // Get connection for off-chain transfer (still needs Solana RPC for transactions)
        // Use fallback to public RPC if backend RPC is unavailable
        let connection: Connection;
        try {
          // Try to get connection from backend config
          const programIds = await getProgramIds();
          
          // Try backend RPC first
          const backendRpc = programIds.solanaRpcUrl;
          connection = new Connection(backendRpc, { commitment: 'confirmed' });
          
          // Test the connection by getting blockhash (with timeout)
          const testConnection = Promise.race([
            connection.getLatestBlockhash('confirmed'),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 5000)
            ),
          ]);
          
          await testConnection;
        } catch (rpcError: any) {
          // If backend RPC fails, use public fallback from .env
          console.warn('Backend RPC unavailable, using .env fallback:', rpcError);
          const fallbackRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
          if (!fallbackRpc) {
            throw new Error('SOLANA_RPC_URL must be configured. Set NEXT_PUBLIC_SOLANA_RPC_URL in .env file.');
          }
          connection = new Connection(fallbackRpc, { commitment: 'confirmed' });
        }

        let transaction: Transaction;
        
        if (paymentMethod === 'USDC') {
          // Import USDC transfer utilities
          const { createUSDCTransfer } = await import('../usdc-transfer');
          
          // Create USDC token transfer transaction
          transaction = await createUSDCTransfer(
            publicKey,
            new PublicKey(recipientWallet),
            amount, // Amount in USDC
            connection,
          );
        } else {
          // Import direct transfer utilities
          const { createDirectSOLTransfer } = await import('../direct-transfer');

          // Create direct SOL transfer transaction
          transaction = await createDirectSOLTransfer(
            publicKey,
            new PublicKey(recipientWallet),
            amount, // Amount in SOL
            connection,
          );
        }

        // Sign transaction using optimized signing service
        const signedTransaction = await signTransaction(transaction, connection);
        
        // Serialize the signed transaction
        const serialized = serializeTransaction(signedTransaction);
        const signature = await connection.sendRawTransaction(serialized, {
          skipPreflight: false,
        });
        await connection.confirmTransaction(signature, 'confirmed');

        // Notify backend with signature, wallet address, and payment method
        await projectsApi.contribute(
          projectId,
          amount,
          publicKey.toBase58(),
          signature,
          paymentMethod === 'USDC' ? 'solana_usdc' : 'solana_direct',
        );

        return signature;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to contribute';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, connected, wallet, signTransaction],
  );

  /**
   * Fetch campaign data from chain
   */
  const fetchCampaign = useCallback(
    async (campaignPda: string): Promise<any> => {
      try {
        const campaignPubkey = new PublicKey(campaignPda);
        const connection = await getConnection();
        
        // Get program ID
        const programId = await getCampaignProgramId();

        // Create a minimal program instance for fetching
        const anchorWallet = {
          publicKey: PublicKey.default,
          signTransaction: async (tx: Transaction | VersionedTransaction) => tx,
          signAllTransactions: undefined,
        };

        const provider = new anchor.AnchorProvider(
          connection,
          anchorWallet as any,
          { commitment: 'confirmed' }
        );

        const program = {
          provider,
        };

        return await getCampaign(campaignPubkey, connection, program);
      } catch (err: any) {
        throw new Error(err.message || 'Failed to fetch campaign');
      }
    },
    [],
  );

  return {
    initializeCampaign,
    contribute,
    fetchCampaign,
    isLoading,
    error,
  };
}

