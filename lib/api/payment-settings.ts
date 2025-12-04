import { apiClient } from './client';

export interface PaymentSettings {
  minContributionAmountSol: number;
  minDealAmountSol: number;
  feePercentage: number;
  feeIncrementSol: number;
}

let cachedSettings: PaymentSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get public payment settings from backend
 * Cached for 5 minutes to reduce API calls
 */
export async function getPaymentSettings(forceRefresh = false): Promise<PaymentSettings> {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (!forceRefresh && cachedSettings && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSettings;
  }
  
  try {
    const settings = await apiClient.get<PaymentSettings>('/config/public/payment-settings');
    cachedSettings = settings;
    cacheTimestamp = now;
    return settings;
  } catch (error) {
    // Fallback to defaults if API fails
    console.warn('Failed to fetch payment settings, using defaults:', error);
    return {
      minContributionAmountSol: 0.1,
      minDealAmountSol: 10,
      feePercentage: 0.019,
      feeIncrementSol: 0.1,
    };
  }
}

/**
 * Get minimum contribution amount in SOL
 */
export async function getMinContributionAmount(): Promise<number> {
  const settings = await getPaymentSettings();
  return settings.minContributionAmountSol;
}

