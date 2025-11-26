'use client';

import { useState, useEffect, useRef } from 'react';
import { CreateProjectData } from '@/lib/api/projects';
import DatePicker from '@/components/shared/DatePicker';
import { usdToSol, getSolanaPrice } from '@/lib/solana/price';
import { solanaApi } from '@/lib/api/solana';

interface ProjectFundingInfoProps {
  fundingGoal: number;
  deadline: string;
  solanaAddress: string;
  isPublic: boolean;
  onUpdate: <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => void;
}

export default function ProjectFundingInfo({
  fundingGoal,
  deadline,
  solanaAddress,
  isPublic,
  onUpdate,
}: ProjectFundingInfoProps) {
  const [usdAmount, setUsdAmount] = useState<string>(fundingGoal > 0 ? fundingGoal.toString() : '');
  const [solAmount, setSolAmount] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [minFundingGoalUsd, setMinFundingGoalUsd] = useState<number>(5000);
  const [maxFundingGoalUsd, setMaxFundingGoalUsd] = useState<number>(100000);
  const [maxDeadlineDays, setMaxDeadlineDays] = useState<number>(30);
  
  // Use ref to store the latest onUpdate callback to avoid dependency issues
  const onUpdateRef = useRef(onUpdate);
  const lastUsdAmountRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch funding goal limits and max deadline from backend
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const limits = await solanaApi.getFundingGoalLimits();
        setMinFundingGoalUsd(limits.minUsd);
        setMaxFundingGoalUsd(limits.maxUsd);
        setMaxDeadlineDays(limits.maxDeadlineDays);
      } catch (error) {
        console.warn('Failed to fetch funding goal limits, using defaults:', error);
      }
    };
    fetchLimits();
  }, []);

  // Keep ref updated with latest callback
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Convert USD to SOL when USD amount changes (with debouncing)
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the conversion to avoid too frequent API calls
    debounceTimerRef.current = setTimeout(async () => {
      const usd = parseFloat(usdAmount);
      if (isNaN(usd) || usd <= 0) {
        setSolAmount(0);
        setValidationError(null);
        if (lastUsdAmountRef.current !== 0) {
          lastUsdAmountRef.current = 0;
          onUpdateRef.current('fundingGoal', 0);
        }
        return;
      }

      // Validate USD limits
      if (usd < minFundingGoalUsd) {
        setValidationError(`Minimum funding goal is $${minFundingGoalUsd.toLocaleString()} USD`);
        setSolAmount(0);
        return;
      }

      if (usd > maxFundingGoalUsd) {
        setValidationError(`Maximum funding goal is $${maxFundingGoalUsd.toLocaleString()} USD`);
        setSolAmount(0);
        return;
      }

      setValidationError(null);
      setIsLoadingPrice(true);
      setPriceError(null);
      try {
        const sol = await usdToSol(usd);
        setSolAmount(sol);
        
        // Only update if the value actually changed (prevent infinite loops)
        if (Math.abs(usd - lastUsdAmountRef.current) > 0.01) {
          lastUsdAmountRef.current = usd;
          // Store USD amount in fundingGoal (backend will convert to SOL)
          onUpdateRef.current('fundingGoal', usd);
        }
      } catch (error: any) {
        setPriceError(error.message || 'Failed to convert USD to SOL');
        setSolAmount(0);
      } finally {
        setIsLoadingPrice(false);
      }
    }, 500); // 500ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [usdAmount]); // Only depend on usdAmount, not onUpdate

  return (
    <div className="space-y-6">
          <div>
            <label className="hand-drawn block text-base font-bold mb-3 text-black">
              Funding Goal ($) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min={minFundingGoalUsd}
              max={maxFundingGoalUsd}
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              required
              placeholder="0.00"
              className={`hand-drawn w-full border-4 px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 ${
                validationError ? 'border-red-500 bg-red-50' : 'border-black bg-white'
              }`}
            />
            {validationError && (
              <p className="hand-drawn mt-2 text-sm font-semibold text-red-600">
                {validationError}
              </p>
            )}
            {isLoadingPrice && !validationError && (
              <p className="hand-drawn mt-2 text-sm font-semibold text-gray-500">
                Converting to SOL...
              </p>
            )}
            {!isLoadingPrice && solAmount > 0 && !validationError && (
              <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
                ≈ {solAmount.toFixed(4)} SOL
              </p>
            )}
            {priceError && (
              <p className="hand-drawn mt-2 text-sm font-semibold text-red-600">
                {priceError}
              </p>
            )}
            <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
              The amount you need to raise for your project (in USD)
            </p>
            <p className="hand-drawn mt-1 text-xs font-semibold text-gray-600">
              Minimum: ${minFundingGoalUsd.toLocaleString()} USD • Maximum: ${maxFundingGoalUsd.toLocaleString()} USD
            </p>
          </div>

          <div>
            <label className="hand-drawn block text-base font-bold mb-3 text-black">
              Deadline (Optional)
            </label>
            <DatePicker
              value={deadline || ''}
              onChange={(date) => {
                if (date) {
                  // Validate deadline is not more than maxDeadlineDays from now
                  const selectedDate = new Date(date);
                  const now = new Date();
                  const maxDate = new Date();
                  maxDate.setDate(maxDate.getDate() + maxDeadlineDays);
                  
                  if (selectedDate <= now) {
                    setValidationError('Deadline must be in the future');
                    return;
                  }
                  
                  if (selectedDate > maxDate) {
                    setValidationError(`Deadline cannot be more than ${maxDeadlineDays} days from now`);
                    return;
                  }
                  setValidationError(null);
                } else {
                  setValidationError(null);
                }
                onUpdate('deadline', date);
              }}
              minDate={new Date().toISOString().split('T')[0]}
              placeholder={`Select deadline date (max ${maxDeadlineDays} days from now)`}
            />
            <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
              When should your funding campaign end? Maximum duration is {maxDeadlineDays} days from today.
            </p>
          </div>

          <div>
            <label className="hand-drawn block text-base font-bold mb-3 text-black">
              Solana Wallet Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={solanaAddress}
              onChange={(e) => onUpdate('solanaAddress', e.target.value)}
              required
              placeholder="Enter your Solana wallet address"
              readOnly={!!solanaAddress && solanaAddress.length > 20}
              className={`hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400 ${
                solanaAddress && solanaAddress.length > 20 ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
            />
            <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
              {solanaAddress && solanaAddress.length > 20
                ? 'Using your connected wallet address'
                : 'Wallet address where funds will be received'}
            </p>
          </div>

          <div className="border-4 border-black bg-white p-4">
            <label className="hand-drawn flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => onUpdate('isPublic', e.target.checked)}
                className="w-5 h-5 text-black border-4 border-black accent-yellow-400"
              />
              <span className="text-base font-bold text-black">Make project public</span>
            </label>
            <p className="hand-drawn mt-2 ml-8 text-sm font-semibold text-gray-700">
              Public projects are visible to everyone. Uncheck to keep it private.
            </p>
          </div>
        </div>
  );
}

