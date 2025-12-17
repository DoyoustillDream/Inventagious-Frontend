'use client';

import { useState } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useModal } from '@phantom/react-sdk';
import { useDeal } from '@/lib/solana/hooks/useDeal';
import { Deal } from '@/lib/api/deals';
import { projectsApi } from '@/lib/api/projects';

interface DealCardWithIntegrationProps {
  deal: Deal;
  inventorWalletAddress?: string;
  onUpdate?: () => void;
}

export default function DealCardWithIntegration({
  deal,
  inventorWalletAddress,
  onUpdate,
}: DealCardWithIntegrationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { acceptDeal, rejectDeal, cancelDeal, completeDeal, isLoading } =
    useDeal();
  const { publicKey, connected } = usePhantomWallet();
  const { open: openModal } = useModal();

  // Get project to find inventor wallet address
  const [project, setProject] = useState<any>(null);

  const handleAccept = async () => {
    if (!connected) {
      openModal();
      return;
    }

    // For on-chain deals, solanaAddress is required
    // For off-chain deals, we only need inventorWalletAddress and deal amount
    if (deal.isOnChain && !deal.solanaAddress) {
      setError('Deal not initialized on-chain');
      return;
    }
    
    if (!inventorWalletAddress) {
      setError('Inventor wallet address not found');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await acceptDeal(
        deal.id, 
        deal.solanaAddress || undefined, 
        inventorWalletAddress,
        deal.amount, // Pass deal amount for off-chain transfers
      );
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to accept deal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!connected) {
      openModal();
      return;
    }

    if (!deal.solanaAddress) {
      setError('Deal not initialized on-chain');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await rejectDeal(deal.id, deal.solanaAddress);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to reject deal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!connected) {
      openModal();
      return;
    }

    if (!deal.solanaAddress) {
      setError('Deal not initialized on-chain');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await cancelDeal(deal.id, deal.solanaAddress);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel deal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!connected) {
      openModal();
      return;
    }

    if (!deal.solanaAddress) {
      setError('Deal not initialized on-chain');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await completeDeal(deal.id, deal.solanaAddress);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to complete deal');
    } finally {
      setIsProcessing(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="border-4 border-black rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2 text-black">Deal Offer</h3>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-black">
              Amount: <span className="text-green-700">{deal.amount} SOL</span>
            </p>
            <p className="text-sm text-gray-700">
              You receive:{' '}
              <span className="font-semibold text-black">
                {deal.netAmount} SOL
              </span>
            </p>
            <p className="text-xs text-gray-600">
              Platform fee: {deal.platformFee} SOL
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[deal.status]}`}
        >
          {deal.status.toUpperCase()}
        </span>
      </div>

      {deal.message && (
        <div className="mb-4">
          <p className="text-sm text-gray-800">{deal.message}</p>
        </div>
      )}

      {deal.terms && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1 text-black">Terms:</p>
          <p className="text-sm text-gray-800">{deal.terms}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {deal.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              disabled={isProcessing || isLoading || !connected}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {isProcessing || isLoading
                ? 'Processing...'
                : connected
                  ? 'Accept Deal'
                  : 'Connect Wallet'}
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing || isLoading || !connected}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
            >
              {isProcessing || isLoading ? 'Processing...' : 'Reject'}
            </button>
          </>
        )}
        {deal.status === 'pending' && (
          <button
            onClick={handleCancel}
            disabled={isProcessing || isLoading || !connected}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition disabled:opacity-50"
          >
            {isProcessing || isLoading ? 'Processing...' : 'Cancel'}
          </button>
        )}
        {deal.status === 'accepted' && (
          <button
            onClick={handleComplete}
            disabled={isProcessing || isLoading || !connected}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isProcessing || isLoading
              ? 'Processing...'
              : 'Mark as Completed'}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Created: {new Date(deal.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

