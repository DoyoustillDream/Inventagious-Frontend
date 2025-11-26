'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { usdToSol } from '@/lib/solana/price';

interface ContributeModalProps {
  projectId: string;
  campaignPda?: string;
  fundingGoal: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ContributeModal({
  projectId,
  campaignPda,
  fundingGoal,
  isOpen,
  onClose,
  onSuccess,
}: ContributeModalProps) {
  const [usdAmount, setUsdAmount] = useState('');
  const [solAmount, setSolAmount] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const { contribute, isLoading, error } = useCampaign();
  const connected = false; // No SDK - always false

  // Convert USD to SOL when USD amount changes
  useEffect(() => {
    const convertUsdToSol = async () => {
      const usd = parseFloat(usdAmount);
      if (isNaN(usd) || usd <= 0) {
        setSolAmount(0);
        return;
      }

      setIsLoadingPrice(true);
      setPriceError(null);
      try {
        const sol = await usdToSol(usd);
        setSolAmount(sol);
      } catch (error: any) {
        setPriceError(error.message || 'Failed to convert USD to SOL');
        setSolAmount(0);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    convertUsdToSol();
  }, [usdAmount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect your wallet to contribute');
      return;
    }

    if (!campaignPda) {
      alert('Campaign not initialized on-chain yet');
      return;
    }

    if (solAmount <= 0 || priceError) {
      alert('Please enter a valid USD amount');
      return;
    }

    if (solAmount < 0.1) {
      alert('Minimum contribution is 0.1 SOL');
      return;
    }

    try {
      await contribute(projectId, campaignPda, solAmount);
      setUsdAmount('');
      setSolAmount(0);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Contribution failed:', err);
      alert(err.message || 'Failed to contribute');
    }
  };

  const platformFee = solAmount * 0.019; // 1.9% flat rate
  const netAmount = solAmount - platformFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="browser-window max-w-md w-full mx-4">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Contribute</h2>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-black mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-lg hand-drawn"
                placeholder="0.00"
                required
                disabled={isLoading || isLoadingPrice}
              />
              {isLoadingPrice && (
                <p className="mt-2 text-xs text-gray-700">Converting to SOL...</p>
              )}
              {!isLoadingPrice && solAmount > 0 && (
                <p className="mt-2 text-xs text-gray-800">
                  ≈ {solAmount.toFixed(4)} SOL
                </p>
              )}
              {priceError && (
                <p className="mt-2 text-xs text-red-600">{priceError}</p>
              )}
            </div>

            {solAmount > 0 && (
              <div className="mb-4 p-4 bg-gray-50 border-2 border-black rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Contribution:</span>
                    <span>{solAmount.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span>Platform Fee (1.9%):</span>
                    <span>-{platformFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between font-bold border-t-2 border-black pt-2">
                    <span>Net Amount:</span>
                    <span>{netAmount.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {!connected && (
              <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg text-sm text-yellow-700">
                Please connect your wallet to contribute
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 hand-drawn rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-600 disabled:opacity-50"
                disabled={isLoading || isLoadingPrice || !connected || solAmount <= 0 || !!priceError}
              >
                {isLoading ? 'Processing...' : 'Contribute'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

