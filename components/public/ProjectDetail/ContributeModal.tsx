'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { usdToSol, solToUsd } from '@/lib/solana/price';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/shared/Toast';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { useProject } from '@/hooks/useProject';
import { clearDonationsCache } from '@/hooks/useDonations';

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

    // Check if campaign has reached its goal (use real-time data)
    if (currentStatus === 'funded' || currentAmountRaised >= currentFundingGoal) {
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

    // Validate that contribution won't exceed funding goal (use real-time data)
    const feePercentage = paymentSettings?.feePercentage ?? 0.019;
    const netAmount = solAmount * (1 - feePercentage);
    const newAmountRaised = currentAmountRaised + netAmount;
    
    // Allow small tolerance for rounding (0.00001 SOL) to allow exact goal completion
    const roundingTolerance = 0.00001;

    if (newAmountRaised > currentFundingGoal + roundingTolerance) {
      const remainingToGoal = currentFundingGoal - currentAmountRaised;
      const maxAllowedGross = remainingToGoal / (1 - feePercentage);
      showError(
        `This contribution would exceed the funding goal. ` +
        `Maximum contribution allowed: ${maxAllowedGross.toFixed(4)} SOL ` +
        `(would result in ${currentFundingGoal.toFixed(4)} SOL total after fees).`
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
      // Clear donations cache to force refresh
      clearDonationsCache(projectId);
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
  const isFunded = currentStatus === 'funded' || currentAmountRaised >= currentFundingGoal;
  const remainingToGoal = Math.max(0, currentFundingGoal - currentAmountRaised);
  
  // Calculate gross amount needed to reach exactly 100% (accounting for fees)
  // If remaining is 0.0001 SOL net, we need: 0.0001 / (1 - 0.019) = 0.0001019 SOL gross
  // We need to ensure the calculated amount, when rounded to 4 decimals, won't exceed the goal
  const grossAmountNeededToCompleteRaw = remainingToGoal > 0 
    ? remainingToGoal / (1 - feePercentage)
    : 0;
  
  // Round down to 4 decimal places to ensure we don't exceed the goal due to rounding
  // This prevents the "would exceed funding goal" error
  // The backend has a tolerance of 0.00001 SOL, so rounding down slightly is safe
  const grossAmountNeededToComplete = grossAmountNeededToCompleteRaw > 0
    ? Math.floor(grossAmountNeededToCompleteRaw * 10000) / 10000
    : 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="browser-window max-w-md w-full shadow-2xl">
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
            className="text-gray-500 hover:text-black text-xl font-bold transition-colors hover:bg-gray-200 rounded px-1 py-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 bg-white">
          {/* Funding Goal Status */}
          {isFunded ? (
            <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-green-100 border-3 border-green-600 rounded-xl text-center shadow-sm">
              <div className="text-3xl mb-3 font-bold text-green-700">✓</div>
              <div className="hand-drawn text-lg font-bold text-green-800 mb-2">
                Funding Goal Reached!
              </div>
              <div className="text-sm text-green-700 leading-relaxed">
                This campaign has reached its goal of <span className="font-bold">{currentFundingGoal.toFixed(4)} SOL</span>.
                Contributions are no longer accepted.
              </div>
            </div>
          ) : (
            <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-3 border-blue-600 rounded-xl shadow-sm">
              <div className="font-bold text-blue-900 mb-3 text-base">Funding Progress</div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-blue-800">
                    {((currentAmountRaised / currentFundingGoal) * 100).toFixed(1)}% Complete
                  </span>
                  <span className="text-xs text-blue-600">
                    {currentAmountRaised.toFixed(4)} / {currentFundingGoal.toFixed(4)} SOL
                  </span>
                </div>
                <div className="w-full h-4 bg-blue-200 border-2 border-blue-400 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min((currentAmountRaised / currentFundingGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Remaining Amount */}
              {remainingToGoal > 0 ? (
                <div className="bg-white/60 border-2 border-blue-300 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-800">Still Needed:</span>
                    <span className="font-bold text-base text-blue-900">{remainingToGoal.toFixed(4)} SOL</span>
                  </div>
                  {grossAmountNeededToComplete > remainingToGoal && (
                    <div className="pt-2 border-t-2 border-blue-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-blue-700">To complete (including fees):</span>
                        <span className="text-sm font-bold text-blue-900">{grossAmountNeededToComplete.toFixed(4)} SOL</span>
                      </div>
                      <div className="text-xs text-blue-600 italic">
                        This amount includes the platform fee
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center font-bold text-blue-800 py-2">
                  Goal reached! 🎉
                </div>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-base font-bold text-black hand-drawn">
                  Amount
                </label>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border-2 border-gray-300">
                  <button
                    type="button"
                    onClick={() => {
                      setInputCurrency('USD');
                      setInputAmount('');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md border-2 transition-all duration-200 ${
                      inputCurrency === 'USD'
                        ? 'bg-yellow-400 border-black text-black shadow-sm'
                        : 'bg-white border-transparent text-gray-600 hover:border-gray-400 hover:text-black'
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
                    className={`px-3 py-1.5 text-xs font-bold rounded-md border-2 transition-all duration-200 ${
                      inputCurrency === 'SOL'
                        ? 'bg-yellow-400 border-black text-black shadow-sm'
                        : 'bg-white border-transparent text-gray-600 hover:border-gray-400 hover:text-black'
                    }`}
                  >
                    SOL
                  </button>
                </div>
              </div>
              <div className="relative">
                {inputCurrency === 'USD' ? (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold text-lg">
                    $
                  </span>
                ) : (
                  <img
                    src="/svg/solanaLogoMark.svg"
                    alt="SOL"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-auto z-10"
                    style={{ objectFit: 'contain' }}
                  />
                )}
                <input
                  type="number"
                  step={inputCurrency === 'USD' ? '0.01' : '0.0001'}
                  min={inputCurrency === 'USD' ? '0.01' : '0.0001'}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className={`w-full pr-24 py-3 text-lg border-3 border-black rounded-xl hand-drawn text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    inputCurrency === 'USD' ? 'pl-10' : 'pl-12'
                  } ${isLoading || isLoadingPrice ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold px-3 py-1.5 bg-yellow-400 border-2 border-black rounded-lg hover:bg-yellow-500 hover:shadow-sm transition-all duration-200 active:scale-95"
                    title="Fill exact amount to reach 100%"
                  >
                    Fill to 100%
                  </button>
                )}
              </div>
              {isLoadingPrice && (
                <p className="mt-2 text-xs text-gray-600 font-medium">Converting...</p>
              )}
              {!isLoadingPrice && inputAmount && solAmount > 0 && (
                <p className="mt-2 text-sm text-gray-700 font-semibold">
                  {inputCurrency === 'USD' ? (
                    <>≈ {solAmount.toFixed(4)} SOL</>
                  ) : (
                    <>≈ ${usdAmount.toFixed(2)} USD</>
                  )}
                </p>
              )}
              {priceError && (
                <p className="mt-2 text-xs text-red-600 font-semibold">{priceError}</p>
              )}
            </div>

            {solAmount > 0 && (
              <div className="mb-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 border-3 border-black rounded-xl shadow-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Contribution:</span>
                    <span className="text-black font-bold text-base">{solAmount.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Platform Fee ({feePercentageDisplay}%):</span>
                    <span className="font-semibold">-{platformFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t-3 border-black pt-3 text-black">
                    <span className="text-base">Net Amount:</span>
                    <span className="text-lg">{netAmount.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border-3 border-red-600 rounded-xl text-sm text-red-800 font-semibold shadow-sm">
                {error}
              </div>
            )}

            {!walletLoading && !connected && (
              <div className="p-4 bg-yellow-50 border-3 border-yellow-600 rounded-xl text-sm text-yellow-800 font-semibold shadow-sm">
                Please connect your wallet to contribute
              </div>
            )}
            {walletLoading && (
              <div className="p-4 bg-blue-50 border-3 border-blue-600 rounded-xl text-sm text-blue-800 font-semibold shadow-sm">
                Checking wallet connection...
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 hand-drawn rounded-xl border-3 border-black bg-white px-6 py-3.5 text-base font-bold text-black transition-all duration-200 hover:bg-gray-100 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 hand-drawn rounded-xl border-3 border-black bg-yellow-400 px-6 py-3.5 text-base font-bold text-black transition-all duration-200 hover:bg-yellow-500 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

