'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { usdToSol, solToUsd } from '@/lib/solana/price';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/shared/Toast';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { useProject } from '@/hooks/useProject';

interface ContributeModalProps {
  projectId: string;
  campaignPda?: string; // Optional - for backward compatibility with on-chain projects
  fundingGoal: number;
  amountRaised: number;
  status: string;
  isOnChain?: boolean; // Whether project uses on-chain smart contracts
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOptimisticUpdate?: (amount: number, feePercentage: number) => void;
}

export default function ContributeModal({
  projectId,
  campaignPda,
  fundingGoal,
  amountRaised,
  status,
  isOnChain = false,
  isOpen,
  onClose,
  onSuccess,
  onOptimisticUpdate,
}: ContributeModalProps) {
  // Use real-time project data for this modal
  const { project: realTimeProject } = useProject(projectId, {
    pollInterval: 2000, // Poll every 2 seconds
    enablePolling: isOpen, // Only poll when modal is open
  });

  // Use real-time data if available, otherwise use props
  const currentAmountRaised = realTimeProject?.amountRaised ?? amountRaised;
  const currentStatus = realTimeProject?.status ?? status;
  const currentFundingGoal = realTimeProject?.fundingGoal ?? fundingGoal;
  const [inputCurrency, setInputCurrency] = useState<'USD' | 'SOL'>('USD');
  const [inputAmount, setInputAmount] = useState('');
  const [solAmount, setSolAmount] = useState<number>(0);
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const { contribute, isLoading, error } = useCampaign();
  const { connected, publicKey, isLoading: walletLoading } = useWallet();
  const { showError, showWarning, showSuccess } = useToast();
  const { settings: paymentSettings, isLoading: isLoadingPaymentSettings } = usePaymentSettings();
  const isSubmittingRef = useRef(false); // Guard to prevent multiple simultaneous submissions

  // Convert between USD and SOL when input amount changes
  useEffect(() => {
    const convertAmount = async () => {
      const amount = parseFloat(inputAmount);
      if (isNaN(amount) || amount <= 0) {
        setSolAmount(0);
        setUsdAmount(0);
        return;
      }

      setIsLoadingPrice(true);
      setPriceError(null);
      try {
        if (inputCurrency === 'USD') {
          // Input is USD, convert to SOL
          const sol = await usdToSol(amount);
          setSolAmount(sol);
          setUsdAmount(amount);
        } else {
          // Input is SOL, convert to USD
          const usd = await solToUsd(amount);
          setSolAmount(amount);
          setUsdAmount(usd);
        }
      } catch (error: any) {
        setPriceError(error.message || `Failed to convert ${inputCurrency}`);
        setSolAmount(0);
        setUsdAmount(0);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    convertAmount();
  }, [inputAmount, inputCurrency]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    // Check if campaign has reached its goal
    if (status === 'funded' || amountRaised >= fundingGoal) {
      showError('This campaign has already reached its funding goal. Contributions are no longer accepted.');
      return;
    }

    if (!connected) {
      showWarning('Please connect your wallet to contribute');
      return;
    }

    // For on-chain projects, campaignPda is required
    if (isOnChain && !campaignPda) {
      showError('Campaign not initialized on-chain yet');
      return;
    }

    if (solAmount <= 0 || priceError) {
      showWarning(`Please enter a valid ${inputCurrency === 'USD' ? 'USD' : 'SOL'} amount`);
      return;
    }

    const minContribution = paymentSettings?.minContributionAmountSol ?? 0.1;
    if (solAmount < minContribution) {
      showWarning(`Minimum contribution is ${minContribution} SOL`);
      return;
    }

    // Validate that contribution won't exceed funding goal
    const feePercentage = paymentSettings?.feePercentage ?? 0.019;
    const netAmount = solAmount * (1 - feePercentage);
    const newAmountRaised = amountRaised + netAmount;
    
    // Allow small tolerance for rounding (0.00001 SOL) to allow exact goal completion
    const roundingTolerance = 0.00001;

    if (newAmountRaised > fundingGoal + roundingTolerance) {
      const remainingToGoal = fundingGoal - amountRaised;
      const maxAllowedGross = remainingToGoal / (1 - feePercentage);
      showError(
        `This contribution would exceed the funding goal. ` +
        `Maximum contribution allowed: ${maxAllowedGross.toFixed(4)} SOL ` +
        `(would result in ${fundingGoal.toFixed(4)} SOL total after fees).`
      );
      return;
    }
    
    // If contribution would result in exactly reaching the goal (within tolerance), allow it
    // This handles the case where remaining is very small and fees prevent exact completion

    // Set submitting flag
    isSubmittingRef.current = true;

    try {
      await contribute(projectId, campaignPda || undefined, solAmount, isOnChain);
      setInputAmount('');
      setSolAmount(0);
      setUsdAmount(0);
      showSuccess('Contribution successful!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Contribution failed:', err);
      showError(err.message || 'Failed to contribute');
    } finally {
      // Always reset the flag, even on error
      isSubmittingRef.current = false;
    }
  };

  const feePercentage = paymentSettings?.feePercentage ?? 0.019;
  const platformFee = solAmount * feePercentage;
  const netAmount = solAmount - platformFee;
  const feePercentageDisplay = (feePercentage * 100).toFixed(1);
  const isFunded = status === 'funded' || amountRaised >= fundingGoal;
  const remainingToGoal = Math.max(0, fundingGoal - amountRaised);
  
  // Calculate gross amount needed to reach exactly 100% (accounting for fees)
  // If remaining is 0.0001 SOL net, we need: 0.0001 / (1 - 0.019) = 0.0001019 SOL gross
  const grossAmountNeededToComplete = remainingToGoal > 0 
    ? remainingToGoal / (1 - feePercentage)
    : 0;

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
          {/* Funding Goal Status */}
          {isFunded ? (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-600 rounded-lg text-center">
              <div className="text-2xl mb-2 font-bold text-green-700">✓</div>
              <div className="hand-drawn text-base font-bold text-green-800 mb-1">
                Funding Goal Reached!
              </div>
              <div className="text-sm text-green-700">
                This campaign has reached its goal of {fundingGoal.toFixed(4)} SOL.
                Contributions are no longer accepted.
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-500 rounded-lg text-sm">
              <div className="font-semibold text-blue-800 mb-1">Funding Progress</div>
              <div className="text-blue-700">
                <span className="font-bold">{amountRaised.toFixed(4)} SOL</span> raised of{' '}
                <span className="font-bold">{fundingGoal.toFixed(4)} SOL</span> goal
              </div>
              <div className="text-blue-600 mt-1">
                {remainingToGoal > 0 ? (
                  <>
                    <div>
                      Net remaining: <span className="font-bold">{remainingToGoal.toFixed(4)} SOL</span>
                    </div>
                    {grossAmountNeededToComplete > remainingToGoal && (
                      <div className="text-xs mt-1 text-blue-500">
                        Contribute <span className="font-bold">{grossAmountNeededToComplete.toFixed(4)} SOL</span> to reach 100%
                      </div>
                    )}
                  </>
                ) : (
                  <>Goal reached!</>
                )}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-black">
                  Amount
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputCurrency('USD');
                      setInputAmount('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition ${
                      inputCurrency === 'USD'
                        ? 'bg-yellow-400 border-black text-black'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-black'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputCurrency('SOL');
                      setInputAmount('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition ${
                      inputCurrency === 'SOL'
                        ? 'bg-yellow-400 border-black text-black'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-black'
                    }`}
                  >
                    SOL
                  </button>
                </div>
              </div>
              <div className="relative">
                {inputCurrency === 'USD' ? (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-semibold">
                    $
                  </span>
                ) : (
                  <img
                    src="/svg/solanaLogoMark.svg"
                    alt="SOL"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-auto"
                    style={{ objectFit: 'contain' }}
                  />
                )}
                <input
                  type="number"
                  step={inputCurrency === 'USD' ? '0.01' : '0.0001'}
                  min={inputCurrency === 'USD' ? '0.01' : '0.0001'}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className={`w-full pr-4 py-2 border-2 border-black rounded-lg hand-drawn text-black bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    inputCurrency === 'USD' ? 'pl-8' : 'pl-10'
                  }`}
                  placeholder="0.00"
                  required
                  disabled={isLoading || isLoadingPrice}
                />
                {grossAmountNeededToComplete > 0 && grossAmountNeededToComplete < 1 && !isFunded && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (inputCurrency === 'SOL') {
                        setInputAmount(grossAmountNeededToComplete.toFixed(4));
                      } else {
                        // Convert to USD if needed
                        try {
                          const usd = await solToUsd(grossAmountNeededToComplete);
                          setInputAmount(usd.toFixed(2));
                        } catch (error) {
                          console.error('Failed to convert SOL to USD:', error);
                          // Fallback to SOL amount if conversion fails
                          setInputCurrency('SOL');
                          setInputAmount(grossAmountNeededToComplete.toFixed(4));
                        }
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 bg-yellow-400 border-2 border-black rounded hover:bg-yellow-500 transition"
                    title="Fill exact amount to reach 100%"
                  >
                    Fill to 100%
                  </button>
                )}
              </div>
              {isLoadingPrice && (
                <p className="mt-2 text-xs text-gray-700">Converting...</p>
              )}
              {!isLoadingPrice && inputAmount && solAmount > 0 && (
                <p className="mt-2 text-xs text-gray-800">
                  {inputCurrency === 'USD' ? (
                    <>≈ {solAmount.toFixed(4)} SOL</>
                  ) : (
                    <>≈ ${usdAmount.toFixed(2)} USD</>
                  )}
                </p>
              )}
              {priceError && (
                <p className="mt-2 text-xs text-red-600">{priceError}</p>
              )}
            </div>

            {solAmount > 0 && (
              <div className="mb-4 p-4 bg-gray-50 border-2 border-black rounded-lg">
                <div className="space-y-2 text-sm text-black">
                  <div className="flex justify-between">
                    <span className="font-semibold text-black">Contribution:</span>
                    <span className="text-black">{solAmount.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span>Platform Fee ({feePercentageDisplay}%):</span>
                    <span>-{platformFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between font-bold border-t-2 border-black pt-2 text-black">
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

            {!walletLoading && !connected && (
              <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg text-sm text-yellow-700">
                Please connect your wallet to contribute
              </div>
            )}
            {walletLoading && (
              <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-500 rounded-lg text-sm text-blue-700">
                Checking wallet connection...
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
                disabled={isLoading || isLoadingPrice || !connected || solAmount <= 0 || !!priceError || isFunded}
              >
                {isLoading ? 'Processing...' : isFunded ? 'Goal Reached' : 'Contribute'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

