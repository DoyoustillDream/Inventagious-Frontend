'use client';

import { useState, useEffect } from 'react';
import { usdToSol } from '@/lib/solana/price';
import { useToast } from '@/components/shared/Toast';

interface DonateButtonProps {
  projectId: string;
  onDonate: (amount: number) => Promise<void>;
}

export default function DonateButton({ projectId, onDonate }: DonateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [usdAmount, setUsdAmount] = useState('');
  const [solAmount, setSolAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const { showWarning, showSuccess, showError } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (solAmount <= 0 || priceError) {
      showWarning('Please enter a valid USD amount');
      return;
    }

    setIsSubmitting(true);

    try {
      await onDonate(solAmount);
      setUsdAmount('');
      setSolAmount(0);
      showSuccess('Donation successful!');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error donating:', error);
      showError(error?.message || 'Failed to donate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformFee = solAmount * 0.019; // 1.9% flat rate
  const netAmount = solAmount - platformFee;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hand-drawn rounded-lg border-4 border-black bg-purple-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-purple-700"
      >
        Donate
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-black">Donate to Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                Donation Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                required
                disabled={isLoadingPrice}
                className="w-full border-4 border-black rounded-lg px-4 py-2 text-black"
              />
              {isLoadingPrice && (
                <p className="mt-2 text-xs text-gray-500">Converting to SOL...</p>
              )}
              {!isLoadingPrice && solAmount > 0 && (
                <p className="mt-2 text-xs text-gray-700">
                  ≈ {solAmount.toFixed(4)} SOL
                </p>
              )}
              {priceError && (
                <p className="mt-2 text-xs text-red-600">{priceError}</p>
              )}
              {solAmount > 0 && (
                <div className="mt-2 text-sm space-y-1">
                  <p className="text-gray-700">
                    Platform fee (1.9%): <span className="font-semibold text-black">{platformFee.toFixed(4)} SOL</span>
                  </p>
                  <p className="text-green-700 font-semibold">
                    Project receives: {netAmount.toFixed(4)} SOL
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingPrice || solAmount <= 0 || !!priceError}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Donate'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setUsdAmount('');
                  setSolAmount(0);
                }}
                className="flex-1 bg-gray-200 text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

